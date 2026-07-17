/**
 * AmbientAnimator.js
 *
 * Owns: Environmental wind micro-motion + particle ambient life.
 *
 * Nothing should ever be perfectly still. The ambient animator runs
 * continuous gentle motion on decoration elements during LOOPING state.
 * It slows everything down gracefully during PREPARING_EXIT (inertia),
 * and restores full speed on ENV_BUILD.
 */

import { gsap } from 'gsap';
import { SCENE_DNA } from '../SceneDNA';
import { PRESETS } from '../TransitionPresets';

export class AmbientAnimator {
  constructor() {
    this._windTweens    = [];
    this._currentSection = null;
  }

  onStateChange(state, context) {
    switch (state) {
      case 'PREPARING_EXIT':
        this._slowForExit();
        break;
      case 'ENV_BUILD':
        if (context.to) this._startWind(context.to);
        break;
      case 'LOOPING':
        if (context.to) this._restoreFullSpeed(context.to);
        break;
      case 'ENV_DISSOLVE':
        this._stopWind();
        break;
      default:
        break;
    }
  }

  /**
   * Start environmental wind for a new section.
   * Wind is always-on during ACTIVE/LOOPING — never perfectly still.
   */
  _startWind(sectionId) {
    const dna = SCENE_DNA[sectionId];
    if (!dna || dna.windStrength === 0) return;

    this._currentSection = sectionId;
    this._killWindTweens();

    const layer = document.querySelector(`.decoration-scene[data-section="${sectionId}"]`);
    if (!layer) return;

    // Rail / large elements: subtle horizontal drift
    const railEl = layer.querySelector('[data-rail], [data-decoration-type="rail"]');
    if (railEl) {
      this._windTweens.push(
        gsap.to(railEl, {
          x:        dna.windStrength,
          duration: dna.windPeriod,
          ease:     'sine.inOut',
          yoyo:     true,
          repeat:   -1,
        })
      );
    }

    // Divider lines: opacity breathe (very slow)
    const dividers = layer.querySelectorAll('[data-decoration-type="divider"]');
    if (dividers.length) {
      this._windTweens.push(
        gsap.to(dividers, {
          opacity:  '+=0.08',
          duration: dna.windPeriod * 0.65,
          ease:     'sine.inOut',
          yoyo:     true,
          repeat:   -1,
          stagger:  { amount: 2, from: 'random' },
        })
      );
    }

    // Anchor / label elements: very gentle pulse
    const anchors = layer.querySelectorAll('[data-decoration-type="anchor"]');
    if (anchors.length) {
      this._windTweens.push(
        gsap.to(anchors, {
          scale:    1.02,
          duration: dna.windPeriod * 0.8,
          ease:     'sine.inOut',
          yoyo:     true,
          repeat:   -1,
        })
      );
    }

    // Particles: slow opacity variance (on top of CSS animation)
    const particles = layer.querySelectorAll('.env-particle');
    if (particles.length) {
      this._windTweens.push(
        PRESETS.inertiaIn(particles, 0.35)
      );
    }
  }

  /**
   * Graceful slowdown during PREPARING_EXIT.
   * Old animations don't stop abruptly — they quiet down.
   */
  _slowForExit() {
    // Fade out particles in the currently active decoration scene
    if (this._currentSection) {
      const layer = document.querySelector(`.decoration-scene[data-section="${this._currentSection}"]`);
      if (layer) {
        const particles = layer.querySelectorAll('.env-particle');
        PRESETS.inertiaOut(particles);
      }
    }
  }

  /**
   * Restore full ambient speed after entering LOOPING state.
   */
  _restoreFullSpeed(sectionId) {
    const layer = document.querySelector(`.decoration-scene[data-section="${sectionId}"]`);
    if (!layer) return;
    const particles = layer.querySelectorAll('.env-particle');
    PRESETS.inertiaIn(particles, 0.35);
  }

  _stopWind() {
    this._killWindTweens();
  }

  _killWindTweens() {
    this._windTweens.forEach(t => t?.kill?.());
    this._windTweens = [];
  }
}

export default AmbientAnimator;
