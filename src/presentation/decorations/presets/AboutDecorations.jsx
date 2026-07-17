import React from 'react';

/**
 * AboutDecorations  —  V3
 * Soft geometric shapes in far left/right margins.
 * Uses V3 CSS class system — no old V1 classes.
 */
export function AboutDecorations() {
  const shapes = [
    // Left strip shapes
    { w: 90, h: 90,  left: '2%',  top: '30%', r: 16,  nd: '10s', ndd: '0s', color: 'rgba(0,184,148,0.48)' },
    { w: 50, h: 50,  left: '6%',  top: '60%', r: '50%', nd: '7s', ndd: '2s', color: 'rgba(0,184,148,0.32)' },
    { w: 34, h: 34,  left: '16%', top: '18%', r: 8,   nd: '12s', ndd: '4s', color: 'rgba(0,184,148,0.42)', rotate: 18 },
    // Right strip shapes
    { w: 68, h: 68,  right: '3%', top: '45%', r: 12, nd: '9s',  ndd: '1s', color: 'rgba(0,184,148,0.28)' },
    { w: 38, h: 38,  right: '8%', top: '25%', r: '50%', nd: '11s', ndd: '3s', color: 'rgba(0,184,148,0.40)' },
  ];

  return (
    <>
      {/* Geometric shapes — far margins */}
      {shapes.map((s, i) => (
        <div key={i} className="env-secondary" style={{
          position: 'absolute',
          width: s.w, height: s.h,
          left: s.left, right: s.right, top: s.top,
          borderRadius: s.r,
          border: `1px solid ${s.color}`,
          background: 'transparent',
          opacity: 0.75,
          pointerEvents: 'none',
          transform: s.rotate ? `rotate(${s.rotate}deg)` : undefined,
          animation: `env-float ${s.nd} ease-in-out infinite ${s.ndd}`,
        }} />
      ))}

      {/* Ambient particles */}
      {[
        { size: 2, left: '10%', top: '50%', pd: '13s', pdd: '0s'  },
        { size: 3, left: '4%',  top: '78%', pd: '10s', pdd: '2s'  },
        { size: 2, right: '5%', top: '70%', pd: '15s', pdd: '1s'  },
      ].map((p, i) => (
        <div key={i} className="env-particle env-tertiary" style={{
          width: p.size, height: p.size,
          left: p.left, right: p.right, top: p.top,
          background: 'rgba(0,184,148,0.65)',
          '--pd': p.pd, '--pdd': p.pdd,
        }} />
      ))}
    </>
  );
}

export default AboutDecorations;
