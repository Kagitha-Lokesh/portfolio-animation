/**
 * TransitionPresets.js
 *
 * Reusable GPU-only GSAP animation factories.
 * All modules call these presets — never raw gsap.to() with arbitrary values.
 *
 * GPU-safe properties only:
 *   ✅ transform (x, y, scale, rotation)
 *   ✅ opacity
 *   ✅ filter (blur, brightness)
 *   ✅ clipPath
 *   ❌ width, height, left, top, margin, padding, box-shadow (direct)
 */

import { gsap } from 'gsap';
import { CARD_MASS, TEMPERATURE_PHYSICS } from './SceneDNA';

// ── Helper: resolve ease string ──────────────────────────────────────────────
const resolveEase = (easeStr) => easeStr; // GSAP accepts string ease names directly

// ── Helper: get temperature-adjusted duration ─────────────────────────────────
const scaledDuration = (base, temperature) => {
  const scale = TEMPERATURE_PHYSICS[temperature]?.motionScale ?? 1;
  return base * scale;
};

// ─────────────────────────────────────────────────────────────────────────────
export const PRESETS = {

  /**
   * Glass card materializes from the environment.
   * Cards emerge as if they were always part of the scene — not appearing on top.
   */
  glassMaterialize(elements, dna, direction = 1) {
    if (!elements || !elements.length) return;
    const mass = CARD_MASS[dna.cardMass];
    const dur  = scaledDuration(mass.duration, dna.temperature);

    const fromOpts = dna.poseResponse?.desk_typing?.tabsRevealLR
      ? { from: 'start', amount: dur * 0.6 }
      : { from: direction > 0 ? 'start' : 'end', amount: dna.stagger * Math.min(elements.length, 5) };

    return gsap.fromTo(elements,
      {
        opacity:  0,
        scale:    dna.cardMass === 'light' ? 0.92 : 0.97,
        filter:   `blur(${dna.blur * 1.5}px)`,
        y:        dna.entryY * direction,
        x:        dna.entryX * direction,
      },
      {
        opacity:  1,
        scale:    1,
        filter:   'blur(0px)',
        y:        0,
        x:        0,
        duration: dur,
        ease:     resolveEase(dna.entryEase),
        stagger:  fromOpts,
      }
    );
  },

  /**
   * Glass card dematerializes back into the background.
   * Not a simple fade — glass loses depth and blurs into the scene.
   */
  glassDematerialize(elements, dna, direction = 1) {
    if (!elements || !elements.length) return;
    return gsap.to(elements, {
      opacity:  0,
      scale:    0.97,
      filter:   `blur(${dna.blur}px)`,
      y:        dna.entryY * -direction * 0.5,
      x:        dna.entryX * -direction * 0.5,
      duration: 0.35,
      ease:     resolveEase(dna.exitEase),
      stagger:  { amount: 0.15, from: direction > 0 ? 'end' : 'start' },
    });
  },

  /**
   * Typography sharpens from blur — like a camera pulling focus.
   */
  titleEmerge(el, dna, direction = 1) {
    if (!el) return;
    const dur = scaledDuration(0.7, dna.temperature);
    return gsap.fromTo(el,
      {
        opacity: 0,
        y:       dna.entryY * direction * 0.6,
        filter:  `blur(${dna.blur}px)`,
      },
      {
        opacity:  1,
        y:        0,
        filter:   'blur(0px)',
        duration: dur,
        ease:     resolveEase(dna.entryEase),
      }
    );
  },

  /**
   * Typography dissolves — blurs and drifts away.
   */
  titleDissolve(el, dna, direction = 1) {
    if (!el) return;
    return gsap.to(el, {
      opacity:  0,
      y:        dna.entryY * -direction * 0.4,
      filter:   `blur(${dna.blur * 1.2}px)`,
      duration: 0.3,
      ease:     resolveEase(dna.exitEase),
    });
  },

  /**
   * SVG line draws itself from start to end.
   * Requires the element to have strokeDasharray set to its total length.
   */
  svgLineDraw(el, duration = 0.8, delay = 0) {
    if (!el) return;
    const length = el.getTotalLength?.() ?? 200;
    gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
    return gsap.to(el, {
      strokeDashoffset: 0,
      duration,
      delay,
      ease: 'power2.inOut',
    });
  },

  /**
   * SVG line erases itself (reverse draw).
   */
  svgLineErase(el, duration = 0.5) {
    if (!el) return;
    const length = el.getTotalLength?.() ?? 200;
    return gsap.to(el, {
      strokeDashoffset: length,
      duration,
      ease: 'power2.in',
    });
  },

  /**
   * Decoration node spawns from center (scale 0→1, opacity 0→target).
   */
  nodeSpawn(el, targetOpacity = 1, delay = 0) {
    if (!el) return;
    return gsap.fromTo(el,
      { opacity: 0, scale: 0 },
      { opacity: targetOpacity, scale: 1, duration: 0.5, delay, ease: 'back.out(1.6)' }
    );
  },

  /**
   * Decoration node collapses back to center.
   */
  nodeCollapse(el, delay = 0) {
    if (!el) return;
    return gsap.to(el, {
      opacity: 0,
      scale:   0,
      duration: 0.35,
      delay,
      ease:    'power2.in',
    });
  },

  /**
   * Environmental inertia: CSS animation durations slow gracefully.
   * Applied to elements whose CSS animations are too fast for the exit mood.
   */
  inertiaOut(elements) {
    if (!elements || !elements.length) return;
    // Slow particle CSS animations by increasing duration via inline override
    return gsap.to(elements, {
      opacity:  0.3,
      duration: 0.4,
      ease:     'power1.out',
    });
  },

  /**
   * Restore normal ambient speed after inertia slowdown.
   */
  inertiaIn(elements, targetOpacity = 0.35) {
    if (!elements || !elements.length) return;
    return gsap.to(elements, {
      opacity:  targetOpacity,
      duration: 0.6,
      ease:     'power2.out',
    });
  },

  /**
   * Element scales upward with a gentle bounce — used for Achievements.
   */
  celebrationRise(el, delay = 0) {
    if (!el) return;
    return gsap.fromTo(el,
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0,  scale: 1,   duration: 0.7, delay, ease: 'back.out(1.4)' }
    );
  },

  /**
   * Orbit pill spawns at center then travels outward to orbit position.
   * This creates the "born at origin, fly to orbit" feel.
   */
  orbitPillSpawn(el, delay = 0) {
    if (!el) return;
    return gsap.fromTo(el,
      { opacity: 0, scale: 0 },
      { opacity: 0.82, scale: 1, duration: 0.4, delay, ease: 'back.out(1.6)' }
    );
  },
};

export default PRESETS;
