/**
 * SceneClock.js
 *
 * Normalized 0→1 time driver for cinematic transitions.
 *
 * Instead of every module independently listening to EventBus events
 * and potentially getting out of sync, they all register callbacks at
 * specific normalized times (0.0–1.0). The TransitionDirector starts the
 * clock when ENV_BUILD begins, and all registered callbacks fire in perfect
 * sync at their declared time.
 *
 * Default sceneTime budget (ENV_BUILD → ACTIVE):
 *   0.00 → ENV_BUILD starts, ambient particles begin
 *   0.15 → Decoration layer first hints (lines, ambient glow)
 *   0.35 → Decoration nodes / primary elements appear
 *   0.52 → Typography starts (title sharpens from blur)
 *   0.68 → Cards materialize (glass appears with physical mass)
 *   0.85 → Buttons lift, glow activates (interactive layer)
 *   1.00 → ACTIVE state, clock resets
 */

import { gsap } from 'gsap';

export class SceneClock {
  constructor() {
    this._timeline  = null;
    this._duration  = 1200;   // default total ms (overridden per section)
    this._progress  = 0;
    this._callbacks = [];
  }

  /**
   * Start the clock for a new section entry.
   * @param {number} totalMs - Total duration of the ENV_BUILD→ACTIVE window in ms.
   */
  start(totalMs = 1200) {
    // Kill any running clock first
    if (this._timeline) {
      this._timeline.kill();
    }

    this._duration  = totalMs;
    this._progress  = 0;
    this._callbacks = [];

    this._timeline = gsap.timeline();
    this._timeline.to(this, {
      _progress: 1,
      duration:  totalMs / 1000,
      ease:      'none',
      onUpdate:  () => this._tick(),
    });
  }

  /**
   * Register a callback at a normalized time position.
   * @param {number} normalizedTime - Value between 0.0 and 1.0
   * @param {function} callback
   */
  at(normalizedTime, callback) {
    const targetMs = normalizedTime * this._duration;
    this._callbacks.push({ normalizedTime, targetMs, callback, fired: false });
  }

  /** Called every GSAP tick while the clock is running */
  _tick() {
    const elapsed = this._progress * this._duration;
    for (const entry of this._callbacks) {
      if (!entry.fired && elapsed >= entry.targetMs) {
        entry.fired = true;
        try {
          entry.callback();
        } catch (err) {
          console.error('[SceneClock] Callback error at t=', entry.normalizedTime, err);
        }
      }
    }
  }

  /** Kill the clock immediately */
  stop() {
    if (this._timeline) {
      this._timeline.kill();
      this._timeline = null;
    }
    this._progress  = 0;
    this._callbacks = [];
  }

  /** Current normalized progress (0→1) */
  get progress() { return this._progress; }

  /** True if clock is currently running */
  get isRunning() { return this._timeline?.isActive() ?? false; }
}

export default SceneClock;
