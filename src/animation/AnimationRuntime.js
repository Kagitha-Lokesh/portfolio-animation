import { FrameCache } from './FrameCache';
import { FrameLoader } from './FrameLoader';
import { ScrollManager } from './ScrollManager';
import { fitCover, getDeviceProfile } from './fitCover';

/**
 * AnimationRuntime Class
 * Coordinates rendering loops, canvas paints, and predictive preloading.
 * Optimized for production to avoid garbage collections and React redraw stalls:
 * 1. Pre-allocated bounds object to avoid memory footprint sweeps.
 * 2. In-place mutable state object updates.
 * 3. Throttled metrics state publications (300ms interval).
 * 4. Active queue decodes cancel list execution.
 * 5. Canvas overdraw and state switch caching.
 */
class AnimationRuntimeClass {
  constructor() {
    // Mutable state object
    this.state = {
      runtimeState: 'BOOTING',
      currentFrame: 0,
      targetFrame: 0,
      scrollProgress: 0,
      loadedPercent: 0,
      fps: 60,
      droppedFrames: 0,
      renderTimeMs: '0.0',
      decodeTimeMs: '0.0',
      cacheHitRatio: 0,
      cacheMissRatio: 0,
      totalFrames: 1034,
      viewport: { width: 0, height: 0 },
      deviceProfile: 'DESKTOP',
      camera: { focusX: 0.38, focusY: 0.50, zoom: 1.0, brightness: 1.0 }
    };

    this.listeners = new Set();
    
    this.canvas = null;
    this.ctx = null;
    this.frameLoader = null;
    this.frameCache = null;
    
    this.isRunning = false;
    this.isReady = false;

    this.lastFrameIndex = -1;
    this.easedFrame = 0;
    
    this.fpsFrameCount = 0;
    this.fpsLastTime = performance.now();
    this.lastLoopTime = performance.now();
    
    this.isManualScrubberActive = false;
    
    this.decodingTracker = new Set();
    this.preWarmTimeout = null;

    // Pre-allocated bounds object to prevent garbage allocation on tick draw loops
    this.bounds = {
      sx: 0, sy: 0, sWidth: 0, sHeight: 0,
      x: 0, y: 0, width: 0, height: 0,
      scale: 1.0, cropX: 0, cropY: 0
    };

    // Throttle timing control for non-scroll telemetry (FPS, Latency, Cache ratio)
    this.lastMetricsPublishTime = 0;
    this.cachedMetrics = {
      renderTimeMs: '0.0',
      decodeTimeMs: '0.0',
      cacheHitRatio: 0,
      cacheMissRatio: 0
    };

    // Cached filter state to avoid costly context state triggers
    this.lastAppliedFilter = '';
  }

  /**
   * Initializes components.
   */
  async init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isReady = false;
    this.isManualScrubberActive = false;

    const profile = getDeviceProfile();
    this.updateState({
      runtimeState: 'BOOTING',
      deviceProfile: profile.name,
      camera: { focusX: profile.focusX, focusY: profile.focusY, zoom: 1.0, brightness: 1.0 }
    });

    try {
      const response = await fetch('/frames/manifest.json');
      const manifest = await response.json();

      this.frameCache = new FrameCache(profile.cacheLimit);
      this.frameLoader = new FrameLoader(manifest, this.frameCache);

      this.updateState({ 
        runtimeState: 'LOADING',
        totalFrames: manifest.frameCount
      });

      this.frameLoader.start((percent, loadedCount, stage) => {
        this.updateState({ loadedPercent: percent });
        
        if (this.frameLoader.isReady && !this.isReady) {
          this.isReady = true;
          this.updateState({ runtimeState: 'READY' });
          this.startLoop();
        }
      });
    } catch (err) {
      console.error('[AnimationRuntime] Failed to load frame manifest:', err);
      this.updateState({ runtimeState: 'ERROR' });
    }
    
    this.resize();
  }

  startLoop() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastLoopTime = performance.now();
    this.loop();
  }

  stopLoop() {
    this.isRunning = false;
  }

  updateCamera(partialCamera) {
    Object.assign(this.state.camera, partialCamera);
    this.draw();
  }

  /**
   * Mutates the state in-place to avoid GC object allocation sweeps.
   */
  updateState(partialState) {
    Object.assign(this.state, partialState);
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  resize() {
    if (!this.canvas || !this.ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;

    const profile = getDeviceProfile();
    if (this.frameCache) {
      this.frameCache.setLimit(profile.cacheLimit);
    }

    this.updateState({
      viewport: { width, height },
      deviceProfile: profile.name,
      runtimeState: 'RESIZING'
    });

    this.draw();

    setTimeout(() => {
      if (this.isReady && this.state.runtimeState === 'RESIZING') {
        this.updateState({ runtimeState: 'READY' });
      }
    }, 150);
  }

  scrubTo(frameIndex) {
    this.isManualScrubberActive = true;
    this.easedFrame = frameIndex;
    
    this.updateState({
      targetFrame: frameIndex,
      currentFrame: frameIndex,
      scrollProgress: frameIndex / (this.frameLoader.total - 1)
    });
    
    this.draw();
  }

  releaseScrubber() {
    this.isManualScrubberActive = false;
  }

  loop() {
    if (!this.isRunning) return;

    const now = performance.now();
    const elapsedSinceLastFrame = now - this.lastLoopTime;
    this.lastLoopTime = now;

    this.fpsFrameCount++;
    if (now - this.fpsLastTime >= 1000) {
      const activeFps = Math.round((this.fpsFrameCount * 1000) / (now - this.fpsLastTime));
      // Only notify listeners if fps value actually changed — avoids firing
      // the full subscriber chain every second just to report the same value.
      if (activeFps !== this.state.fps) {
        this.updateState({ fps: activeFps });
      }
      this.fpsFrameCount = 0;
      this.fpsLastTime = now;
    }

    if (elapsedSinceLastFrame > 22 && this.isReady) {
      this.updateState({ droppedFrames: this.state.droppedFrames + 1 });
    }

    if (this.isReady && !this.isManualScrubberActive) {
      const scrollProgress = ScrollManager.getProgress();
      const totalFrames = this.frameLoader.total;
      
      const targetFrame = scrollProgress * (totalFrames - 1);
      
      // Directly track smooth Lenis scroll position to avoid double-easing input lag
      this.easedFrame = targetFrame;

      const currentFrameIndex = Math.round(this.easedFrame);
      const scrollVelocity = ScrollManager.getVelocity();
      const isIdle = Math.abs(targetFrame - this.easedFrame) < 0.01;
      
      const nextRuntimeState = isIdle ? 'IDLE' : 'SCROLLING';

      if (this.frameLoader) {
        if (nextRuntimeState === 'SCROLLING') {
          const direction = scrollVelocity > 0 ? 1 : -1;
          this.frameLoader.updateViewport(currentFrameIndex, direction);
        } else {
          this.frameLoader.resumePreload();
        }
      }

      // Only call updateState (which notifies all subscribers) when something
      // actually changed. Idle ticks where nothing moves skip the listener chain.
      const scrollChanged   = scrollProgress !== this.state.scrollProgress;
      const frameChanged    = currentFrameIndex !== this.lastFrameIndex;
      const stateChanged    = nextRuntimeState !== this.state.runtimeState;

      if (scrollChanged || frameChanged || stateChanged) {
        this.updateState({
          scrollProgress,
          targetFrame: Math.round(targetFrame),
          currentFrame: currentFrameIndex,
          runtimeState: nextRuntimeState
        });
      }

      if (frameChanged) {
        this.draw();
        
        if (scrollVelocity !== 0) {
          const direction = scrollVelocity > 0 ? 1 : -1;
          this.triggerPreWarm(currentFrameIndex, direction);
        }
      }
    }

    requestAnimationFrame(() => this.loop());
  }

  triggerPreWarm(currentIndex, direction) {
    if (this.decodingTracker.size >= 6) return;

    if (this.preWarmTimeout) {
      cancelAnimationFrame(this.preWarmTimeout);
    }
    
    this.preWarmTimeout = requestAnimationFrame(() => {
      const targets = [];
      
      // Pre-warm 12 frames ahead (scrolling direction)
      for (let i = 1; i <= 12; i++) {
        const targetIdx = currentIndex + i * direction;
        if (targetIdx >= 0 && targetIdx < this.frameLoader.total) {
          if (!this.frameCache.has(targetIdx) && !this.decodingTracker.has(targetIdx)) {
            targets.push(targetIdx);
          }
        }
      }
      
      // Pre-warm 4 frames behind (reverse scroll buffer)
      for (let i = 1; i <= 4; i++) {
        const targetIdx = currentIndex - i * direction;
        if (targetIdx >= 0 && targetIdx < this.frameLoader.total) {
          if (!this.frameCache.has(targetIdx) && !this.decodingTracker.has(targetIdx)) {
            targets.push(targetIdx);
          }
        }
      }

      if (targets.length === 0) return;

      const decodeNext = () => {
        if (targets.length === 0) return;
        const idx = targets.shift();
        
        this.decodingTracker.add(idx);
        this.frameLoader.loadFrame(idx)
          .then((img) => {
            this.frameCache.add(idx, img, currentIndex);
            this.decodingTracker.delete(idx);
            
            if (window.requestIdleCallback) {
              window.requestIdleCallback(decodeNext);
            } else {
              setTimeout(decodeNext, 4);
            }
          })
          .catch(() => {
            this.decodingTracker.delete(idx);
          });
      };

      decodeNext();
    });
  }

  draw() {
    if (!this.canvas || !this.ctx || !this.frameLoader || !this.frameCache) return;

    const renderStart = performance.now();
    const frameIndex = Math.round(this.easedFrame);
    
    let img = this.frameCache.get(frameIndex);
    
    // Abort active decodes that are far outside the current viewport sliding window (width: 6)
    const cancelList = [];
    for (const pendingIdx of this.decodingTracker) {
      if (Math.abs(pendingIdx - frameIndex) > 6) {
        cancelList.push(pendingIdx);
        this.decodingTracker.delete(pendingIdx);
      }
    }
    if (cancelList.length > 0) {
      this.frameLoader.cancelDecodes(cancelList);
    }
    
    if (!img) {
      if (!this.decodingTracker.has(frameIndex)) {
        const isTarget = frameIndex === Math.round(this.state.targetFrame);
        const maxBusyQueue = 6; // High concurrency for JPEG decodes

        if (this.decodingTracker.size < maxBusyQueue || isTarget) {
          this.decodingTracker.add(frameIndex);
          
          this.frameLoader.loadFrame(frameIndex)
            .then((loadedImg) => {
              this.frameCache.add(frameIndex, loadedImg, frameIndex);
              this.decodingTracker.delete(frameIndex);
              
              if (Math.round(this.easedFrame) === frameIndex) {
                this.draw();
              }
            })
            .catch(() => {
              this.decodingTracker.delete(frameIndex);
            });
        }
      }
      return;
    }

    const cWidth = this.canvas.width;
    const cHeight = this.canvas.height;
    const imgWidth = img.width || 1920;
    const imgHeight = img.height || 1080;

    // Mutate pre-allocated bounds object instead of returning a new one
    fitCover(cWidth, cHeight, imgWidth, imgHeight, this.state.camera, this.bounds);

    // Cache context filter property to prevent heavy DOM/canvas engine pipeline state chokes
    const desiredFilter = (this.state.camera.brightness !== undefined && this.state.camera.brightness !== 1.0)
      ? `brightness(${this.state.camera.brightness})`
      : 'none';

    if (this.lastAppliedFilter !== desiredFilter) {
      this.ctx.filter = desiredFilter;
      this.lastAppliedFilter = desiredFilter;
    }

    // BYPASS OVERDRAW: Since the bounds always cover the full canvas, clearRect is 100% redundant
    this.ctx.drawImage(
      img,
      this.bounds.sx,
      this.bounds.sy,
      this.bounds.sWidth,
      this.bounds.sHeight,
      this.bounds.x,
      this.bounds.y,
      this.bounds.width,
      this.bounds.height
    );

    this.lastFrameIndex = frameIndex;
    const renderEnd = performance.now();

    // Throttle non-scroll telemetry metrics publications to once every 300ms
    const timeNow = performance.now();
    if (timeNow - this.lastMetricsPublishTime > 300) {
      const cacheStats = this.frameCache.getMetrics();
      this.cachedMetrics.renderTimeMs = (renderEnd - renderStart).toFixed(1);
      this.cachedMetrics.decodeTimeMs = this.frameLoader.getAverageDecodeTime().toFixed(1);
      this.cachedMetrics.cacheHitRatio = cacheStats.hitRatio;
      this.cachedMetrics.cacheMissRatio = cacheStats.missRatio;
      this.lastMetricsPublishTime = timeNow;

      this.updateState(this.cachedMetrics);
    }
  }

  destroy() {
    this.stopLoop();
    if (this.preWarmTimeout) {
      cancelAnimationFrame(this.preWarmTimeout);
    }
    if (this.frameCache) {
      this.frameCache.clear();
    }
    this.updateState({ runtimeState: 'DESTROYED' });
    this.listeners.clear();
  }
}

export const AnimationRuntime = new AnimationRuntimeClass();
export default AnimationRuntime;
