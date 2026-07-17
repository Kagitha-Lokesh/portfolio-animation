/**
 * SceneGraph.js
 *
 * Defines the 8-layer scene hierarchy with depth values, z-indices,
 * and parallax scales. Every module knows which layer it owns and how
 * that layer should move relative to others.
 *
 * Depth rules:
 *   Closer layers (depth 5–6) → larger movement, shorter blur, faster settle
 *   Farther layers (depth 2–3) → slower movement, more blur, slower settle
 *   Character (depth 1) and Background (depth 0) → never animated by React
 *
 * Parallax scroll tension response (px per 1.0 tension unit):
 *   navigation: 0  (navbar stays fixed)
 *   interactive: 1.6px (closest moving layer)
 *   typography:  1.28px
 *   glass:       0.96px
 *   decoration:  0.64px
 *   ambient:     0.32px
 *   background:  0  (video canvas — never touched)
 */

export const SCENE_LAYERS = [
  {
    id:             'background',
    depth:          0,
    zIndex:         0,
    parallaxScale:  0.00,  // never moved — video canvas
    blurBase:       0,
    selector:       null,  // not a DOM element in React
    owned:          'CanvasRenderer',
  },
  {
    id:             'character',
    depth:          1,
    zIndex:         20,
    parallaxScale:  0.00,  // never touched by React
    blurBase:       0,
    selector:       null,
    owned:          'CanvasRenderer',
  },
  {
    id:             'ambient',
    depth:          2,
    zIndex:         30,
    parallaxScale:  0.02,  // 0.32px at max tension
    blurBase:       1,
    selector:       '.section-decorations-root .env-particle',
    owned:          'AmbientAnimator',
  },
  {
    id:             'decoration',
    depth:          3,
    zIndex:         35,
    parallaxScale:  0.04,  // 0.64px at max tension
    blurBase:       1.5,
    selector:       '.section-decorations-root',
    owned:          'DecorationAnimator',
  },
  {
    id:             'glass',
    depth:          4,
    zIndex:         40,
    parallaxScale:  0.06,  // 0.96px at max tension
    blurBase:       2,
    selector:       '.content-card',
    owned:          'CardAnimator',
  },
  {
    id:             'typography',
    depth:          5,
    zIndex:         40,
    parallaxScale:  0.08,  // 1.28px at max tension
    blurBase:       3,
    selector:       '.section-heading, .hero-title, .hero-subtitle',
    owned:          'TypographyAnimator',
  },
  {
    id:             'interactive',
    depth:          6,
    zIndex:         40,
    parallaxScale:  0.10,  // 1.6px at max tension — closest layer to viewer
    blurBase:       2,
    selector:       '.cta-button, .submit-btn, .social-badge, .project-tab-button',
    owned:          'OverlayAnimator',
  },
  {
    id:             'navigation',
    depth:          7,
    zIndex:         50,
    parallaxScale:  0.00,  // navbar stays perfectly fixed
    blurBase:       0,
    selector:       '.portfolio-navbar, .scroll-progress-rail',
    owned:          'NavbarAnimator',
  },
];

/** Quick lookup by layer id */
export const LAYER_MAP = Object.fromEntries(SCENE_LAYERS.map(l => [l.id, l]));

/** Max tension parallax in px (used for clamping) */
export const MAX_PARALLAX_PX = 16;

export default SCENE_LAYERS;
