/**
 * SceneBridgeAnimator.js
 *
 * Sole responsibility: animate cross-section visual TRANSFORMATIONS.
 * The old scene transforms INTO the new scene rather than cutting away.
 *
 * Bridge animations fire during SCENE_SWAP state — the 100ms window
 * between ENV_DISSOLVE and ENV_BUILD where both scenes coexist briefly.
 *
 * Bridges implemented:
 *   home        → about       : Rail text fades as floating shapes bloom
 *   about       → skills      : Warm circles compress into code symbols
 *   techstack   → projects    : Constellation compresses into git graph
 *   projects    → experience  : Terminal transforms into architecture node
 *   education   → achievements: Timeline rail reforms as achievement rail (KEY BRIDGE)
 *   achievements→ contact     : Gold particles become teal orbit rings
 */

import { gsap } from 'gsap';

export class SceneBridgeAnimator {
  constructor() {
    this._activeBridge = null;
  }

  onStateChange(state, context) {
    if (state === 'SCENE_SWAP' && context.from && context.to) {
      this.startBridge(context.from, context.to, context.direction ?? 1);
    }
  }

  startBridge(from, to, direction = 1) {
    // Kill any previous bridge
    if (this._activeBridge) {
      this._activeBridge.kill();
      this._activeBridge = null;
    }

    const key        = `${from}→${to}`;
    const reverseKey = `${to}→${from}`;
    const bridgeFn   = BRIDGES[key] || (direction < 0 ? BRIDGES[reverseKey] : null);

    if (bridgeFn) {
      this._activeBridge = bridgeFn(direction);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BRIDGE DEFINITIONS
// Each bridge function returns a GSAP timeline.
// ─────────────────────────────────────────────────────────────────────────────

const getLayer = (sectionId) =>
  document.querySelector(`.decoration-scene[data-section="${sectionId}"]`);

const BRIDGES = {

  /**
   * Home → About
   * Identity Rail text fades as floating shapes emerge from same left-margin zone.
   * Warm palette is continuous — the scene feels like moving to another corner of same room.
   */
  'home→about': (dir) => {
    const fromLayer = getLayer('home');
    const toLayer   = getLayer('about');

    const rail   = fromLayer?.querySelector('[data-rail], [data-decoration-type="rail"]');
    const shapes = toLayer?.querySelectorAll('.env-secondary, .env-tertiary');

    if (!toLayer) return null;
    toLayer.dataset.state = 'entering';

    return gsap.timeline()
      .to(rail, { opacity: 0, x: -8, duration: 0.4, ease: 'power2.in' })
      .fromTo(shapes,
        { opacity: 0, scale: 0.8, x: -8 },
        { opacity: 0.6, scale: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
        '-=0.2'
      );
  },

  /**
   * About → Skills
   * Warm floating circles lose heat and compress into cold, precise code symbols.
   * The ambient lightness darkens — feels like walking from lounge into server room.
   */
  'about→skills': (dir) => {
    const fromLayer = getLayer('about');
    const toLayer   = getLayer('skills');

    const circles  = fromLayer?.querySelectorAll('.env-secondary');
    const symbols  = toLayer?.querySelectorAll('.env-secondary, .env-symbol-left, .env-symbol-right');

    if (!toLayer) return null;
    toLayer.dataset.state = 'entering';

    return gsap.timeline()
      .to(circles, { scale: 0.3, opacity: 0, filter: 'blur(4px)', duration: 0.4, stagger: 0.05 })
      .fromTo(symbols,
        { opacity: 0, scale: 0, filter: 'blur(2px)' },
        { opacity: 0.55, scale: 1, filter: 'blur(0px)', duration: 0.35, stagger: 0.04, ease: 'power2.out' },
        '-=0.15'
      );
  },

  /**
   * TechStack → Projects
   * Constellation edges compress into Git branch lines in the same left-strip zone.
   * Nodes compress to points, then become git commit dots.
   * This is the "network collapses into developer workflow" moment.
   */
  'techstack→projects': (dir) => {
    const fromLayer = getLayer('techstack');
    const toLayer   = getLayer('projects');

    const nodes   = fromLayer?.querySelectorAll('.env-node');
    const edges   = fromLayer?.querySelectorAll('svg line, .env-constellation-svg line');
    const gitLines = toLayer?.querySelectorAll('.env-git-line, svg line');
    const gitNodes = toLayer?.querySelectorAll('svg circle, .env-commit-node');

    if (!toLayer) return null;
    toLayer.dataset.state = 'entering';

    return gsap.timeline()
      // Constellation nodes compress to points
      .to(nodes, { scale: 0, opacity: 0, duration: 0.35, stagger: 0.04, ease: 'power2.in' })
      // Edges thin to invisible
      .to(edges, { strokeWidth: 0.1, opacity: 0, duration: 0.3 }, '<')
      // Git branch lines draw from same region
      .fromTo(gitLines,
        { strokeDashoffset: 200, opacity: 0 },
        { strokeDashoffset: 0, opacity: 0.45, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
        '-=0.1'
      )
      .fromTo(gitNodes,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 0.75, duration: 0.3, stagger: 0.06, ease: 'back.out(1.8)' },
        '-=0.2'
      );
  },

  /**
   * Projects → Experience
   * Terminal window collapses into the Architecture CLIENT node.
   * Commit pills fade as protocol pills appear in the same strip.
   */
  'projects→experience': (dir) => {
    const fromLayer = getLayer('projects');
    const toLayer   = getLayer('experience');

    const terminal     = fromLayer?.querySelector('.env-terminal, .env-terminal-screen');
    const commitPills  = fromLayer?.querySelectorAll('.env-commit-pill');
    const clientNode   = toLayer?.querySelector('.env-arch-node:first-child, .env-node:first-child');
    const protoLabels  = toLayer?.querySelectorAll('.env-label-pill');

    if (!toLayer) return null;
    toLayer.dataset.state = 'entering';

    return gsap.timeline()
      .to(terminal, { scaleY: 0, opacity: 0, transformOrigin: 'top center', duration: 0.3 })
      .to(commitPills, { opacity: 0, x: -6, duration: 0.25, stagger: 0.05 }, '<')
      .fromTo(clientNode,
        { scaleY: 0, opacity: 0, transformOrigin: 'top center' },
        { scaleY: 1, opacity: 0.88, duration: 0.4, ease: 'power2.out' },
        '-=0.1'
      )
      .fromTo(protoLabels,
        { opacity: 0, x: -4 },
        { opacity: 0.88, x: 0, duration: 0.3, stagger: 0.06, ease: 'power2.out' },
        '-=0.15'
      );
  },

  /**
   * Education → Achievements  ← THE KEY BRIDGE
   *
   * The Education timeline DOES NOT DISAPPEAR.
   * It contracts and reforms as the Achievement milestone rail.
   * The same vertical structure transforms — user sees one continuous element.
   *
   * This is the single most cinematic moment in the entire portfolio.
   */
  'education→achievements': (dir) => {
    const fromLayer = getLayer('education');
    const toLayer   = getLayer('achievements');

    const eduRail    = fromLayer?.querySelector('.env-timeline, [data-decoration-type="rail"]');
    const mathSyms   = fromLayer?.querySelectorAll('.env-math-symbol, .env-secondary');
    const achRail    = toLayer?.querySelector('[data-rail], [data-decoration-type="rail"]');
    const stars      = toLayer?.querySelectorAll('.env-star');
    const achIcons   = toLayer?.querySelectorAll('.env-icon');

    if (!toLayer) return null;
    toLayer.dataset.state = 'entering';

    return gsap.timeline()
      // Math symbols drift upward and out (like pages turning)
      .to(mathSyms, { y: -12, opacity: 0, duration: 0.4, stagger: 0.06, ease: 'power2.in' })
      // Education rail contracts from bottom — feels like it's being "lifted"
      .to(eduRail, {
        scaleY:          0.15,
        transformOrigin: 'top center',
        opacity:         0.2,
        duration:        0.5,
        ease:            'power2.in',
      }, '-=0.2')
      // Achievement rail expands from the exact same position — continuation
      .fromTo(achRail,
        { scaleY: 0, opacity: 0, transformOrigin: 'top center' },
        { scaleY: 1, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.15'
      )
      // Stars twinkle on as rail is expanding
      .fromTo(stars,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 0.4, duration: 0.3, stagger: { amount: 0.5, from: 'random' } },
        '-=0.35'
      )
      // Achievement icons pulse in
      .fromTo(achIcons,
        { opacity: 0, scale: 0.5 },
        { opacity: 0.88, scale: 1, duration: 0.3, stagger: 0.08, ease: 'back.out(1.6)' },
        '-=0.2'
      );
  },

  /**
   * Achievements → Contact
   * Gold particles converge and transform into teal orbit rings.
   * Same ambient energy, different color and structure.
   */
  'achievements→contact': (dir) => {
    const fromLayer = getLayer('achievements');
    const toLayer   = getLayer('contact');

    const particles  = fromLayer?.querySelectorAll('.env-rise-particle, .env-particle');
    const center     = toLayer?.querySelector('.env-orbit-center, [data-decoration-type="anchor"]');
    const rings      = toLayer?.querySelectorAll('.env-orbit-ring, .env-orbit-track');
    const pills      = toLayer?.querySelectorAll('.env-orbit-pill, .orbit-item');

    if (!toLayer) return null;
    toLayer.dataset.state = 'entering';

    return gsap.timeline()
      // Gold particles converge inward (reverse of their natural rise)
      .to(particles, { opacity: 0, scale: 0, duration: 0.4, stagger: 0.04 })
      // Center glow appears where particles converged
      .fromTo(center,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' },
        '-=0.15'
      )
      // Rings expand outward from center
      .fromTo(rings,
        { scale: 0, opacity: 0, transformOrigin: '50% 50%' },
        { scale: 1, opacity: 0.55, duration: 0.5, ease: 'power2.out', stagger: 0.12 },
        '-=0.1'
      )
      // Pills spawn and fly to orbit
      .fromTo(pills,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 0.82, duration: 0.35, stagger: 0.1, ease: 'back.out(1.6)' },
        '-=0.25'
      );
  },
};

export default SceneBridgeAnimator;
