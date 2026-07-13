/**
 * FrameLoader Class
 * Manages off-thread loading and on-demand decoding of frame assets.
 * Fetches structured frame groupings based on `/assets/experiences/manifest.json`.
 */
export class FrameLoader {
  /**
   * @param {FrameCache} cache - Main thread frame cache
   */
  constructor(cache) {
    this.cache = cache;
    this.manifest = null;
    this.total = 0;
    this.flatUrls = []; // Maps global frame index -> absolute URL path
    
    this.stage = 'BOOTING';
    this.isReady = false;
    this.loadedCount = 0;
    this.onProgress = null;

    this.isPreloadPaused = false;
    this.decodePromises = new Map();

    // Create decode worker relative to this file
    this.worker = new Worker(new URL('./decodeWorker.js', import.meta.url), { type: 'module' });

    this.worker.onmessage = (e) => {
      const { type, index, img, error } = e.data;

      if (type === 'BLOB_LOADED') {
        this.loadedCount++;
        this.reportProgress();
      }

      else if (type === 'FRAME_DECODED') {
        const promiseObj = this.decodePromises.get(index);
        if (promiseObj) {
          promiseObj.resolve(img);
          this.decodePromises.delete(index);
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
  }

  /**
   * Fetches the dynamic assets manifest and registers frame URLs.
   */
  async init() {
    const response = await fetch('/assets/experiences/manifest.json');
    this.manifest = await response.json();
    this.total = this.manifest.totalFrames;

    // Flatten URLs in order of sections
    const sectionOrder = [
      "home", "about", "skills", "techstack", "projects", 
      "experience", "education", "achievements", "contact"
    ];

    this.flatUrls = new Array(this.total);
    let indexOffset = 0;

    for (const sectionId of sectionOrder) {
      const paths = this.manifest.sections[sectionId];
      if (paths) {
        for (let i = 0; i < paths.length; i++) {
          const globalIdx = indexOffset + i;
          if (globalIdx < this.total) {
            this.flatUrls[globalIdx] = `${window.location.origin}/${paths[i]}`;
          }
        }
        indexOffset += paths.length;
      }
    }

    this.worker.postMessage({ type: 'INIT', frames: this.flatUrls });
  }

  /**
   * Cancels active decoding operations for specified indices.
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
      this.processQueue();
    }
  }

  /**
   * Queue frame index for pre-fetching / decoding.
   */
  queueFrame(index) {
    if (this.cache.has(index) || this.pendingQueue.includes(index)) return;
    this.pendingQueue.push(index);
    this.processQueue();
  }

  /**
   * Direct trigger to decode a specific frame immediately.
   */
  async loadFrame(index) {
    if (index < 0 || index >= this.total) {
      return Promise.reject(new Error(`Index ${index} out of range.`));
    }

    if (this.decodePromises.has(index)) {
      return this.decodePromises.get(index).promise;
    }

    const url = this.flatUrls[index];
    if (!url) {
      return Promise.reject(new Error(`URL for index ${index} not resolved.`));
    }

    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    this.decodePromises.set(index, { promise, resolve, reject });
    this.worker.postMessage({ type: 'DECODE_FRAME', index, url });

    return promise;
  }

  /**
   * Starts loading process relative to the initial section's frames.
   */
  start(initialSection, onProgressCallback) {
    this.onProgress = onProgressCallback;
    this.stage = 'PRELOADING';
    this.runStage1(initialSection);
  }

  /**
   * Stage 1: Load the very first frame of the active section.
   */
  async runStage1(section) {
    const startFrame = section.animation.enter[0];
    try {
      const img = await this.loadFrame(startFrame);
      this.cache.add(startFrame, img, startFrame);
      this.loadedCount++;
      this.reportProgress();
      this.runStage2(section);
    } catch (err) {
      console.error('[FrameLoader] Stage 1 failed to load initial frame:', err);
    }
  }

  /**
   * Stage 2: Preload the active section's entire loop range.
   * Once cached, the runtime is marked READY for loop playback.
   */
  async runStage2(section) {
    const enterStart = section.animation.enter[0];
    const enterEnd = section.animation.enter[1];
    const loopStart = section.animation.loop[0];
    const loopEnd = section.animation.loop[1];

    const preloadFrames = new Set();
    for (let i = enterStart; i <= enterEnd; i++) {
      preloadFrames.add(i);
    }
    for (let i = loopStart; i <= loopEnd; i++) {
      preloadFrames.add(i);
    }

    const framesArray = Array.from(preloadFrames);
    let completed = 0;
    const totalFrames = framesArray.length;

    const loadNext = async (idx) => {
      try {
        const img = await this.loadFrame(idx);
        this.cache.add(idx, img, loopStart);
        this.loadedCount++;
        this.reportProgress();
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn(`[FrameLoader] Stage 2 failed on frame ${idx}:`, err);
        }
      } finally {
        completed++;
        if (completed === totalFrames) {
          this.isReady = true;
          this.stage = 'READY';
          this.reportProgress();
          this.runStage3(section);
        }
      }
    };

    framesArray.forEach(idx => loadNext(idx));
  }

  /**
   * Stage 3: Load the remainder of the current section (enter and exit ranges).
   */
  runStage3(section) {
    const enterStart = section.animation.enter[0];
    const enterEnd = section.animation.enter[1];
    const exitStart = section.animation.exit ? section.animation.exit[0] : -1;
    const exitEnd = section.animation.exit ? section.animation.exit[1] : -1;

    // Load remaining frames of current section in background
    for (let i = enterStart; i <= enterEnd; i++) {
      this.queueFrame(i);
    }

    if (exitStart !== -1) {
      for (let i = exitStart; i <= exitEnd; i++) {
        this.queueFrame(i);
      }
    }
  }

  async processQueue() {
    if (this.isPreloadPaused || this.pendingQueue.length === 0) return;
    if (this.activeConnections >= this.maxConnections) return;

    const index = this.pendingQueue.shift();
    this.activeConnections++;

    const url = this.flatUrls[index];
    this.worker.postMessage({ type: 'FETCH_BLOB', index, url });

    // Throttle queue connections slightly to prevent thread choke
    setTimeout(() => {
      this.activeConnections--;
      this.processQueue();
    }, 4);
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
