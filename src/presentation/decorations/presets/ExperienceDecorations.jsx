import React from 'react';
import { EnvIcon } from '../EnvIcon';

/**
 * ExperienceDecorations  —  V3
 *
 * SAFE ZONE: safeZone "center" — character at TRUE CENTER (30–70%)
 * Character: binoculars_scan, purple_hoodie_backpack
 *
 * DECORATION ZONE: far left strip 2–16% ONLY.
 * Architecture diagram stays well clear of character body.
 *
 * Signature: SVG animateMotion data packets CLIENT → API → DB
 */

// Node positions — all left ≤ 14%
const ARCH = {
  client: { cx: 10, cy: 30 },
  api:    { cx: 14, cy: 52 },
  db:     { cx: 8,  cy: 72 },
};

export function ExperienceDecorations() {
  return (
    <>
      {/* ── SVG: paths + animateMotion packets (SIGNATURE) ── */}
      <svg
        className="env-arch-svg env-secondary"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ opacity: 0.9 }}
      >
        <defs>
          <filter id="exp-glow-v3">
            <feGaussianBlur stdDeviation="0.4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* CLIENT → API path */}
        <path
          id="exp-path-ca"
          d={`M ${ARCH.client.cx} ${ARCH.client.cy} C ${ARCH.client.cx + 6} ${ARCH.client.cy + 10}, ${ARCH.api.cx - 4} ${ARCH.api.cy - 8}, ${ARCH.api.cx} ${ARCH.api.cy}`}
          fill="none"
          stroke="rgba(0,184,148,0.38)"
          strokeWidth="0.4"
          strokeDasharray="1.5 3"
          filter="url(#exp-glow-v3)"
        />

        {/* API → DB path */}
        <path
          id="exp-path-ad"
          d={`M ${ARCH.api.cx} ${ARCH.api.cy} C ${ARCH.api.cx - 4} ${ARCH.api.cy + 8}, ${ARCH.db.cx + 4} ${ARCH.db.cy - 8}, ${ARCH.db.cx} ${ARCH.db.cy}`}
          fill="none"
          stroke="rgba(0,184,148,0.32)"
          strokeWidth="0.4"
          strokeDasharray="1.5 3"
          filter="url(#exp-glow-v3)"
        />

        {/* SVG circle rings around each node */}
        <circle cx={ARCH.client.cx} cy={ARCH.client.cy} r="3.5" fill="none" stroke="rgba(0,184,148,0.48)" strokeWidth="0.3" />
        <circle cx={ARCH.api.cx}    cy={ARCH.api.cy}    r="4.5" fill="none" stroke="rgba(0,184,148,0.48)" strokeWidth="0.3" />
        <circle cx={ARCH.db.cx}     cy={ARCH.db.cy}     r="3.5" fill="none" stroke="rgba(0,184,148,0.40)" strokeWidth="0.3" />

        {/* Data packets — CLIENT → API */}
        <circle r="0.9" fill="rgba(0,184,148,0.80)">
          <animateMotion dur="3s" repeatCount="indefinite" begin="0s">
            <mpath href="#exp-path-ca" />
          </animateMotion>
          <animate attributeName="opacity" values="0;0.85;0.85;0" keyTimes="0;0.08;0.88;1" dur="3s" repeatCount="indefinite" begin="0s" />
        </circle>
        <circle r="0.75" fill="rgba(97,218,251,0.70)">
          <animateMotion dur="3s" repeatCount="indefinite" begin="-1.5s">
            <mpath href="#exp-path-ca" />
          </animateMotion>
          <animate attributeName="opacity" values="0;0.70;0.70;0" keyTimes="0;0.08;0.88;1" dur="3s" repeatCount="indefinite" begin="-1.5s" />
        </circle>

        {/* Data packets — API → DB */}
        <circle r="0.9" fill="rgba(0,184,148,0.75)">
          <animateMotion dur="3.5s" repeatCount="indefinite" begin="-0.5s">
            <mpath href="#exp-path-ad" />
          </animateMotion>
          <animate attributeName="opacity" values="0;0.80;0.80;0" keyTimes="0;0.08;0.88;1" dur="3.5s" repeatCount="indefinite" begin="-0.5s" />
        </circle>
        <circle r="0.7" fill="rgba(255,160,0,0.65)">
          <animateMotion dur="3.5s" repeatCount="indefinite" begin="-2s">
            <mpath href="#exp-path-ad" />
          </animateMotion>
          <animate attributeName="opacity" values="0;0.60;0.60;0" keyTimes="0;0.08;0.88;1" dur="3.5s" repeatCount="indefinite" begin="-2s" />
        </circle>
      </svg>

      {/* ── HTML architecture node overlays — left ≤ 16% ── */}
      <div
        className="env-arch-node env-secondary"
        style={{
          left: `${ARCH.client.cx}%`, top: `${ARCH.client.cy}%`,
          transform: 'translate(-50%, -50%)',
          width: 52, height: 22,
          opacity: 0.88,
          '--nd': '7s', '--ndd': '0s',
        }}
      >
        CLIENT
      </div>
      <div
        className="env-arch-node env-secondary"
        style={{
          left: `${ARCH.api.cx}%`, top: `${ARCH.api.cy}%`,
          transform: 'translate(-50%, -50%)',
          width: 52, height: 22,
          opacity: 0.88,
          borderColor: 'rgba(0,184,148,0.52)',
          '--nd': '5s', '--ndd': '1.2s',
        }}
      >
        API
      </div>
      <div
        className="env-arch-node env-secondary"
        style={{
          left: `${ARCH.db.cx}%`, top: `${ARCH.db.cy}%`,
          transform: 'translate(-50%, -50%)',
          width: 52, height: 22,
          opacity: 0.85,
          '--nd': '9s', '--ndd': '2.5s',
        }}
      >
        DATABASE
      </div>

      {/* ── Protocol label pills — left strip ── */}
      {[
        { text: 'REST',   left: '14%', top: '38%', nd: '10s', ndd: '0s' },
        { text: 'JSON',   left: '15%', top: '60%', nd: '12s', ndd: '2s' },
        { text: 'HTTP/2', left: '7%',  top: '46%', nd: '9s',  ndd: '4s' },
      ].map(({ text, left, top, nd, ndd }) => (
        <div
          key={text}
          className="env-label-pill env-secondary"
          style={{ left, top, opacity: 0.88, '--nd': nd, '--ndd': ndd }}
        >
          {text}
        </div>
      ))}

      {/* ── Icon indicators next to nodes ── */}
      <div style={{
        position: 'absolute',
        left: `${ARCH.api.cx + 2}%`, top: `${ARCH.api.cy - 2}%`,
        opacity: 0.60,
        pointerEvents: 'none',
      }}>
        <EnvIcon name="server" size={10} color="rgba(0,184,148,0.8)" />
      </div>
      <div style={{
        position: 'absolute',
        left: `${ARCH.db.cx + 2}%`, top: `${ARCH.db.cy - 2}%`,
        opacity: 0.55,
        pointerEvents: 'none',
      }}>
        <EnvIcon name="sql" size={10} color="rgba(0,116,193,0.8)" />
      </div>

      {/* ── 3 ambient particles — far left only ── */}
      {[
        { left: '3%',  top: '24%', pd: '14s', pdd: '0s' },
        { left: '6%',  top: '60%', pd: '11s', pdd: '2s' },
        { left: '12%', top: '80%', pd: '16s', pdd: '1s' },
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

export default ExperienceDecorations;
