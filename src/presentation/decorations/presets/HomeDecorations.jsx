import React from 'react';

/**
 * HomeDecorations  —  V5  "Identity Rail"
 *
 * SAFE ZONE: safeZone "left" — content LEFT, character CENTER-RIGHT (focusX 0.38)
 *
 * RAIL POSITION:
 *   left: 40px  (intentional margin from viewport edge)
 *   top: 10%  →  bottom: 88%  (≈ 78% vertical coverage)
 *   right edge ≤ 28% viewport (80px gap before character silhouette starts)
 *
 * TYPOGRAPHY SYSTEM:
 *   Primary:   40–52px, weight 300, spacing 8px, opacity 0.08–0.10
 *   Secondary: 20–24px, weight 400, spacing 5px, opacity 0.11–0.13
 *   Anchor:    "01"    18px, weight 500, opacity 0.15
 *
 * ANIMATION:
 *   8s opacity breathe — amplitude ±15% (0.85 → 1.0)
 *   Tiny 2px vertical drift on dividers
 *   No transforms on text (GPU-safe, no layout thrash)
 */

const FONT_SANS = "'Inter', 'Helvetica Neue', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

// Primary text color — dark green on cream background
const C_PRIMARY   = 'rgba(28, 72, 50, ';   // + opacity
const C_DIVIDER   = 'rgba(40, 100, 65, 0.24)';
const C_ANCHOR    = 'rgba(28, 72, 50, 0.45)';

// ── Breathing animation style helper ──────────────────────────
const breathe = (delay = '0s') => ({
  animation: `env-identity-breathe 8s ease-in-out infinite ${delay}`,
});

export function HomeDecorations() {
  return (
    <>
      {/* No hard fade masks — they create visible white bars against background */}

      {/* ════════════════════════════════════════════════════════
          IDENTITY RAIL — starts 40px from edge
      ════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          left: 40,             /* intentional 40px margin from viewport edge */
          top: '10%',
          width: 220,           /* fits within the left story zone */
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 1,
        }}
      >

        {/* ── Visual anchor ── */}
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: 5,
            color: C_ANCHOR,
            marginBottom: 20,
            ...breathe('0s'),
          }}
        >
          ● &nbsp;01
        </div>

        {/* ── GROUP 1: Greeting ── */}
        <div style={{ marginBottom: 6 }}>
          <div style={{
            fontFamily: FONT_SANS,
            fontSize: 52,
            fontWeight: 300,
            letterSpacing: 9,
            lineHeight: 1.15,
            color: `${C_PRIMARY}0.28)`,
            textTransform: 'uppercase',
            ...breathe('0.4s'),
          }}>
            HELLO
          </div>
        </div>

        <Divider delay="0.6s" />

        {/* ── GROUP 2: Role ── */}
        <div style={{ marginBottom: 6 }}>
          {['SOFTWARE', 'ENGINEER'].map((w, i) => (
            <div key={w} style={{
              fontFamily: FONT_SANS,
              fontSize: 40,
              fontWeight: 300,
              letterSpacing: 8,
              lineHeight: 1.25,
              color: `${C_PRIMARY}0.26)`,
              textTransform: 'uppercase',
              ...breathe(`${0.8 + i * 0.15}s`),
            }}>{w}</div>
          ))}
        </div>

        <Divider delay="1.2s" />

        {/* ── GROUP 3: Stack — secondary size ── */}
        <div style={{ marginBottom: 6 }}>
          {['JAVA', 'FULL STACK', 'REACT', 'AI & ML'].map((w, i) => (
            <div key={w} style={{
              fontFamily: FONT_SANS,
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: 6,
              lineHeight: 1.7,
              color: `${C_PRIMARY}0.32)`,
              textTransform: 'uppercase',
              ...breathe(`${1.5 + i * 0.12}s`),
            }}>{w}</div>
          ))}
        </div>

        <Divider delay="2s" />

        {/* ── GROUP 4: Mindset — secondary size ── */}
        <div style={{ marginBottom: 6 }}>
          {['CREATE', 'BUILD', 'LEARN', 'OPTIMIZE', 'SOLVE'].map((w, i) => (
            <div key={w} style={{
              fontFamily: FONT_SANS,
              fontSize: 20,
              fontWeight: 400,
              letterSpacing: 6,
              lineHeight: 1.75,
              color: `${C_PRIMARY}0.30)`,
              textTransform: 'uppercase',
              ...breathe(`${2.4 + i * 0.10}s`),
            }}>{w}</div>
          ))}
        </div>

        <Divider delay="2.8s" />

        {/* ── GROUP 5: Identity footer ── */}
        <div>
          {[['AVAILABLE', 14], ['INDIA', 13], ['EST. 2026', 12]].map(([w, size], i) => (
            <div key={w} style={{
              fontFamily: FONT_MONO,
              fontSize: size,
              fontWeight: 400,
              letterSpacing: 5,
              lineHeight: 1.9,
              color: `${C_PRIMARY}0.28)`,
              textTransform: 'uppercase',
              ...breathe(`${3.2 + i * 0.15}s`),
            }}>{w}</div>
          ))}
        </div>

      </div>

      {/* ── Thin vertical rule — sits right of rail content ── */}
      <div style={{
        position: 'absolute',
        left: 268,
        top: '18%',
        width: 1,
        height: '64%',
        background: `linear-gradient(180deg,
          transparent 0%,
          ${C_DIVIDER} 15%,
          ${C_DIVIDER} 85%,
          transparent 100%
        )`,
        pointerEvents: 'none',
        opacity: 0.8,
        ...breathe('1s'),
      }} />

      {/* ── 3 tick marks on vertical rule ── */}
      {[30, 52, 72].map((top, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: 264,
          top: `${top}%`,
          width: 8, height: 1,
          background: 'rgba(40,100,65,0.11)',
          pointerEvents: 'none',
        }} />
      ))}
    </>
  );
}

/** 1px gradient divider with slow drift */
function Divider({ delay = '0s' }) {
  return (
    <div style={{
      width: 120,
      height: 1,
      margin: '20px 0',
      background: 'linear-gradient(90deg, rgba(40,100,65,0.14), rgba(40,100,65,0.05) 80%, transparent)',
      animation: `env-identity-breathe 10s ease-in-out infinite ${delay}`,
      pointerEvents: 'none',
    }} />
  );
}

export default HomeDecorations;
