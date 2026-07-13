import { PORTFOLIO_CONFIG } from '../config/portfolio.config';

/**
 * FrameScheduler Class
 * Determines predictive preloading queues based on current animation state,
 * active loops, and upcoming transitions.
 */
export class FrameScheduler {
  /**
   * @param {FrameLoader} loader 
   * @param {FrameCache} cache 
   */
  constructor(loader, cache) {
    this.loader = loader;
    this.cache = cache;
  }

  /**
   * Evaluates the active state and schedules appropriate background preloads.
   * @param {string} sectionId - Active section
   * @param {string} state - Active runtime state (e.g. SECTION_LOOP, SECTION_TRANSITION)
   * @param {number} direction - Scroll direction (1 = forward, -1 = reverse)
   * @param {number} currentFrame - Current playback frame index
   * @param {number} playbackDirection - Playback direction (1 = forward, -1 = reverse)
   */
  schedule(sectionId, state, direction = 1, currentFrame = -1, playbackDirection = 1) {
    if (!this.loader || !this.loader.isReady) return;

    const sections = PORTFOLIO_CONFIG.sections;
    const currentSec = sections[sectionId];
    if (!currentSec) return;

    this.loader.pausePreload();
    this.loader.pendingQueue = [];

    const loopStart = currentSec.animation.loop[0];
    const loopEnd = currentSec.animation.loop[1];

    // 1. Prioritize active loop frames based on playback direction
    if (currentFrame !== -1) {
      if (playbackDirection === 1) {
        // Forward: currentFrame -> loopEnd, then loopStart -> currentFrame
        for (let i = currentFrame; i <= loopEnd; i++) {
          if (!this.cache.has(i)) this.loader.queueFrame(i);
        }
        for (let i = loopStart; i < currentFrame; i++) {
          if (!this.cache.has(i)) this.loader.queueFrame(i);
        }
      } else {
        // Reverse: currentFrame -> loopStart, then loopEnd -> currentFrame
        for (let i = currentFrame; i >= loopStart; i--) {
          if (!this.cache.has(i)) this.loader.queueFrame(i);
        }
        for (let i = loopEnd; i > currentFrame; i--) {
          if (!this.cache.has(i)) this.loader.queueFrame(i);
        }
      }
    } else {
      // Default: load entire loop sequentially
      for (let i = loopStart; i <= loopEnd; i++) {
        if (!this.cache.has(i)) {
          this.loader.queueFrame(i);
        }
      }
    }

    // 2. Prioritize active transition frames if currently animating
    if (state === 'SECTION_TRANSITION' || state === 'SECTION_ACTIVE') {
      const enterStart = currentSec.animation.enter[0];
      const enterEnd = currentSec.animation.enter[1];
      for (let i = enterStart; i <= enterEnd; i++) {
        if (!this.cache.has(i)) {
          this.loader.queueFrame(i);
        }
      }

      if (currentSec.animation.exit) {
        const exitStart = currentSec.animation.exit[0];
        const exitEnd = currentSec.animation.exit[1];
        for (let i = exitStart; i <= exitEnd; i++) {
          if (!this.cache.has(i)) {
            this.loader.queueFrame(i);
          }
        }
      }
    }

    // 3. Predictive Preload: Look ahead at the next/previous section depending on direction
    const sectionIds = Object.keys(sections);
    const currentIndex = sectionIds.indexOf(sectionId);
    
    if (direction === 1) {
      // Preload next section
      const nextIndex = currentIndex + 1;
      if (nextIndex < sectionIds.length) {
        const nextSecId = sectionIds[nextIndex];
        const nextSec = sections[nextSecId];
        
        // Queue next enter frames
        for (let i = nextSec.animation.enter[0]; i <= nextSec.animation.enter[1]; i++) {
          this.loader.queueFrame(i);
        }
        // Queue next loop frames
        for (let i = nextSec.animation.loop[0]; i <= nextSec.animation.loop[1]; i++) {
          this.loader.queueFrame(i);
        }
      }
    } else {
      // Preload previous section
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        const prevSecId = sectionIds[prevIndex];
        const prevSec = sections[prevSecId];
        
        // Queue previous loop frames
        for (let i = prevSec.animation.loop[0]; i <= prevSec.animation.loop[1]; i++) {
          this.loader.queueFrame(i);
        }
        // Queue previous exit frames (as we play them in reverse on scroll up)
        if (prevSec.animation.exit) {
          for (let i = prevSec.animation.exit[0]; i <= prevSec.animation.exit[1]; i++) {
            this.loader.queueFrame(i);
          }
        }
      }
    }

    this.loader.resumePreload();
  }
}

export default FrameScheduler;
