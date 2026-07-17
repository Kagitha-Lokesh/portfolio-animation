import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollManager Class
 * Manages smooth scroll events, virtualized programmatic snap scrolling,
 * and input locking mechanisms.
 */
export class ScrollManager {
  static lenis = null;
  static activeIndex = 0;

  /**
   * Initializes Lenis smooth scrolling.
   */
  static init() {
    if (this.lenis) return;

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      syncTouch: true // sync scroll gestures on mobile touch devices
    });

    gsap.ticker.add((time) => {
      if (this.lenis) {
        this.lenis.raf(time * 1000);
      }
    });

    // Cap GSAP time-catch-up: prevents burst frame storms on slow hardware or
    // when returning to a background tab. 500ms threshold / 33ms max lag-gap.
    gsap.ticker.lagSmoothing(500, 33);
  }

  /**
   * Snaps viewport to a specific section index.
   * @param {number} sectionIndex 
   */
  static scrollToSection(sectionIndex) {
    if (!this.lenis) return;
    
    this.activeIndex = sectionIndex;
    const targetY = sectionIndex * window.innerHeight;

    this.lenis.scrollTo(targetY, {
      duration: 1.2,
      force: true
    });
  }

  /**
   * Locks all user scroll inputs.
   */
  static lock() {
    if (this.lenis) {
      this.lenis.stop();
    }
  }

  /**
   * Unlocks scroll inputs.
   */
  static unlock() {
    if (this.lenis) {
      this.lenis.start();
    }
  }

  static refresh() {
    ScrollTrigger.refresh();
  }

  static destroy() {
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
  }
}

export default ScrollManager;
