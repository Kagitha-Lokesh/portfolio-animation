import React from 'react';
import { EnvIcon } from '../EnvIcon';

/**
 * EducationTimeline  —  V3
 *
 * SAFE ZONE: safeZone "center" — character at TRUE CENTER (28–68%)
 * Character: cross_legged_reading, beige_sweater
 *
 * DECORATION ZONE: far left strip 4–22%
 * Timeline centered at left: 16% — clearly between screen edge and character.
 * Math symbols: left 2–22%
 *
 * Signature: glow energy traveling upward along the connector line
 */

const MILESTONES = [
  {
    icon: 'school',
    iconColor: 'rgba(0,184,148,0.78)',
    label: 'Primary',
    active: false,
    nd: '8s', ndd: '3.5s', gd: '4s',
  },
  {
    icon: 'book',
    iconColor: 'rgba(0,184,148,0.82)',
    label: 'Secondary',
    active: false,
    nd: '7s', ndd: '2.5s', gd: '2.8s',
  },
  {
    icon: 'brain',
    iconColor: 'rgba(0,184,148,0.88)',
    label: 'Intermediate',
    active: false,
    nd: '6s', ndd: '1.5s', gd: '1.5s',
  },
  {
    icon: 'graduation',
    iconColor: 'rgba(0,184,148,0.80)',
    label: 'B.Tech CSE',
    active: true,
    nd: '5s', ndd: '0s', gd: '0s',
  },
];

const MATH_SYMBOLS = [
  { sym: 'π',  left: '3%',  top: '20%', nd: '10s', ndd: '0s',   size: 15 },
  { sym: 'Σ',  left: '18%', top: '30%', nd: '13s', ndd: '2s',   size: 13 },
  { sym: 'λ',  left: '4%',  top: '62%', nd: '9s',  ndd: '4s',   size: 12 },
  { sym: '∞',  left: '20%', top: '74%', nd: '12s', ndd: '1.5s', size: 14 },
  { sym: '{}', left: '11%', top: '46%', nd: '11s', ndd: '3s',   size: 11 },
  { sym: '∂',  left: '2%',  top: '82%', nd: '8s',  ndd: '5s',   size: 10 },
];

export function EducationTimeline() {
  return (
    <>
      {/* ── Warm radial ambient glow — stays left of character ── */}
      <div
        className="env-tertiary"
        style={{
          position: 'absolute',
          left: '13%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 110, height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(180,155,255,0.05) 0%, rgba(255,215,170,0.03) 55%, transparent 75%)',
          filter: 'blur(18px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Vertical milestone track — centered at left: 16% ── */}
      <div
        className="env-timeline"
        style={{
          position: 'absolute',
          left: '16%',
          top: '16%',
          transform: 'translateX(-50%)',
        }}
      >
        {MILESTONES.map((m, idx) => (
          <React.Fragment key={m.label}>
            {/* Milestone node */}
            <div
              className={`env-milestone${m.active ? ' env-milestone--active' : ''}`}
              style={{
                '--nd': m.nd,
                '--ndd': m.ndd,
                position: 'relative',
              }}
            >
              <EnvIcon
                name={m.icon}
                size={m.active ? 16 : 13}
                color={m.iconColor}
              />
              {/* Label to the right of node */}
              <div className="env-milestone-label">{m.label}</div>
            </div>

            {/* Connector with traveling glow */}
            {idx < MILESTONES.length - 1 && (
              <div className="env-connector">
                <div className="env-connector-glow" style={{ '--gd': m.gd }} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Math symbols — far left, 2–22% ── */}
      {MATH_SYMBOLS.map(({ sym, left, top, nd, ndd, size }) => (
        <div
          key={sym + left}
          className="env-math-symbol env-secondary"
          style={{
            left, top,
            fontSize: size,
            color: 'rgba(130, 190, 170, 0.78)',
            '--nd': nd,
            '--ndd': ndd,
          }}
        >
          {sym}
        </div>
      ))}

      {/* ── Minimal ambient particles ── */}
      {[
        { left: '5%',  top: '38%', pd: '12s', pdd: '0s' },
        { left: '10%', top: '68%', pd: '15s', pdd: '2s' },
        { left: '2%',  top: '55%', pd: '10s', pdd: '4s' },
      ].map((p, i) => (
        <div key={i} className="env-particle env-tertiary" style={{
          width: 1.5, height: 1.5,
          left: p.left, top: p.top,
          background: 'rgba(0,184,148,0.70)',
          '--pd': p.pd, '--pdd': p.pdd,
        }} />
      ))}
    </>
  );
}

export default EducationTimeline;
