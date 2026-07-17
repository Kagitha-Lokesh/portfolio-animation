import React from 'react';
import { EnvIcon } from '../EnvIcon';

/**
 * ContactDecorations  —  V3 (Right Side Positioning)
 *
 * SAFE ZONE: safeZone "right" — content on LEFT, character on RIGHT (35–80%)
 * Closeup profile — character is large and waves in the middle-right.
 * Content card and message form occupy the left half (5% to 55%).
 *
 * DECORATION ZONE: far right strip — left: 78–96% (fully visible and unblocked)
 *
 * Orbit center: left 86%, top 50%
 * Max radius: 110px ≈ 5.7% at 1920px → orbit spans from 80.3% to 91.7% — perfectly safe.
 */

const CX = '86%';
const CY = '50%';

const INNER = [
  { icon: 'mail',    label: 'Email',    r: '50px', od: '18s', odd: '0s' },
  { icon: 'phone',   label: 'Phone',    r: '50px', od: '18s', odd: '-9s' },
];

const MIDDLE = [
  { icon: 'github',   label: 'GitHub',   r: '80px', od: '26s', odd: '0s' },
  { icon: 'linkedin', label: 'LinkedIn', r: '80px', od: '26s', odd: '-13s' },
];

const OUTER = [
  { icon: 'globe',    label: 'Portfolio', r: '110px', od: '36s', odd: '0s' },
  { icon: 'location', label: 'Location',  r: '110px', od: '36s', odd: '-18s' },
];

function OrbitTrack({ items, ringPx, showRing = true, tierClass = '' }) {
  const ringVw = ringPx * 2;

  return (
    <>
      {/* Orbit ring */}
      {showRing && (
        <div
          className={`env-orbit-ring ${tierClass}`}
          style={{
            position: 'absolute',
            left: CX, top: CY,
            width: ringVw, height: ringVw,
            borderWidth: '1px',
            transform: 'translate(-50%, -50%)',
            '--rdd': '0s',
          }}
        />
      )}

      {/* Orbit pills */}
      {items.map(({ icon, label, r, od, odd }) => (
        <div
          key={label}
          className={`env-orbit-pill ${tierClass}`}
          style={{
            left: CX, top: CY,
            '--orbit-r': r,
            '--od': od,
            '--odd': odd,
            opacity: 0.82,
          }}
        >
          <EnvIcon name={icon} size={12} color="rgba(0,184,148,0.75)" />
          <span className="env-orbit-pill-label">{label}</span>
        </div>
      ))}
    </>
  );
}

export function ContactDecorations() {
  return (
    <>
      {/* ── Center glow — orbit focal point ── */}
      <div
        className="env-orbit-center"
        style={{
          position: 'absolute',
          left: CX, top: CY,
          transform: 'translate(-50%, -50%)',
          width: 14, height: 14,
          background: 'radial-gradient(circle, rgba(0,184,148,0.65), rgba(0,184,148,0.08) 70%)',
        }}
      />
      {/* Soft halo */}
      <div style={{
        position: 'absolute',
        left: CX, top: CY,
        transform: 'translate(-50%, -50%)',
        width: 50, height: 50,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,184,148,0.09), transparent 70%)',
        animation: 'env-bloom 5s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* ── SVG decorative dashed rings — very faint ── */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        aria-hidden="true"
        className="env-tertiary"
      >
        <circle cx={CX} cy={CY} r="50"  fill="none" stroke="rgba(0,184,148,0.06)" strokeWidth="0.5" strokeDasharray="2 6" />
        <circle cx={CX} cy={CY} r="80"  fill="none" stroke="rgba(0,184,148,0.04)" strokeWidth="0.5" strokeDasharray="1.5 8" />
        <circle cx={CX} cy={CY} r="110" fill="none" stroke="rgba(0,184,148,0.03)" strokeWidth="0.5" strokeDasharray="1 10" />
      </svg>

      {/* ── Three orbit tracks (SIGNATURE) ── */}
      <OrbitTrack items={INNER}  ringPx={100} showRing={false} tierClass="" />
      <OrbitTrack items={MIDDLE} ringPx={160} showRing={false} tierClass="" />
      <OrbitTrack items={OUTER}  ringPx={220} showRing={false} tierClass="env-secondary" />

      {/* ── 4 ambient particles in far right strip ── */}
      {[
        { left: '78%', top: '28%', pd: '14s', pdd: '0s'   },
        { left: '84%', top: '72%', pd: '11s', pdd: '2s'   },
        { left: '92%', top: '38%', pd: '16s', pdd: '1s'   },
        { left: '90%', top: '65%', pd: '13s', pdd: '3.5s' },
      ].map((p, i) => (
        <div key={i} className="env-particle env-tertiary" style={{
          width: p.size, height: p.size,
          left: p.left, top: p.top,
          background: 'rgba(0,184,148,0.40)',
          '--pd': p.pd, '--pdd': p.pdd,
        }} />
      ))}
    </>
  );
}

export default ContactDecorations;
