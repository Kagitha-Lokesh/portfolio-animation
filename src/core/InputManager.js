import { EventBus } from './EventBus';

/**
 * InputManager Class
 * Intercepts physical user input (mouse wheel, touch swipe, key presses).
 * Evaluates movement intent and translates it into navigation requests.
 */
export class InputManager {
  /**
   * @param {object} runtime - Reference to the core engine Runtime
   */
  constructor(runtime) {
    this.runtime = runtime;
    
    this.touchStartY = 0;
    this.swipeThreshold = 50; // px minimum swipe distance
    
    // Synced scrolling accumulators and thresholds
    this.triggerThreshold = 220; // px of accumulated delta force needed to trigger section change
    this.maxSingleEventContribution = 45; // cap to ensure no single click satisfies threshold
    this.decayResetMs = 250; // gap after which gesture force decays
    
    this.accumulatedWheelForce = 0;
    this.lastWheelTime = 0;
    this.wheelResetTimer = null;
    
    this.accumulatedTouchForce = 0;
    this.lastTouchTime = 0;
    this.lastTouchY = 0;
    this.touchResetTimer = null;

    // Binding handlers
    this.handleWheel = this.handleWheel.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  /**
   * Binds global input event listeners.
   */
  init() {
    window.addEventListener('wheel', this.handleWheel, { passive: false });
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    window.addEventListener('touchend', this.handleTouchEnd, { passive: true });
  }

  /**
   * Unbinds global input event listeners.
   */
  destroy() {
    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
  }

  /**
   * Normalize line-mode/page-mode deltas to approximate pixels.
   */
  normalizeDeltaY(e) {
    if (e.deltaMode === 1) return e.deltaY * 16; // DOM_DELTA_LINE
    if (e.deltaMode === 2) return e.deltaY * window.innerHeight; // DOM_DELTA_PAGE
    return e.deltaY; // DOM_DELTA_PIXEL
  }

  /**
   * Evaluate scroll intent and block default scrolling if locked.
   */
  handleWheel(e) {
    const isLocked = this.runtime.isTransitionLocked();
    
    // Block standard native scrolling during transitions
    if (isLocked) {
      if (e.cancelable) e.preventDefault();
      return;
    }

    if (e.cancelable) e.preventDefault();

    const now = performance.now();
    // If there's been a gap since the last wheel event, reset force
    if (now - this.lastWheelTime > this.decayResetMs) {
      const hadForce = this.accumulatedWheelForce !== 0;
      this.accumulatedWheelForce = 0;
      if (hadForce) {
        EventBus.emit("SCROLL_TENSION_RELEASE");
      }
    }
    this.lastWheelTime = now;

    const rawDelta = this.normalizeDeltaY(e);
    // Cap single tick contribution
    const cappedDelta = Math.sign(rawDelta) * Math.min(Math.abs(rawDelta), this.maxSingleEventContribution);
    this.accumulatedWheelForce += cappedDelta;

    clearTimeout(this.wheelResetTimer);
    this.wheelResetTimer = setTimeout(() => {
      const hadForce = this.accumulatedWheelForce !== 0;
      this.accumulatedWheelForce = 0;
      if (hadForce) {
        EventBus.emit("SCROLL_TENSION_RELEASE");
      }
    }, this.decayResetMs);

    if (Math.abs(this.accumulatedWheelForce) >= this.triggerThreshold) {
      const direction = this.accumulatedWheelForce > 0 ? 'next' : 'prev';
      this.accumulatedWheelForce = 0; // reset immediately
      
      // Reset visual tug once committed
      EventBus.emit("SCROLL_TENSION", { percent: 0, direction: 0 });
      
      if (direction === 'next') {
        this.runtime.requestNext();
      } else {
        this.runtime.requestPrev();
      }
    } else {
      // Emit tension percentage
      const forcePercent = Math.min(Math.abs(this.accumulatedWheelForce) / this.triggerThreshold, 1);
      const dir = Math.sign(this.accumulatedWheelForce);
      EventBus.emit("SCROLL_TENSION", { percent: forcePercent, direction: dir });
    }
  }

  /**
   * Evaluate arrow key intents.
   */
  handleKeyDown(e) {
    // If the user is currently typing in a text input or textarea, bypass keyboard navigation
    const activeEl = document.activeElement;
    if (activeEl && (
      activeEl.tagName === 'INPUT' || 
      activeEl.tagName === 'TEXTAREA' || 
      activeEl.isContentEditable
    )) {
      return;
    }

    if (this.runtime.isTransitionLocked()) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      this.runtime.requestNext();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      this.runtime.requestPrev();
    }
  }

  /**
   * Store start touch coordinate for swiping.
   */
  handleTouchStart(e) {
    if (e.touches.length === 1) {
      this.touchStartY = e.touches[0].clientY;
      this.lastTouchY = e.touches[0].clientY;
    }
  }

  /**
   * Evaluate touch delta swipes during move.
   */
  handleTouchMove(e) {
    if (this.runtime.isTransitionLocked() || e.touches.length !== 1) return;

    if (e.cancelable) e.preventDefault();

    const now = performance.now();
    // If there's been a gap since last touchmove event, reset force
    if (now - this.lastTouchTime > this.decayResetMs) {
      const hadForce = this.accumulatedTouchForce !== 0;
      this.accumulatedTouchForce = 0;
      if (hadForce) {
        EventBus.emit("SCROLL_TENSION_RELEASE");
      }
    }
    this.lastTouchTime = now;

    const currentY = e.touches[0].clientY;
    const deltaY = this.lastTouchY - currentY; // Positive value means swipe UP (scrolling down)
    this.lastTouchY = currentY;

    // Cap single touch drag update contribution
    const cappedDelta = Math.sign(deltaY) * Math.min(Math.abs(deltaY), this.maxSingleEventContribution);
    this.accumulatedTouchForce += cappedDelta;

    clearTimeout(this.touchResetTimer);
    this.touchResetTimer = setTimeout(() => {
      const hadForce = this.accumulatedTouchForce !== 0;
      this.accumulatedTouchForce = 0;
      if (hadForce) {
        EventBus.emit("SCROLL_TENSION_RELEASE");
      }
    }, this.decayResetMs);

    if (Math.abs(this.accumulatedTouchForce) >= this.triggerThreshold) {
      const direction = this.accumulatedTouchForce > 0 ? 'next' : 'prev';
      this.accumulatedTouchForce = 0; // reset immediately
      
      EventBus.emit("SCROLL_TENSION", { percent: 0, direction: 0 });
      
      if (direction === 'next') {
        this.runtime.requestNext();
      } else {
        this.runtime.requestPrev();
      }
    } else {
      // Emit tension percentage
      const forcePercent = Math.min(Math.abs(this.accumulatedTouchForce) / this.triggerThreshold, 1);
      const dir = Math.sign(this.accumulatedTouchForce);
      EventBus.emit("SCROLL_TENSION", { percent: forcePercent, direction: dir });
    }
  }

  /**
   * Safe stub, logic is handled on the fly inside handleTouchMove for smoother response.
   */
  handleTouchEnd() {
    // Touch trigger handled dynamically in handleTouchMove to feel responsive
  }
}

export default InputManager;
