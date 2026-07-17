/**
 * DecorationAnimator.js
 *
 * Owns: All per-section decoration entry/exit sequences.
 * Works on the persistent DOM decoration scenes (never recreates them).
 * Each section has its own "power on" sequence — decorations materialize
 * as environmental systems, not as React components mounting.
 */

import { gsap } from 'gsap';
import { PRESETS } from '../TransitionPresets';
import { SCENE_DNA } from '../SceneDNA';

export class DecorationAnimator {
  constructor() {
    this._currentTl = null;
  }

  onStateChange(state, context) {
    switch (state) {
      case 'PREPARING_EXIT':
        if (context.from) this._prepareDissolve(context.from);
        break;
      case 'ENV_DISSOLVE':
        if (context.from) this._dissolveScene(context.from);
        break;
      default:
        break;
    }
  }

  /**
   * Called by TransitionDirector via SceneClock at sceneTime 0.15 (hints) and 0.35 (full).
   */
  build(sectionId, direction = 1) {
    const layer = document.querySelector(`.decoration-scene[data-section="${sectionId}"]`);
    if (!layer) return;

    // Kill any previous timeline
    if (this._currentTl) this._currentTl.kill();

    const entry = DECORATION_ENTRIES[sectionId];
    if (entry) {
      this._currentTl = entry(layer, direction);
    }
  }

  /**
   * Stage 1: Particles slow, nodes lose color — environment prepares.
   */
  _prepareDissolve(sectionId) {
    const layer = document.querySelector(`.decoration-scene[data-section="${sectionId}"]`);
    if (!layer) return;

    PRESETS.inertiaOut(layer.querySelectorAll('.env-particle'));
    gsap.to(layer.querySelectorAll('.env-node'), {
      opacity:  0.3,
      duration: 0.2,
      ease:     'power1.in',
    });
  }

  /**
   * Stage 3: Full decoration dissolution — each type has its own exit.
   */
  _dissolveScene(sectionId) {
    const layer = document.querySelector(`.decoration-scene[data-section="${sectionId}"]`);
    if (!layer) return;

    const exit = DECORATION_EXITS[sectionId];
    if (exit) {
      exit(layer);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DECORATION ENTRY SEQUENCES
// Each function receives the decoration layer DOM element and returns a GSAP timeline.
// ─────────────────────────────────────────────────────────────────────────────

const DECORATION_ENTRIES = {

  home: (layer) => {
    const tl = gsap.timeline();

    // 1. Divider lines extend (clip-path / scaleX)
    const dividers = layer.querySelectorAll('[data-decoration-type="divider"]');
    tl.fromTo(dividers,
      { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
      { scaleX: 1, opacity: 0.65, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );

    // 2. Anchor "01" label appears
    const anchor = layer.querySelector('[data-decoration-type="anchor"]');
    tl.fromTo(anchor,
      { opacity: 0, scale: 0.8 },
      { opacity: 0.75, scale: 1, duration: 0.3, ease: 'back.out(1.6)' },
      '-=0.2'
    );

    // 3. Rail text reveals letter by letter (stagger on children)
    const railLetters = layer.querySelectorAll('[data-decoration-type="rail-text"] span');
    tl.fromTo(railLetters,
      { opacity: 0, y: 6, filter: 'blur(2px)' },
      { opacity: 0.45, y: 0, filter: 'blur(0px)', duration: 0.3, stagger: 0.04, ease: 'power2.out' },
      '-=0.1'
    );

    // 4. Vertical rule line draws downward
    const vRule = layer.querySelector('[data-decoration-type="v-rule"]');
    if (vRule) {
      tl.fromTo(vRule,
        { scaleY: 0, transformOrigin: 'top center', opacity: 0 },
        { scaleY: 1, opacity: 0.5, duration: 0.6, ease: 'power2.out' },
        '<'
      );
    }

    return tl;
  },

  about: (layer) => {
    const tl = gsap.timeline();

    // Floating shapes materialize from center out
    const shapes = layer.querySelectorAll('.env-secondary, .env-tertiary');
    tl.fromTo(shapes,
      { opacity: 0, scale: 0.7, filter: 'blur(4px)' },
      { opacity: 0.6, scale: 1, filter: 'blur(0px)', duration: 0.55, stagger: 0.1, ease: 'power2.out' }
    );

    return tl;
  },

  skills: (layer) => {
    const tl = gsap.timeline();

    // Code symbols slide in from alternating sides
    const leftSymbols  = layer.querySelectorAll('.env-symbol-left');
    const rightSymbols = layer.querySelectorAll('.env-symbol-right');
    const allSymbols   = layer.querySelectorAll('.env-secondary');

    tl.fromTo(leftSymbols,
      { opacity: 0, x: -15, filter: 'blur(3px)' },
      { opacity: 0.55, x: 0, filter: 'blur(0px)', duration: 0.4, stagger: 0.06, ease: 'power2.out' }
    );
    tl.fromTo(rightSymbols,
      { opacity: 0, x: 15, filter: 'blur(3px)' },
      { opacity: 0.55, x: 0, filter: 'blur(0px)', duration: 0.4, stagger: 0.06, ease: 'power2.out' },
      '<'
    );

    // Fallback if no direction classes
    if (!leftSymbols.length && !rightSymbols.length && allSymbols.length) {
      tl.fromTo(allSymbols,
        { opacity: 0, scale: 0.8 },
        { opacity: 0.55, scale: 1, duration: 0.4, stagger: 0.05 }
      );
    }

    return tl;
  },

  techstack: (layer) => {
    const tl = gsap.timeline();

    // SVG constellation edges draw themselves
    const edges = layer.querySelectorAll('svg line, svg path.edge, .env-constellation-svg line');
    edges.forEach((edge, i) => {
      const length = edge.getTotalLength?.() ?? 100;
      gsap.set(edge, { strokeDasharray: length, strokeDashoffset: length });
      tl.to(edge, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, i * 0.08);
    });

    // Nodes pop in from center
    const nodes = layer.querySelectorAll('.env-node');
    tl.fromTo(nodes,
      { opacity: 0, scale: 0 },
      { opacity: 0.88, scale: 1, duration: 0.4, stagger: 0.07, ease: 'back.out(1.8)' },
      '-=0.3'
    );

    // Halos bloom after nodes
    const halos = layer.querySelectorAll('.env-halo');
    tl.fromTo(halos,
      { opacity: 0, scale: 0.5 },
      { opacity: 0.35, scale: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
      '-=0.2'
    );

    return tl;
  },

  projects: (layer) => {
    const tl = gsap.timeline();

    // Terminal: dots appear → screen flickers → cursor starts blinking
    const dots    = layer.querySelectorAll('.env-terminal-dot');
    const screen  = layer.querySelector('.env-terminal-screen, .env-terminal');
    const cursor  = layer.querySelector('.env-cursor');

    tl.fromTo(dots,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.2, stagger: 0.08, ease: 'back.out(2)' }
    );

    if (screen) {
      tl.fromTo(screen,
        { opacity: 0, filter: 'brightness(0)' },
        { opacity: 0.88, filter: 'brightness(1)', duration: 0.35, ease: 'power2.out' },
        '-=0.1'
      );
    }

    // Git branch lines draw from first commit downward
    const gitLines = layer.querySelectorAll('.env-git-line, svg line');
    gitLines.forEach((line, i) => {
      const length = line.getTotalLength?.() ?? 80;
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      tl.to(line, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut' }, 0.3 + i * 0.12);
    });

    // Commit pills appear top-to-bottom
    const pills = layer.querySelectorAll('.env-commit-pill');
    tl.fromTo(pills,
      { opacity: 0, x: -8 },
      { opacity: 0.88, x: 0, duration: 0.3, stagger: 0.1, ease: 'power2.out' },
      '-=0.2'
    );

    return tl;
  },

  experience: (layer) => {
    const tl = gsap.timeline();

    // Architecture nodes appear sequentially
    const nodes = layer.querySelectorAll('.env-arch-node, .env-node');
    tl.fromTo(nodes,
      { opacity: 0, scale: 0.6 },
      { opacity: 0.88, scale: 1, duration: 0.35, stagger: 0.15, ease: 'back.out(1.4)' }
    );

    // Connector lines draw between nodes
    const connectors = layer.querySelectorAll('.env-connector, svg line, svg path');
    connectors.forEach((line, i) => {
      const length = line.getTotalLength?.() ?? 60;
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      tl.to(line, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }, 0.3 + i * 0.15);
    });

    // Protocol pills pop in
    const pills = layer.querySelectorAll('.env-label-pill');
    tl.fromTo(pills,
      { opacity: 0, scale: 0 },
      { opacity: 0.88, scale: 1, duration: 0.3, stagger: 0.08, ease: 'back.out(1.6)' },
      '-=0.2'
    );

    return tl;
  },

  education: (layer) => {
    const tl = gsap.timeline();

    // Rail track appears growing downward
    const rail = layer.querySelector('.env-timeline, [data-decoration-type="rail"]');
    if (rail) {
      tl.fromTo(rail,
        { scaleY: 0, transformOrigin: 'top center', opacity: 0 },
        { scaleY: 1, opacity: 0.75, duration: 0.7, ease: 'power2.out' }
      );
    }

    // Milestones illuminate one by one (top to bottom)
    const milestones = layer.querySelectorAll('.env-milestone, .env-node');
    tl.fromTo(milestones,
      { opacity: 0, scale: 0.5, filter: 'blur(3px)' },
      { opacity: 0.88, scale: 1, filter: 'blur(0px)', duration: 0.3, stagger: 0.15, ease: 'back.out(1.4)' },
      '-=0.3'
    );

    // Math symbols float in from random positions
    const symbols = layer.querySelectorAll('.env-math-symbol, .env-secondary');
    tl.fromTo(symbols,
      { opacity: 0, y: 12, filter: 'blur(4px)' },
      { opacity: 0.4, y: 0, filter: 'blur(0px)', duration: 0.4, stagger: { amount: 0.5, from: 'random' }, ease: 'power2.out' },
      '-=0.2'
    );

    return tl;
  },

  achievements: (layer) => {
    const tl = gsap.timeline();

    // Stars twinkle on at staggered intervals
    const stars = layer.querySelectorAll('.env-star');
    tl.fromTo(stars,
      { opacity: 0, scale: 0 },
      { opacity: 0.4, scale: 1, duration: 0.3, stagger: { amount: 0.6, from: 'random' }, ease: 'back.out(2)' }
    );

    // Rail grows upward (achievement sense of rising)
    const rail = layer.querySelector('[data-rail], [data-decoration-type="rail"]');
    if (rail) {
      tl.fromTo(rail,
        { scaleY: 0, transformOrigin: 'bottom center', opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.65, ease: 'power3.out' },
        '-=0.3'
      );
    }

    // Year labels reveal top-to-bottom with blur
    const labels = layer.querySelectorAll('.env-year-label, [data-decoration-type="rail-text"] span');
    tl.fromTo(labels,
      { opacity: 0, y: -6, filter: 'blur(2px)' },
      { opacity: 0.75, y: 0, filter: 'blur(0px)', duration: 0.3, stagger: 0.08, ease: 'power2.out' },
      '-=0.2'
    );

    // Icons pulse in
    const icons = layer.querySelectorAll('.env-icon');
    tl.fromTo(icons,
      { opacity: 0, scale: 0.5 },
      { opacity: 0.88, scale: 1, duration: 0.3, stagger: 0.07, ease: 'back.out(1.8)' },
      '-=0.15'
    );

    return tl;
  },

  contact: (layer) => {
    const tl = gsap.timeline();

    // Center glow appears first
    const center = layer.querySelector('.env-orbit-center, [data-decoration-type="anchor"]');
    if (center) {
      tl.fromTo(center,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.6)' }
      );
    }

    // Rings expand outward from center
    const rings = layer.querySelectorAll('.env-orbit-ring, .env-orbit-track');
    tl.fromTo(rings,
      { opacity: 0, scale: 0, transformOrigin: '50% 50%' },
      { opacity: 0.55, scale: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' },
      '-=0.15'
    );

    // Orbit pills spawn at center then travel to orbit position
    const pills = layer.querySelectorAll('.env-orbit-pill, .orbit-item');
    tl.fromTo(pills,
      { opacity: 0, scale: 0 },
      { opacity: 0.82, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.6)' },
      '-=0.2'
    );

    return tl;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DECORATION EXIT SEQUENCES
// ─────────────────────────────────────────────────────────────────────────────

const DECORATION_EXITS = {

  home: (layer) => {
    gsap.timeline()
      .to(layer.querySelectorAll('[data-decoration-type="rail-text"] span'),
        { opacity: 0, y: -4, stagger: 0.03, duration: 0.25, ease: 'power2.in' })
      .to(layer.querySelectorAll('[data-decoration-type="divider"]'),
        { scaleX: 0, opacity: 0, transformOrigin: 'right center', duration: 0.3, ease: 'power2.in' },
        '-=0.1')
      .to(layer.querySelectorAll('[data-decoration-type="anchor"]'),
        { opacity: 0, scale: 0.8, duration: 0.2 }, '-=0.15');
  },

  techstack: (layer) => {
    gsap.timeline()
      .to(layer.querySelectorAll('.env-node'),
        { scale: 0, opacity: 0, duration: 0.3, stagger: 0.05, ease: 'power2.in' })
      .to(layer.querySelectorAll('svg line, svg path'),
        { opacity: 0, duration: 0.25 }, '<');
  },

  projects: (layer) => {
    gsap.timeline()
      .to(layer.querySelectorAll('.env-commit-pill'),
        { opacity: 0, x: -8, duration: 0.25, stagger: 0.06, ease: 'power2.in' })
      .to(layer.querySelectorAll('.env-terminal, .env-terminal-screen'),
        { opacity: 0, filter: 'brightness(0)', duration: 0.3 }, '-=0.1');
  },

  education: (layer) => {
    gsap.timeline()
      .to(layer.querySelectorAll('.env-math-symbol, .env-secondary'),
        { opacity: 0, y: -8, duration: 0.25, stagger: 0.05 })
      .to(layer.querySelectorAll('.env-milestone, .env-node'),
        { opacity: 0, scale: 0.5, duration: 0.25, stagger: 0.07 }, '<')
      .to(layer.querySelector('.env-timeline, [data-decoration-type="rail"]'),
        { scaleY: 0, opacity: 0, transformOrigin: 'top center', duration: 0.4 }, '-=0.1');
  },

  achievements: (layer) => {
    gsap.timeline()
      .to(layer.querySelectorAll('.env-rise-particle, .env-particle'),
        { opacity: 0, scale: 0, duration: 0.3, stagger: 0.04 })
      .to(layer.querySelectorAll('.env-icon'),
        { opacity: 0, scale: 0.5, duration: 0.25, stagger: 0.06 }, '-=0.2')
      .to(layer.querySelector('[data-rail]'),
        { scaleY: 0, opacity: 0, transformOrigin: 'top center', duration: 0.4, ease: 'power2.in' }, '-=0.2');
  },

  contact: (layer) => {
    gsap.timeline()
      .to(layer.querySelectorAll('.env-orbit-pill, .orbit-item'),
        { opacity: 0, scale: 0, duration: 0.3, stagger: 0.08, ease: 'power2.in' })
      .to(layer.querySelectorAll('.env-orbit-ring'),
        { opacity: 0, scale: 0, duration: 0.35 }, '-=0.2')
      .to(layer.querySelector('.env-orbit-center'),
        { opacity: 0, scale: 0, duration: 0.2 }, '-=0.1');
  },
};

// Default exit is a no-op (CSS transition handles it)
const defaultExit = () => {};

['about', 'skills', 'experience'].forEach(id => {
  if (!DECORATION_EXITS[id]) {
    DECORATION_EXITS[id] = defaultExit;
  }
});

export default DecorationAnimator;
