/**
 * FrameCache Class
 * Manages memory-aware caching of decoded image frames.
 * Evicts frames furthest from the active target frame to ensure we stay within limits.
 */
export class FrameCache {
  /**
   * @param {number} limitBytes - Maximum memory limit in bytes
   */
  constructor(limitBytes = 384 * 1024 * 1024) {
    this.limit = limitBytes;
    this.cache = new Map(); // globalFrameIndex => ImageBitmap
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Modifies memory bounds.
   * @param {number} limitBytes 
   */
  setLimit(limitBytes) {
    this.limit = limitBytes;
    this.evict();
  }

  /**
   * Retrieves image from cache.
   * @param {number} index 
   * @returns {ImageBitmap|null}
   */
  get(index) {
    if (this.cache.has(index)) {
      this.hits++;
      return this.cache.get(index);
    }
    this.misses++;
    return null;
  }

  /**
   * Checks if frame is cached.
   * @param {number} index 
   * @returns {boolean}
   */
  has(index) {
    return this.cache.has(index);
  }

  /**
   * Adds decoded image to cache and runs eviction.
   * @param {number} index 
   * @param {ImageBitmap} image 
   * @param {number} currentIndex - Viewport's active frame index
   */
  add(index, image, currentIndex = 0) {
    this.cache.set(index, image);
    this.evict(currentIndex);
  }

  /**
   * Frees GPU memory and evicts frames furthest from the currentIndex.
   * @param {number} currentIndex 
   */
  evict(currentIndex = 0) {
    const bytesPerFrame = 1920 * 1080 * 4;
    const maxCachedFrames = Math.floor(this.limit / bytesPerFrame);

    if (this.cache.size <= maxCachedFrames) return;

    // Sort cached frames by absolute distance to current frame (descending)
    const keys = Array.from(this.cache.keys());
    keys.sort((a, b) => Math.abs(b - currentIndex) - Math.abs(a - currentIndex));

    // Delete furthest keys
    const excess = this.cache.size - maxCachedFrames;
    for (let i = 0; i < excess; i++) {
      const key = keys[i];
      const img = this.cache.get(key);
      if (img && typeof img.close === 'function') {
        img.close();
      }
      this.cache.delete(key);
    }
  }

  /**
   * Returns cache performance statistics.
   * @returns {object}
   */
  getMetrics() {
    const total = this.hits + this.misses;
    const bytesPerFrame = 1920 * 1080 * 4;
    const memoryUsedMb = (this.cache.size * bytesPerFrame) / (1024 * 1024);

    return {
      cachedCount: this.cache.size,
      memoryUsedMb: Math.round(memoryUsedMb),
      hitRatio: total > 0 ? Math.round((this.hits / total) * 100) : 0,
      missRatio: total > 0 ? Math.round((this.misses / total) * 100) : 0
    };
  }

  /**
   * Flushes all frames and frees graphics memory.
   */
  clear() {
    for (const img of this.cache.values()) {
      if (img && typeof img.close === 'function') {
        img.close();
      }
    }
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

export default FrameCache;
