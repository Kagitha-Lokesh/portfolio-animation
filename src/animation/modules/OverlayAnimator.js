/**
 * OverlayAnimator.js
 *
 * Owns: Section overlay container orchestration + depth parallax.
 *
 * - Sets data-cinematic-state on .section-overlay-container elements
 * - Applies depth-based parallax on SCROLL_TENSION events
 * - Activates interactive elements (buttons) at sceneTime 0.85
 * - Manages pointer-events correctly throughout the state machine
 *
 * PERF: DOM queries for parallax layers are cached and only rebuilt on
 * section transitions — never inside the per-scroll-event hot path.
 */

import { gsap } from 'gsap';
import { EventBus } from '../../core/EventBus';
import { SCENE_LAYERS, MAX_PARALLAX_PX } from '../SceneGraph';
import { SCENE_DNA } from '../SceneDNA';

export class OverlayAnimator {
  constructor() {
    this._listeners = [];

    // Pre-cached element arrays per layer selector.
    // Built lazily on first scroll tension, invalidated on section changes.
    this._layerElCache = null;

    // Depth parallax on scroll tension
    this._listeners.push(
      EventBus.on('SCROLL_TENSION', ({ percent, direction }) => {
        this._applyDepthParallax(percent, direction);
      })
    );

    this._listeners.push(
      EventBus.on('SCROLL_TENSION_RELEASE', () => {
        this._resetDepthParallax();
      })
    );
  }

  onStateChange(state, context) {
    // Invalidate element cache when transitioning between sections
    // so newly active/dormant elements are correctly picked up.
    if (state === 'EXIT_SYNC' || state === 'ENV_BUILD') {
      this._layerElCache = null;
    }

    // Update data-cinematic-state on all active overlay containers
    if (context.from) {
      const fromContainer = document.querySelector(
        `.section-overlay-container[data-section="${context.from}"]`
      );
      if (fromContainer) fromContainer.dataset.cinematicState = state === 'ACTIVE' ? 'idle' : 'exiting';
    }

    if (context.to) {
      const toContainer = document.querySelector(
        `.section-overlay-container[data-section="${context.to}"]`
      );
      if (toContainer) {
        const stateMap = {
          ENV_BUILD:     'building',
          CONTENT_BUILD: 'building',
          ACTIVE:        'active',
          LOOPING:       'looping',
          IDLE:          'idle',
        };
        toContainer.dataset.cinematicState = stateMap[state] ?? state.toLowerCase();
      }
    }
  }

  /**
   * Called by TransitionDirector at sceneTime 0.85.
   * Activates buttons with lift + glow effect.
   */
  activateInteractive(sectionId) {
    const dna       = SCENE_DNA[sectionId];
    const container = document.querySelector(
      `.section-overlay-container[data-section="${sectionId}"]`
    );
    if (!container || !dna) return;

    const buttons   = container.querySelectorAll('.cta-button, .submit-btn');

    if (!buttons.length) return;

    gsap.fromTo(Array.from(buttons),
      { opacity: 0, y: 10, scale: 0.97 },
      {
        opacity:  1,
        y:        0,
        scale:    1,
        duration: 0.45,
        ease:     dna.cardMass === 'light' ? 'back.out(1.5)' : 'power2.out',
        stagger:  0.08,
      }
    );

    // Contact: double-wave makes buttons bloom outward
    if (dna.poseResponse?.double_wave?.buttonsBloomOutward) {
      gsap.fromTo(Array.from(buttons),
        { scale: 0.85 },
        { scale: 1, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.1 }
      );
    }
  }

  /**
   * Build (or return cached) element arrays for all parallax layers.
   * Only queries the DOM once per section — invalidated in onStateChange.
   */
  _getLayerEls() {
    if (this._layerElCache) return this._layerElCache;
    this._layerElCache = SCENE_LAYERS
      .filter(layer => layer.parallaxScale !== 0 && layer.selector)
      .map(layer => ({
        parallaxScale: layer.parallaxScale,
        els: Array.from(document.querySelectorAll(layer.selector)),
      }));
    return this._layerElCache;
  }

  /**
   * Apply depth-based parallax on all layers during scroll tension.
   * Each layer moves differently based on its parallaxScale in SceneGraph.
   * DOM queries are cached — no querySelectorAll inside this hot path.
   */
  _applyDepthParallax(percent, direction) {
    const layers = this._getLayerEls();
    for (const layer of layers) {
      if (!layer.els.length) continue;
      const px = percent * MAX_PARALLAX_PX * layer.parallaxScale * -direction;
      gsap.to(layer.els, {
        y:         px,
        duration:  0.12,
        ease:      'power1.out',
        overwrite: 'auto',
      });
    }
  }

  /**
   * Snap all layers back to neutral on tension release.
   */
  _resetDepthParallax() {
    const layers = this._getLayerEls();
    for (const layer of layers) {
      if (!layer.els.length) continue;
      gsap.to(layer.els, {
        y:         0,
        duration:  0.45,
        ease:      'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
    }
  }

  destroy() {
    this._layerElCache = null;
    this._listeners.forEach(u => u());
    this._listeners = [];
  }
}

export default OverlayAnimator;
