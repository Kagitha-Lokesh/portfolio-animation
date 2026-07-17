import React, { useId } from 'react';
import { EnvIcon } from '../EnvIcon';

/**
 * TechConstellationLayer  —  V3
 *
 * SAFE ZONE: safeZone "left" — content on LEFT, character on RIGHT (42–78%)
 *
 * DECORATION ZONE: left strip 4–36% ONLY.
 * The constellation sits behind the content cards (z-35 < z-40) so
 * nodes that fall under cards are naturally occluded by the card glass.
 * Nodes that fall in the gap between cards become visible ambient texture.
 *
 * MAX 8 NODES. Opacity 45–60%.
 * No node has left > 36%.
 */

const NODES = [
  // ── Frontend cluster ─────────────────────────────
  {
    id: 'react', label: 'React',
    icon: 'react', iconColor: 'rgba(97,218,251,0.65)',
    halo: 'rgba(97,218,251,0.10)',
    size: 'lg', anim: 'orbit',
    left: 48, top: 18,
    opacity: 0.88, nd: '9s', ndd: '0s', nh: '5s',
  },
  {
    id: 'js', label: 'JavaScript',
    icon: 'javascript', iconColor: 'rgba(247,223,30,0.65)',
    halo: 'rgba(247,223,30,0.08)',
    size: 'md', anim: 'rotate',
    left: 54, top: 26,
    opacity: 0.85, nd: '10s', ndd: '1.5s', nh: '6s',
  },
  {
    id: 'html', label: 'HTML5',
    icon: 'html', iconColor: 'rgba(227,79,38,0.60)',
    halo: 'rgba(227,79,38,0.07)',
    size: 'sm', anim: 'rotate',
    left: 44, top: 28,
    opacity: 0.80, nd: '8s', ndd: '3s', nh: '7s',
  },

  // ── Backend cluster ───────────────────────────────
  {
    id: 'node', label: 'Node.js',
    icon: 'node', iconColor: 'rgba(104,160,99,0.65)',
    halo: 'rgba(104,160,99,0.10)',
    size: 'lg', anim: 'float',
    left: 50, top: 40,
    opacity: 0.88, nd: '11s', ndd: '0.8s', nh: '5s',
  },
  {
    id: 'firebase', label: 'Firebase',
    icon: 'firebase', iconColor: 'rgba(255,160,0,0.65)',
    halo: 'rgba(255,160,0,0.09)',
    size: 'md', anim: 'pulse',
    left: 56, top: 48,
    opacity: 0.85, nd: '5s', ndd: '0s', nh: '4s',
  },
  {
    id: 'sql', label: 'SQL',
    icon: 'sql', iconColor: 'rgba(0,116,193,0.65)',
    halo: 'rgba(0,116,193,0.08)',
    size: 'md', anim: 'drift-v',
    left: 46, top: 52,
    opacity: 0.82, nd: '12s', ndd: '2s', nh: '7s',
  },

  // ── Tools cluster ─────────────────────────────────
  {
    id: 'git', label: 'Git',
    icon: 'git', iconColor: 'rgba(240,81,51,0.60)',
    halo: 'rgba(240,81,51,0.07)',
    size: 'md', anim: 'sway',
    left: 52, top: 64,
    opacity: 0.80, nd: '8s', ndd: '2.5s', nh: '6s',
  },
  {
    id: 'java', label: 'Java',
    icon: 'atom', iconColor: 'rgba(255,138,76,0.62)',
    halo: 'rgba(255,138,76,0.09)',
    size: 'lg', anim: 'breathe',
    left: 44, top: 72,
    opacity: 0.86, nd: '7s', ndd: '1s', nh: '5.5s',
  },
];

// Semantic edges — only pairs that are semantically related
const EDGES = [
  { a: 'react', b: 'js',       flow: true  },
  { a: 'js',    b: 'node',     flow: true  },
  { a: 'html',  b: 'js',       flow: false },
  { a: 'node',  b: 'firebase', flow: true  },
  { a: 'node',  b: 'sql',      flow: false },
  { a: 'git',   b: 'node',     flow: false },
  { a: 'java',  b: 'sql',      flow: true  },
];

const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]));

// Minimal background particles — just 6, all centered
const PARTICLES = [
  { size: 1.5, left: '46%', top: '18%', pd: '17s', pdd: '0s'   },
  { size: 1,   left: '52%', top: '72%', pd: '12s', pdd: '2s'   },
  { size: 2,   left: '42%', top: '14%', pd: '19s', pdd: '1s'   },
  { size: 1.5, left: '48%', top: '82%', pd: '15s', pdd: '3s'   },
  { size: 1,   left: '54%', top: '44%', pd: '11s', pdd: '5s'   },
  { size: 2,   left: '50%', top: '88%', pd: '16s', pdd: '2.5s' },
];

export function TechConstellationLayer() {
  const uid = useId();

  return (
    <div className="env-constellation">
      {/* ── SVG edge layer — pure background, very faint ── */}
      <svg
        className="env-constellation-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${uid}-g`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,184,148,0.9)" />
            <stop offset="100%" stopColor="rgba(0,184,148,0.0)" />
          </linearGradient>
          <filter id={`${uid}-f`}>
            <feGaussianBlur stdDeviation="0.35" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {EDGES.map(({ a, b, flow }, i) => {
          const na = nodeMap[a], nb = nodeMap[b];
          if (!na || !nb) return null;
          return (
            <g key={`${a}-${b}`} filter={`url(#${uid}-f)`}>
              {/* Static shimmer line */}
              <line
                x1={na.left} y1={na.top}
                x2={nb.left} y2={nb.top}
                stroke="rgba(0,184,148,0.15)"
                strokeWidth="0.45"
                style={{
                  animationName: 'env-edge-shimmer',
                  animationDuration: `${4.5 + i * 0.7}s`,
                  animationTimingFunction: 'ease-in-out',
                  animationIterationCount: 'infinite',
                }}
              />
              {/* Data-flow overlay (flow edges only) */}
              {flow && (
                <line
                  x1={na.left} y1={na.top}
                  x2={nb.left} y2={nb.top}
                  stroke="rgba(0,184,148,0.28)"
                  strokeWidth="0.45"
                  strokeDasharray="2.5 5"
                  style={{
                    animationName: 'env-data-flow',
                    animationDuration: `${3 + i * 0.5}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* ── Glass capsule nodes with isolated centering wrappers ── */}
      {NODES.map((n) => (
        <div
          key={n.id}
          style={{
            position: 'absolute',
            left: `${n.left}%`,
            top: `${n.top}%`,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <div
            className={`env-node env-node--${n.size} env-node--${n.anim} ${n.size === 'sm' ? 'env-secondary' : ''}`}
            style={{
              position: 'relative',
              transform: 'translate(-50%, -50%)',
              opacity: n.opacity,
              '--nd': n.nd,
              '--ndd': n.ndd,
              '--nh': n.nh,
            }}
          >
            {/* Glow halo */}
            <div
              className="env-node-halo"
              style={{ background: `radial-gradient(ellipse, ${n.halo} 0%, transparent 70%)`, '--nh': n.nh, '--ndd': n.ndd }}
            />
            {/* Icon badge */}
            <div
              className="env-node-icon"
              style={{ background: `${n.halo}` }}
            >
              <EnvIcon name={n.icon} size={n.size === 'lg' ? 14 : n.size === 'sm' ? 10 : 12} color={n.iconColor} />
            </div>
            <span className="env-node-label">{n.label}</span>
          </div>
        </div>
      ))}

      {/* ── Background particles ── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="env-particle env-tertiary"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
            background: 'rgba(255,255,255,0.45)',
            '--pd': p.pd,
            '--pdd': p.pdd,
          }}
        />
      ))}
    </div>
  );
}

export default TechConstellationLayer;
