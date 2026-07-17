// In-memory cache for blobs inside the worker thread
const blobCache = new Map();
// Active abort controllers registry (index => AbortController)
const abortControllers = new Map();

self.onmessage = async (e) => {
  const { type, index, url, frames, indices } = e.data;

  if (type === 'INIT') {
    self.frames = frames;
  }

  else if (type === 'CANCEL_DECODES' && indices) {
    for (const idx of indices) {
      if (abortControllers.has(idx)) {
        abortControllers.get(idx).abort();
        abortControllers.delete(idx);
      }
    }
  }

  else if (type === 'FETCH_BLOB') {
    if (blobCache.has(index)) {
      self.postMessage({ type: 'BLOB_LOADED', index, success: true });
      return;
    }

    const controller = new AbortController();
    abortControllers.set(index, controller);

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      blobCache.set(index, blob);
      self.postMessage({ type: 'BLOB_LOADED', index, success: true });
    } catch (err) {
      self.postMessage({
        type: 'BLOB_LOADED',
        index,
        success: false,
        error: err.message,
        aborted: err.name === 'AbortError'
      });
    } finally {
      abortControllers.delete(index);
    }
  }

  else if (type === 'DECODE_FRAME') {
    const controller = new AbortController();
    abortControllers.set(index, controller);

    try {
      let blob = blobCache.get(index);
      if (!blob) {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        blob = await response.blob();
        blobCache.set(index, blob);
      }

      if (controller.signal.aborted) {
        throw new DOMException('Aborted decode', 'AbortError');
      }

      // Bypass color space profile calculations to decode faster
      const img = await createImageBitmap(blob, {
        colorSpaceConversion: 'none',
        imageOrientation: 'none',
        premultiplyAlpha: 'default'
      });
      
      self.postMessage({ type: 'FRAME_DECODED', index, img }, [img]);
    } catch (err) {
      if (err.name !== 'AbortError') {
        self.postMessage({ type: 'DECODE_FAILED', index, error: err.message });
      }
    } finally {
      abortControllers.delete(index);
    }
  }
};
