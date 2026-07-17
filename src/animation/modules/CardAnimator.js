/**
 * CardAnimator.js
 *
 * Owns: ALL .content-card glass panel enter/exit animations.
 * Cards have physical mass (heavy/medium/light) and are character-pose aware.
 * Glass materializes from environment — never simply fades.
 */

import { gsap } from 'gsap';
import { SCENE_DNA, CARD_MASS, TEMPERATURE_PHYSICS } from '../SceneDNA';
import { PRESETS } from '../TransitionPresets';
import { PORTFOLIO_CONFIG } from '../../config/portfolio.config';

export class CardAnimator {
  constructor() {}

  onStateChange(state, context) {
    switch (state) {
      case 'PREPARING_EXIT':
        if (context.from) this._prepareDeparture(context.from);
        break;
      case 'EXIT_SYNC':
        if (context.from) this._syncWithExit(context.from, context.direction);
        break;
      case 'ENV_DISSOLVE':
        if (context.from) this._dematerialize(context.from, context.direction);
        break;
      default:
        break;
    }
  }

  /**
   * Called by TransitionDirector via SceneClock at sceneTime 0.68.
   */
  materialize(sectionId, direction = 1) {
    const dna = SCENE_DNA[sectionId];
    if (!dna) return;

    const container = document.querySelector(
      `.section-overlay-container[data-section="${sectionId}"]`
    );
    if (!container) return;

    const cards = container.querySelectorAll('.content-card');
    if (!cards.length) return;

    const mass    = CARD_MASS[dna.cardMass];
    const physics = TEMPERATURE_PHYSICS[dna.temperature] ?? TEMPERATURE_PHYSICS.warm;
    const dur     = mass.duration * physics.motionScale;

    // Pose-aware stagger direction
    const pose    = PORTFOLIO_CONFIG.sections[sectionId]?.character?.pose ?? '';
    const pResp   = dna.poseResponse?.[pose] ?? {};

    const fromDir = pResp.tabsRevealLR
      ? 'start'                                   // Projects: left-to-right like typing
      : direction > 0 ? 'start' : 'end';

    const staggerAmt = Math.min(cards.length, 5) * dna.stagger;

    // Achievements: cards rise toward trophy
    const extraY = pResp.cardRisesTowardTrophy ? -10 : 0;

    gsap.fromTo(Array.from(cards),
      {
        opacity:  0,
        scale:    dna.cardMass === 'light' ? 0.92 : 0.97,
        filter:   `blur(${dna.blur * 1.5}px)`,
        y:        dna.entryY * direction + extraY,
        x:        dna.entryX * direction,
      },
      {
        opacity:  1,
        scale:    1,
        filter:   'blur(0px)',
        y:        0,
        x:        0,
        duration: dur,
        ease:     mass.ease,
        stagger:  { amount: staggerAmt, from: fromDir },
      }
    );

    // Achievements: glow strengthens on active card
    if (pResp.glowStrengthens) {
      const firstCard = cards[0];
      if (firstCard) {
        gsap.fromTo(firstCard,
          { boxShadow: '0 8px 32px rgba(180,130,48,0.1)' },
          { boxShadow: '0 12px 48px rgba(180,130,48,0.35)', duration: 0.8, ease: 'power2.out', delay: dur * 0.5 }
        );
      }
    }
  }

  /**
   * Stage 1: Cards quietly lose contrast — preparing to leave.
   */
  _prepareDeparture(sectionId) {
    const container = document.querySelector(
      `.section-overlay-container[data-section="${sectionId}"]`
    );
    if (!container) return;
    gsap.to(container.querySelectorAll('.content-card'), {
      filter:   'brightness(0.93)',
      duration: 0.2,
      ease:     'power1.in',
    });
  }

  /**
   * Stage 2: Cards drift gently in character exit direction.
   * Max drift = 8px — purely subtle.
   */
  _syncWithExit(sectionId, direction = 1) {
    const container = document.querySelector(
      `.section-overlay-container[data-section="${sectionId}"]`
    );
    if (!container) return;
    const dna = SCENE_DNA[sectionId];

    // Character walks away → cards drift slightly in same direction
    const driftX = direction * 5;
    const driftY = direction * 4;

    gsap.to(container.querySelectorAll('.content-card'), {
      x:        driftX,
      y:        driftY,
      duration: 0.6,
      ease:     'power2.inOut',
      stagger:  0.04,
    });
  }

  /**
   * Stage 3: Glass dematerializes — absorbed into background.
   */
  _dematerialize(sectionId, direction = 1) {
    const dna = SCENE_DNA[sectionId];
    if (!dna) return;
    const container = document.querySelector(
      `.section-overlay-container[data-section="${sectionId}"]`
    );
    if (!container) return;

    PRESETS.glassDematerialize(
      container.querySelectorAll('.content-card'),
      dna,
      direction
    );
  }
}

export default CardAnimator;
