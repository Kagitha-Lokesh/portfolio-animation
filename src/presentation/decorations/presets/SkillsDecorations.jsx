import React from 'react';

/**
 * SkillsDecorations  —  V3 (fixed)
 *
 * SAFE ZONE: safeZone "center" — character TRUE CENTER (30–70%)
 * Character: yellow_hoodie, open_present pose
 * Content cards: left column ~5–36%, right column ~62–92%
 *
 * DECORATION ZONE: extreme left < 4%, extreme right > 92%
 * (only the narrow strips beyond the content cards)
 *
 * Theme: Developer Mindset — subtle code bracket symbols + vertical rule lines.
 * Visibility fix: use env-float (transform-only) not env-math-float (kills opacity).
 */

// Code bracket symbols — LEFT extreme margin only (< 4%)
const LEFT_SYMBOLS = [
  { sym: '{}',   left: '1.5%', top: '25%', nd: '9s',  ndd: '0s'   },
  { sym: '</>',  left: '0.5%', top: '45%', nd: '11s', ndd: '2s'   },
  { sym: '()',   left: '1.5%', top: '64%', nd: '8s',  ndd: '4s'   },
  { sym: '=>',   left: '0.5%', top: '80%', nd: '10s', ndd: '1s'   },
];

// Code bracket symbols — RIGHT extreme margin only (> 92%)
const RIGHT_SYMBOLS = [
  { sym: '[]',  right: '1.5%', top: '30%', nd: '10s', ndd: '1.5s' },
  { sym: '::',  right: '0.5%', top: '52%', nd: '9s',  ndd: '3s'   },
  { sym: '=>',  right: '1.5%', top: '70%', nd: '12s', ndd: '0.5s' },
];

export function SkillsDecorations() {
  return (
    <>
      {/* ── Vertical accent line — far left ── */}
      <div style={{
        position: 'absolute',
        left: '3.5%', top: '18%',
        width: 1,
        height: '62%',
        background: 'linear-gradient(180deg, transparent, rgba(0,184,148,0.52) 20%, rgba(0,184,148,0.52) 80%, transparent)',
        pointerEvents: 'none',
      }} />

      {/* ── Vertical accent line — far right ── */}
      <div style={{
        position: 'absolute',
        right: '3.5%', top: '22%',
        width: 1,
        height: '55%',
        background: 'linear-gradient(180deg, transparent, rgba(0,184,148,0.48) 20%, rgba(0,184,148,0.48) 80%, transparent)',
        pointerEvents: 'none',
      }} />

      {/* ── Code bracket symbols — LEFT strip ── */}
      {LEFT_SYMBOLS.map(({ sym, left, top, nd, ndd }) => (
        <div
          key={sym + top}
          className="env-secondary"
          style={{
            position: 'absolute',
            left, top,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            fontWeight: 500,
            color: 'rgba(0,184,148,0.65)',
            pointerEvents: 'none',
            userSelect: 'none',
            /* Use env-float — transform only, does NOT animate opacity */
            animation: `env-float ${nd} ease-in-out infinite ${ndd}`,
          }}
        >
          {sym}
        </div>
      ))}

      {/* ── Code bracket symbols — RIGHT strip ── */}
      {RIGHT_SYMBOLS.map(({ sym, right, top, nd, ndd }) => (
        <div
          key={sym + top + right}
          className="env-secondary"
          style={{
            position: 'absolute',
            right, top,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            fontWeight: 500,
            color: 'rgba(0,184,148,0.58)',
            pointerEvents: 'none',
            userSelect: 'none',
            animation: `env-float ${nd} ease-in-out infinite ${ndd}`,
          }}
        >
          {sym}
        </div>
      ))}

      {/* ── Tiny dot markers along left vertical line ── */}
      {[22, 38, 54, 70].map((top, i) => (
        <div key={i} className="env-secondary" style={{
          position: 'absolute',
          left: 'calc(3.5% - 3px)',
          top: `${top}%`,
          width: 6, height: 6,
          borderRadius: '50%',
          border: '1px solid rgba(0,184,148,0.60)',
          background: 'rgba(0,184,148,0.30)',
          pointerEvents: 'none',
          animation: `env-float ${8 + i * 1.5}s ease-in-out infinite ${i * 1.2}s`,
        }} />
      ))}

      {/* ── Ambient particles — extreme margins only ── */}
      {[
        { size: 2, left: '2%',  top: '35%', pd: '14s', pdd: '0s'   },
        { size: 1.5, left: '1%', top: '72%', pd: '11s', pdd: '2s'  },
        { size: 2, right: '2%', top: '40%', pd: '13s', pdd: '1.5s' },
        { size: 1.5, right: '1%', top: '65%', pd: '10s', pdd: '3s' },
      ].map((p, i) => (
        <div key={i} className="env-particle env-tertiary" style={{
          width: p.size, height: p.size,
          left: p.left, right: p.right, top: p.top,
          background: 'rgba(0,184,148,0.70)',
          '--pd': p.pd, '--pdd': p.pdd,
        }} />
      ))}
    </>
  );
}

export default SkillsDecorations;
