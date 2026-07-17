/**
 * ThemeAnimator.js
 *
 * Owns: CSS variable color sync per background temperature.
 * Sets data-temperature on <body> to drive glass reflections,
 * motion physics, and scene accent colors throughout the UI.
 */

import { gsap } from 'gsap';
import { SCENE_DNA } from '../SceneDNA';
import { EventBus } from '../../core/EventBus';

const TEMPERATURE_TO_NAVBAR = {
  warm: 'light',
  cool: 'dark',
  gold: 'light',
  teal: 'dark',
};

export class ThemeAnimator {
  constructor() {
    this._current = null;
  }

  onStateChange(state, context) {
    // Apply new scene temperature during SCENE_SWAP (between sections)
    if (state === 'SCENE_SWAP' && context.to) {
      this._applyTheme(context.to);
    }
    // Update body data-cinematic-state for CSS selectors
    document.body.dataset.cinematicState = state;
  }

  _applyTheme(sectionId) {
    const dna = SCENE_DNA[sectionId];
    if (!dna || dna.temperature === this._current) return;

    this._current = dna.temperature;

    // Set temperature on body — CSS uses this for glass reflections
    document.body.dataset.temperature = dna.temperature;

    // Set section id on body for any section-specific overrides
    document.body.dataset.activeSection = sectionId;

    // Emit for ScrollProgressRail and Navbar theming
    const navTheme = TEMPERATURE_TO_NAVBAR[dna.temperature] ?? 'light';
    EventBus.emit('THEME_CHANGED', { temperature: dna.temperature, navTheme, sectionId });

    // Animate CSS custom property for scene accent color (smooth crossfade)
    // We use a proxy object to tween numeric RGB channels
    const sceneColors = {
      home:         [28,  72,  50 ],
      about:        [0,   184, 148],
      skills:       [0,   184, 148],
      techstack:    [97,  218, 251],
      projects:     [0,   184, 148],
      experience:   [0,   184, 148],
      education:    [130, 190, 170],
      achievements: [180, 130, 48 ],
      contact:      [0,   184, 148],
    };

    const [r, g, b] = sceneColors[sectionId] || [0, 184, 148];
    const proxy = { r: parseInt(document.body.style.getPropertyValue('--scene-r') || r),
                    g: parseInt(document.body.style.getPropertyValue('--scene-g') || g),
                    b: parseInt(document.body.style.getPropertyValue('--scene-b') || b) };

    gsap.to(proxy, {
      r, g, b,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        document.body.style.setProperty('--scene-r', Math.round(proxy.r));
        document.body.style.setProperty('--scene-g', Math.round(proxy.g));
        document.body.style.setProperty('--scene-b', Math.round(proxy.b));
      },
    });
  }
}

export default ThemeAnimator;
