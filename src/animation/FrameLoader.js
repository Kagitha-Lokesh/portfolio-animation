import { FrameCache } from './FrameCache';

/**
 * FrameLoader Class
 * Manages off-thread preloading and on-demand decoding.
 * Supports cancelling pending load tasks on active scrolls.
 */
export class FrameLoader {
  /**
   * @param {object} manifest - Compiled frame manifest
   * @param {FrameCache} cache - Central frame cache
   */
  constructor(manifest, cache) {
    this.manifest = manifest;
    this.cache = cache;
    this.total = manifest.frameCount;
    this.frames = manifest.frames;

    this.stage = 'BOOTING';
    this.isReady = false;
    this.loadedCount = 0;
    this.onProgress = null;

    this.isPreloadPaused = false;

    this.worker = new Worker(new URL('./decodeWorker.js', import.meta.url), { type: 'module' });
    this.worker.postMessage({ type: 'INIT', frames: this.frames });

    this.decodePromises = new Map();

    this.worker.onmessage = (e) => {
      const { type, index, img, error } = e.data;

      if (type === 'BLOB_LOADED') {
        this.loadedCount++;
        this.reportProgress();
        this.activeConnections = Math.max(0, this.activeConnections - 1);
        this.processQueue();
      }

      else if (type === 'FRAME_DECODED') {
        const promiseObj = this.decodePromises.get(index);
        if (promiseObj) {
          promiseObj.resolve(img);
          this.decodePromises.delete(index);
          this.lastSuccessfulFrameIndex = index;
        }
      }

      else if (type === 'DECODE_FAILED') {
        const promiseObj = this.decodePromises.get(index);
        if (promiseObj) {
          promiseObj.reject(new Error(error));
          this.decodePromises.delete(index);
        }
      }
    };

    this.maxConnections = 6;
    this.activeConnections = 0;
    this.pendingQueue = [];

    this.decodeTimeMs = 0.5;
    this.lastSuccessfulFrameIndex = 0;
  }

  /**
   * Cancels active decoding operations for specified indices.
   * Rejects their pending main-thread promises immediately.
   * @param {number[]} indices 
   */
  cancelDecodes(indices) {
    const activeCancelList = [];
    for (const idx of indices) {
      if (this.decodePromises.has(idx)) {
        const promiseObj = this.decodePromises.get(idx);
        promiseObj.reject(new DOMException('Aborted decode', 'AbortError'));
        this.decodePromises.delete(idx);
        activeCancelList.push(idx);
      }
    }

    if (activeCancelList.length > 0) {
      this.worker.postMessage({ type: 'CANCEL_DECODES', indices: activeCancelList });
    }
  }

  pausePreload() {
    this.isPreloadPaused = true;
  }

  resumePreload() {
    if (this.isPreloadPaused) {
      this.isPreloadPaused = false;
      if (this.stage === 'STAGE_3') {
        for (let i = 0; i < this.maxConnections; i++) {
          this.processQueue();
        }
      }
    }
  }

  /**
   * Dynamically re-prioritizes the preload queue based on current scroll position.
   * Prevents loading frames that are far away from viewport.
   */
  updateViewport(currentIndex, direction) {
    if (this.stage === 'BOOTING' || this.stage === 'LOADING' || this.stage === 'STAGE_1' || this.stage === 'STAGE_2') {
      return;
    }

    this.pendingQueue = [];
    const dir = direction || 1;
    const candidates = [];

    // Gather 30 frames ahead
    for (let i = 1; i <= 30; i++) {
      const idx = currentIndex + i * dir;
      if (idx >= 0 && idx < this.total && !this.cache.has(idx)) {
        candidates.push(idx);
      }
    }

    // Gather 8 frames behind
    for (let i = 1; i <= 8; i++) {
      const idx = currentIndex - i * dir;
      if (idx >= 0 && idx < this.total && !this.cache.has(idx)) {
        candidates.push(idx);
      }
    }

    // Sort by proximity to current frame
    candidates.sort((a, b) => Math.abs(a - currentIndex) - Math.abs(b - currentIndex));
    this.pendingQueue = candidates;

    // Resume queue processing
    this.isPreloadPaused = false;
    for (let i = 0; i < this.maxConnections; i++) {
      this.processQueue();
    }
  }

  /**
   * Forwards decode frame requests to worker.
   */
  async loadFrame(index) {
    if (this.decodePromises.has(index)) {
      return this.decodePromises.get(index).promise;
    }

    const filename = this.frames[index];
    const url = `${window.location.origin}/frames/${filename}`;

    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    this.decodePromises.set(index, { promise, resolve, reject });
    this.worker.postMessage({ type: 'DECODE_FRAME', index, url });

    return promise;
  }

  start(onProgressCallback) {
    this.onProgress = onProgressCallback;
    this.stage = 'LOADING';
    this.runStage1();
  }

  async runStage1() {
    this.stage = 'STAGE_1';
    try {
      const img = await this.loadFrame(0);
      this.cache.add(0, img, 0);
      this.loadedCount++;
      this.reportProgress();
      this.runStage2();
    } catch (err) {
      console.error('[FrameLoader] Stage 1 failed:', err);
    }
  }

  async runStage2() {
    this.stage = 'STAGE_2';
    const stage2Indices = Array.from({ length: 39 }, (_, i) => i + 1);

    let completed = 0;
    const loadNext = async (index) => {
      try {
        const img = await this.loadFrame(index);
        this.cache.add(index, img, 0);
        this.loadedCount++;
        this.reportProgress();
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn(`[FrameLoader] Stage 2 load failed for frame ${index}:`, err);
        }
      } finally {
        completed++;
        if (completed === stage2Indices.length) {
          this.isReady = true;
          this.runStage3();
        }
      }
    };

    stage2Indices.forEach((idx) => loadNext(idx));
  }

  runStage3() {
    this.stage = 'STAGE_3';

    for (let i = 40; i < this.total; i++) {
      this.pendingQueue.push(i);
    }

    for (let i = 0; i < this.maxConnections; i++) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.isPreloadPaused) return;

    if (this.pendingQueue.length === 0) {
      if (this.activeConnections === 0) {
        this.stage = 'COMPLETE';
        this.reportProgress();
      }
      return;
    }

    while (this.activeConnections < this.maxConnections && this.pendingQueue.length > 0) {
      const index = this.pendingQueue.shift();
      this.activeConnections++;

      const filename = this.frames[index];
      const url = `${window.location.origin}/frames/${filename}`;

      this.worker.postMessage({ type: 'FETCH_BLOB', index, url });
    }
  }

  reportProgress() {
    if (this.onProgress) {
      const percent = Math.round((this.loadedCount / this.total) * 100);
      this.onProgress(percent, this.loadedCount, this.stage);
    }
  }

  getAverageDecodeTime() {
    return this.decodeTimeMs;
  }
}
export default FrameLoader;
