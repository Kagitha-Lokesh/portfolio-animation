/**
 * ProgressRailAnimator.js
 *
 * Owns: Scroll progress rail dot transitions and tension fill animation.
 * Simple but cleanly separated from everything else.
 */

import { gsap } from 'gsap';

export class ProgressRailAnimator {
  onStateChange(state, context) {
    switch (state) {
      case 'ACTIVE':
        if (context.to) this._updateActiveDot(context.to);
        break;
      case 'EXIT_SYNC':
      case 'ENV_DISSOLVE':
      case 'SCENE_SWAP':
        this._dimRail();
        break;
      case 'LOOPING':
        this._restoreRail();
        break;
      default:
        break;
    }
  }

  _updateActiveDot(sectionId) {
    // Find all dots and update active
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach(dot => {
      const isActive = dot.dataset.section === sectionId;
      gsap.to(dot, {
        scale:    isActive ? 1.3 : 1,
        opacity:  isActive ? 1   : 0.5,
        duration: 0.3,
        ease:     'power2.out',
      });
    });
  }

  _dimRail() {
    const rail = document.querySelector('.scroll-progress-rail');
    if (rail) {
      gsap.to(rail, { opacity: 0.4, duration: 0.2, ease: 'power1.out' });
    }
  }

  _restoreRail() {
    const rail = document.querySelector('.scroll-progress-rail');
    if (rail) {
      gsap.to(rail, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    }
  }
}

export default ProgressRailAnimator;
