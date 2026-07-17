/**
 * TypographyAnimator.js
 *
 * Owns: ALL section heading, title, subtitle, and body text animations.
 * Follows the eyePath from SceneDNA to guide viewer attention in sequence.
 * Never touches: cards, decorations, buttons.
 */

import { gsap } from 'gsap';
import { SCENE_DNA } from '../SceneDNA';
import { PRESETS } from '../TransitionPresets';
import { PORTFOLIO_CONFIG } from '../../config/portfolio.config';

export class TypographyAnimator {
  constructor() {
    this._currentSection = null;
  }

  onStateChange(state, context) {
    switch (state) {
      case 'PREPARING_EXIT':
        if (context.from) this._prepareExit(context.from);
        break;
      case 'ENV_DISSOLVE':
        if (context.from) this._dissolveTypography(context.from, context.direction);
        break;
      default:
        break;
    }
  }

  /**
   * Called by TransitionDirector via SceneClock at sceneTime 0.52.
   */
  emerge(sectionId, direction = 1) {
    const dna = SCENE_DNA[sectionId];
    if (!dna) return;

    this._currentSection = sectionId;
    const container = document.querySelector(
      `.section-overlay-container[data-section="${sectionId}"]`
    );
    if (!container) return;

    // Section heading
    const heading = container.querySelector('.section-heading, .hero-title');
    if (heading) {
      // Apply character-pose drift if applicable
      const pose   = PORTFOLIO_CONFIG.sections[sectionId]?.character?.pose ?? '';
      const pResp  = dna.poseResponse?.[pose] ?? {};
      const xDrift = pResp.titleDrift && pResp.titleAxis === 'x' ? pResp.titleDrift * direction : 0;

      gsap.fromTo(heading,
        { opacity: 0, y: dna.entryY * direction * 0.6, x: xDrift, filter: `blur(${dna.blur}px)` },
        { opacity: 1, y: 0, x: 0, filter: 'blur(0px)',
          duration: 0.7 * (dna.temperature === 'cool' ? 0.85 : 1),
          ease: dna.entryEase }
      );
    }

    // Subtitle / hero-subtitle
    const subtitle = container.querySelector('.section-subtitle, .hero-subtitle');
    if (subtitle) {
      gsap.fromTo(subtitle,
        { opacity: 0, y: dna.entryY * direction * 0.5, filter: `blur(${dna.blur * 0.8}px)` },
        { opacity: 0.75, y: 0, filter: 'blur(0px)',
          duration: 0.6,
          ease: dna.entryEase,
          delay: dna.stagger * 2 }
      );
    }

    // Body paragraphs / .hero-body elements
    const bodyEls = container.querySelectorAll('.hero-body > *, .about-p, .section-body-text');
    if (bodyEls.length) {
      gsap.fromTo(bodyEls,
        { opacity: 0, y: dna.entryY * direction * 0.4, filter: `blur(${dna.blur * 0.5}px)` },
        { opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.55,
          ease: dna.entryEase,
          stagger: { amount: dna.stagger * bodyEls.length * 0.5, from: 'start' },
          delay: dna.stagger * 3 }
      );
    }
  }

  /**
   * Stage 1 preparation: typography loses contrast quietly.
   */
  _prepareExit(sectionId) {
    const container = document.querySelector(
      `.section-overlay-container[data-section="${sectionId}"]`
    );
    if (!container) return;
    const textEls = container.querySelectorAll('.section-heading, .hero-title, .section-subtitle, .hero-subtitle');
    gsap.to(textEls, {
      filter:   'brightness(0.88)',
      duration: 0.2,
      ease:     'power1.in',
    });
  }

  /**
   * Stage 3 dissolve: text blurs and drifts backward into background.
   */
  _dissolveTypography(sectionId, direction = 1) {
    const dna = SCENE_DNA[sectionId];
    if (!dna) return;
    const container = document.querySelector(
      `.section-overlay-container[data-section="${sectionId}"]`
    );
    if (!container) return;

    const heading  = container.querySelector('.section-heading, .hero-title');
    const subtitle = container.querySelector('.section-subtitle, .hero-subtitle');
    const bodyEls  = container.querySelectorAll('.hero-body > *, .about-p, .section-body-text');

    if (heading)  PRESETS.titleDissolve(heading, dna, direction);
    if (subtitle) gsap.to(subtitle, { opacity: 0, filter: 'blur(2px)', duration: 0.25, ease: dna.exitEase });
    if (bodyEls.length) gsap.to(bodyEls, { opacity: 0, duration: 0.2, ease: dna.exitEase, stagger: 0.04 });
  }
}

export default TypographyAnimator;
