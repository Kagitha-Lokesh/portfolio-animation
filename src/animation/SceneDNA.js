/**
 * SceneDNA.js
 *
 * Complete per-section scene configuration — the single source of truth
 * for ALL motion values, visual personality, physics, and character-awareness.
 *
 * Every animator module reads from SCENE_DNA[sectionId].
 * No hardcoded durations, eases, or distances anywhere else.
 */

export const SCENE_DNA = {

  home: {
    // Identity
    personality:         'gentle',

    // Scene physics (drives CSS --data-temperature on body)
    temperature:         'warm',      // 'warm' | 'cool' | 'gold' | 'teal'

    // Gravity: affects card settle + entry distance
    gravity:             'medium',    // 'light' | 'medium' | 'heavy'

    // Rhythm: informs stagger timing
    rhythm:              '4/4-largo', // time signature + tempo name

    // Contrast: used by ThemeAnimator for glass border opacity
    contrast:            'low',

    // Ambient system
    particleDensity:     'medium',
    ambientSpeed:        0.4,         // multiplier on CSS animation speed
    windStrength:        0.4,         // px of horizontal environmental drift
    windPeriod:          18,          // seconds per full wind cycle (0 = no wind)

    // Glass behavior (ThemeAnimator sets these via CSS vars)
    reflectionTemp:      'warm',
    reflectionIntensity: 0.05,        // card ::before overlay opacity
    glassBlur:           20,          // backdrop-filter px

    // Motion tokens
    entryEase:           'power3.out',
    exitEase:            'power2.in',
    distance:            18,          // max travel distance px
    blur:                4,           // entry blur px
    stagger:             0.08,        // stagger rhythm coefficient
    cardMass:            'heavy',     // 'light' | 'medium' | 'heavy'
    entryY:              18,          // vertical entry offset (positive = from below)
    entryX:              0,           // horizontal entry offset

    // Eye guidance — order in which layer types receive attention
    eyePath: ['decoration', 'character', 'typography', 'glass', 'interactive'],

    // Character pose → UI response mapping
    poseResponse: {
      stride_to_wave: {
        titleDrift:   2,        // title drifts 2px toward waving hand
        titleAxis:    'x',
        buttonBloom:  true,     // CTA buttons have extra scale on appear
      },
    },
  },

  about: {
    personality:         'relaxed',
    temperature:         'warm',
    gravity:             'medium',
    rhythm:              '3/4-andante',
    contrast:            'low',
    particleDensity:     'low',
    ambientSpeed:        0.35,
    windStrength:        0.3,
    windPeriod:          22,
    reflectionTemp:      'warm',
    reflectionIntensity: 0.04,
    glassBlur:           20,
    entryEase:           'power2.out',
    exitEase:            'power2.in',
    distance:            14,
    blur:                3,
    stagger:             0.07,
    cardMass:            'medium',
    entryY:              14,
    entryX:              8,           // drifts in from right (character is right-side)
    eyePath: ['decoration', 'character', 'typography', 'glass'],
    poseResponse: {
      beanbag_sip: {
        cardDrift: -4,          // cards lean slightly toward sitting character
        cardAxis:  'x',
      },
    },
  },

  skills: {
    personality:         'technical',
    temperature:         'cool',
    gravity:             'light',
    rhythm:              '4/4-allegro',
    contrast:            'high',
    particleDensity:     'low',
    ambientSpeed:        1.2,         // faster — mechanical feel
    windStrength:        0,           // no wind — precision environment
    windPeriod:          0,
    reflectionTemp:      'cool',
    reflectionIntensity: 0.06,
    glassBlur:           32,          // higher blur — dark studio glass
    entryEase:           'power2.inOut',
    exitEase:            'power2.inOut',
    distance:            8,
    blur:                2,
    stagger:             0.03,        // tight — mechanical
    cardMass:            'light',
    entryY:              0,
    entryX:              20,          // columns slide from outside edges
    eyePath: ['decoration', 'typography', 'glass'],
    poseResponse: {
      arms_wide_present: {
        columnsExpand: true,    // left/right columns expand like open arms
      },
    },
  },

  techstack: {
    personality:         'network',
    temperature:         'cool',
    gravity:             'light',
    rhythm:              '4/4-moderato',
    contrast:            'medium',
    particleDensity:     'medium',
    ambientSpeed:        0.8,
    windStrength:        0,
    windPeriod:          0,
    reflectionTemp:      'cool',
    reflectionIntensity: 0.05,
    glassBlur:           32,
    entryEase:           'power2.out',
    exitEase:            'power2.in',
    distance:            10,
    blur:                2,
    stagger:             0.05,
    cardMass:            'light',
    entryY:              10,
    entryX:              0,
    eyePath: ['decoration', 'typography', 'glass'],
    poseResponse: {
      lean_gesture: {
        badgesRadiate: true,    // tech badges radiate from character direction
      },
    },
  },

  projects: {
    personality:         'creative',
    temperature:         'warm',
    gravity:             'medium',
    rhythm:              '4/4-moderato',
    contrast:            'medium',
    particleDensity:     'low',
    ambientSpeed:        0.6,
    windStrength:        0.2,
    windPeriod:          20,
    reflectionTemp:      'warm',
    reflectionIntensity: 0.04,
    glassBlur:           20,
    entryEase:           'power2.out',
    exitEase:            'power2.in',
    distance:            12,
    blur:                3,
    stagger:             0.06,
    cardMass:            'medium',
    entryY:              8,
    entryX:              -12,         // slides in from left — like opening a new window
    eyePath: ['decoration', 'character', 'glass', 'interactive', 'typography'],
    poseResponse: {
      desk_typing: {
        tabsRevealLR: true,     // project tabs reveal left-to-right like typing
      },
    },
  },

  experience: {
    personality:         'professional',
    temperature:         'warm',
    gravity:             'medium',
    rhythm:              '4/4-moderato',
    contrast:            'medium',
    particleDensity:     'low',
    ambientSpeed:        0.5,
    windStrength:        0.2,
    windPeriod:          24,
    reflectionTemp:      'warm',
    reflectionIntensity: 0.04,
    glassBlur:           20,
    entryEase:           'power2.out',
    exitEase:            'power2.in',
    distance:            10,
    blur:                2,
    stagger:             0.05,
    cardMass:            'medium',
    entryY:              12,
    entryX:              0,
    eyePath: ['decoration', 'character', 'typography', 'glass'],
    poseResponse: {
      binoculars_scan: {
        cardsRevealFromScanDir: true,  // cards appear where character is looking
      },
    },
  },

  education: {
    personality:         'academic',
    temperature:         'warm',
    gravity:             'heavy',
    rhythm:              '3/4-adagio',
    contrast:            'low',
    particleDensity:     'low',
    ambientSpeed:        0.3,         // slowest — calm, academic
    windStrength:        0.3,
    windPeriod:          26,
    reflectionTemp:      'warm',
    reflectionIntensity: 0.04,
    glassBlur:           18,
    entryEase:           'power2.out',
    exitEase:            'power2.in',
    distance:            12,
    blur:                2,
    stagger:             0.09,        // slowest stagger — like turning pages
    cardMass:            'heavy',
    entryY:              -12,         // reads from top downward
    entryX:              0,
    eyePath: ['decoration', 'typography', 'glass'],
    poseResponse: {
      cross_legged_reading: {
        timelineRevealTopDown: true,   // timeline cards reveal top-to-bottom
      },
    },
  },

  achievements: {
    personality:         'celebration',
    temperature:         'gold',
    gravity:             'light',
    rhythm:              '4/4-rubato',
    contrast:            'medium',
    particleDensity:     'high',
    ambientSpeed:        0.9,
    windStrength:        0.5,
    windPeriod:          14,           // faster wind — energetic
    reflectionTemp:      'gold',
    reflectionIntensity: 0.08,         // strongest reflection — golden rim lighting
    glassBlur:           20,
    entryEase:           'back.out(1.4)',
    exitEase:            'power2.in',
    distance:            14,
    blur:                3,
    stagger:             0.07,
    cardMass:            'light',
    entryY:              -14,          // rises upward toward trophy
    entryX:              0,
    eyePath: ['character', 'decoration', 'typography', 'glass'],
    poseResponse: {
      trophy_victory: {
        cardRisesTowardTrophy: true,
        glowStrengthens:       true,   // achievement card glow increases
      },
    },
  },

  contact: {
    personality:         'warm',
    temperature:         'teal',
    gravity:             'medium',
    rhythm:              '3/4-andante',
    contrast:            'medium',
    particleDensity:     'medium',
    ambientSpeed:        0.5,
    windStrength:        0.3,
    windPeriod:          20,
    reflectionTemp:      'teal',
    reflectionIntensity: 0.06,
    glassBlur:           20,
    entryEase:           'power2.out',
    exitEase:            'power2.in',
    distance:            10,
    blur:                2,
    stagger:             0.08,
    cardMass:            'medium',
    entryY:              8,
    entryX:              12,           // blooms from right side (character waves right)
    eyePath: ['character', 'decoration', 'glass', 'interactive'],
    poseResponse: {
      double_wave: {
        buttonsBloomOutward: true,     // social buttons expand from center
        formFadesByWaveDir:  true,     // form slides in from wave direction
      },
    },
  },
};

/**
 * Card mass physics table.
 * Each cardMass key maps to GSAP animation parameters.
 */
export const CARD_MASS = {
  heavy:  { duration: 0.90, ease: 'power3.out' },     // Home, Education — slow settle
  medium: { duration: 0.65, ease: 'power2.out' },     // About, Projects, Contact
  light:  { duration: 0.45, ease: 'back.out(1.2)' },  // Skills, TechStack, Achievements
};

/**
 * Background lighting profile → motion physics.
 * ThemeAnimator sets data-temperature on <body>.
 * All GSAP modules multiply duration by motionScale.
 */
export const TEMPERATURE_PHYSICS = {
  warm: {
    motionScale:    1.2,   // animations run 20% slower — soft, languid
    easeStrength:   'power3.out',
    blurIntensity:  1.0,
    bounceAmount:   0,
  },
  cool: {
    motionScale:    0.85,  // animations run 15% faster — sharp, precise
    easeStrength:   'power2.inOut',
    blurIntensity:  0.7,
    bounceAmount:   0,
  },
  gold: {
    motionScale:    1.1,   // slightly slower — celebratory
    easeStrength:   'back.out(1.3)',
    blurIntensity:  0.9,
    bounceAmount:   1.3,
  },
  teal: {
    motionScale:    1.0,   // neutral timing
    easeStrength:   'power2.out',
    blurIntensity:  0.8,
    bounceAmount:   0,
  },
};

export default SCENE_DNA;
