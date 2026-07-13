/**
 * PerformanceMonitor Class
 * Tracks FPS, registers dropped frames, and exposes rendering performance metrics.
 */
export class PerformanceMonitor {
  static fps = 60;
  static lastTime = performance.now();
  static frameCount = 0;
  static droppedFrames = 0;

  /**
   * Ticks frame counter and computes FPS averages every second.
   */
  static tick() {
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastTime;

    // Calculate FPS every 1000ms
    if (elapsed >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      
      // If FPS drops below a threshold, track cumulative drops
      if (this.fps < 45) {
        this.droppedFrames += Math.max(0, 60 - this.fps);
        console.warn(`[PerformanceMonitor] Drop detected: ${this.fps} FPS. Total cumulative drops: ${this.droppedFrames}`);
      }
      
      this.frameCount = 0;
      this.lastTime = now;
    }
  }

  /**
   * Returns current active telemetry logs.
   * @returns {{fps: number, droppedFrames: number}}
   */
  static getTelemetry() {
    return {
      fps: this.fps,
      droppedFrames: this.droppedFrames
    };
  }
}
export default PerformanceMonitor;
