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
    
    // Binding handlers
    this.handleWheel = this.handleWheel.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  /**
   * Binds global input event listeners.
   */
  init() {
    window.addEventListener('wheel', this.handleWheel, { passive: false });
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    window.addEventListener('touchend', this.handleTouchEnd, { passive: true });
  }

  /**
   * Unbinds global input event listeners.
   */
  destroy() {
    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchend', this.handleTouchEnd);
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

    // Determine direction intent (deltaY > 0 is scroll down, deltaY < 0 is scroll up)
    if (Math.abs(e.deltaY) > 5) {
      if (e.cancelable) e.preventDefault();
      
      if (e.deltaY > 0) {
        this.runtime.requestNext();
      } else {
        this.runtime.requestPrev();
      }
    }
  }

  /**
   * Evaluate arrow key intents.
   */
  handleKeyDown(e) {
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
    if (e.touches.length > 0) {
      this.touchStartY = e.touches[0].clientY;
    }
  }

  /**
   * Evaluate touch delta swipes.
   */
  handleTouchEnd(e) {
    if (this.runtime.isTransitionLocked() || e.changedTouches.length === 0) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = this.touchStartY - touchEndY; // Positive value means swipe UP (scrolling down)

    if (Math.abs(deltaY) >= this.swipeThreshold) {
      if (deltaY > 0) {
        this.runtime.requestNext();
      } else {
        this.runtime.requestPrev();
      }
    }
  }
}

export default InputManager;
