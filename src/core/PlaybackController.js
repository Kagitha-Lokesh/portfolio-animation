import { EventBus } from './EventBus';

/**
 * PlaybackController Class
 * Manages low-level frame animation playback timing.
 * Drives forward/backward animations and loops at target framerates (e.g. 12 FPS).
 */
export class PlaybackController {
  constructor() {
    this.currentFrame = 0;
    this.startFrame = 0;
    this.endFrame = 0;
    this.fps = 12;
    
    this.isPlaying = false;
    this.isLooping = false;
    this.direction = 1; // 1 = forward, -1 = backward
    
    this.lastFrameTime = 0;
    this.onFrameCallback = null;
    this.onCompleteCallback = null;
  }

  /**
   * Configures and starts playback.
   */
  play(start, end, options = {}) {
    this.startFrame = start;
    this.endFrame = end;
    this.fps = options.fps || 12;
    this.isLooping = options.loop || false;
    this.direction = options.direction !== undefined ? options.direction : 1;
    this.onFrameCallback = options.onFrame || null;
    this.onCompleteCallback = options.onComplete || null;

    // Set initial frame if specified
    if (options.initialFrame !== undefined) {
      this.currentFrame = options.initialFrame;
    } else {
      this.currentFrame = this.direction === 1 ? this.startFrame : this.endFrame;
    }

    this.isPlaying = true;
    this.lastFrameTime = performance.now();

    this.triggerFrameChange();
  }

  /**
   * Stop current playback sequence.
   */
  stop() {
    this.isPlaying = false;
  }

  /**
   * Update frame cursor relative to time delta.
   * Called by the central requestAnimationFrame tick loop.
   */
  tick(now) {
    if (!this.isPlaying) return;

    const frameDurationMs = 1000 / this.fps;
    const elapsed = now - this.lastFrameTime;

    if (elapsed >= frameDurationMs) {
      this.lastFrameTime = now - (elapsed % frameDurationMs);

      if (this.direction === 1) {
        this.currentFrame++;
        if (this.currentFrame > this.endFrame) {
          if (this.isLooping) {
            this.currentFrame = this.endFrame - 1;
            this.direction = -1;
          } else {
            this.isPlaying = false;
            this.currentFrame = this.endFrame;
            if (this.onCompleteCallback) this.onCompleteCallback();
          }
        }
      } else {
        // Backward playback
        this.currentFrame--;
        if (this.currentFrame < this.startFrame) {
          if (this.isLooping) {
            this.currentFrame = this.startFrame + 1;
            this.direction = 1;
          } else {
            this.isPlaying = false;
            this.currentFrame = this.startFrame;
            if (this.onCompleteCallback) this.onCompleteCallback();
          }
        }
      }

      this.triggerFrameChange();
    }
  }

  /**
   * Set specific frame immediately.
   */
  setFrame(frameIndex) {
    this.currentFrame = frameIndex;
    this.triggerFrameChange();
  }

  triggerFrameChange() {
    if (this.onFrameCallback) {
      this.onFrameCallback(this.currentFrame);
    }
    EventBus.emit('FRAME_CHANGED', this.currentFrame);
  }
}

export default PlaybackController;
