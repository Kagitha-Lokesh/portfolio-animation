/**
 * NavbarAnimator.js
 *
 * Owns: Navbar compact/full toggle, light/dark theme, active dot.
 * Listens to THEME_CHANGED (from ThemeAnimator) and SECTION_ACTIVE.
 */

import { gsap } from 'gsap';
import { EventBus } from '../../core/EventBus';
import { PORTFOLIO_CONFIG } from '../../config/portfolio.config';

export class NavbarAnimator {
  constructor() {
    this._currentTheme = null;
    this._listeners    = [];

    this._listeners.push(
      EventBus.on('THEME_CHANGED', ({ navTheme, sectionId }) => {
        this._applyNavTheme(navTheme, sectionId);
      })
    );
  }

  onStateChange(state, context) {
    if (state === 'ACTIVE' && context.to) {
      this._updateActiveLink(context.to);
    }
  }

  _applyNavTheme(theme, sectionId) {
    const navbar = document.querySelector('.portfolio-navbar');
    if (!navbar) return;

    // Check if navbar should be compact (character near top of frame)
    const sec     = PORTFOLIO_CONFIG.sections[sectionId];
    const compact  = sec?.navbar?.mode === 'compact';

    if (theme !== this._currentTheme) {
      this._currentTheme = theme;
      gsap.to(navbar, {
        duration: 0.5,
        ease:     'power2.out',
        onStart: () => {
          navbar.classList.remove('light', 'dark');
          navbar.classList.add(theme);
          if (compact) {
            navbar.classList.add('retracted');
          } else {
            navbar.classList.remove('retracted');
          }
        },
      });
    }
  }

  _updateActiveLink(sectionId) {
    // Active nav dot update (React handles via state — just nudge the dot)
    const activeDot = document.querySelector(`.nav-button[data-section="${sectionId}"] .indicator-dot`);
    if (activeDot) {
      gsap.fromTo(activeDot,
        { scale: 0 },
        { scale: 1, duration: 0.3, ease: 'back.out(2)' }
      );
    }
  }

  destroy() {
    this._listeners.forEach(u => u());
    this._listeners = [];
  }
}

export default NavbarAnimator;
