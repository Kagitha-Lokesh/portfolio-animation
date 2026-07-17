import React from 'react';
import { EnvIcon } from '../EnvIcon';

/**
 * AchievementsDecorations  —  V5 (Fixed Layout & Spacing)
 *
 * Theme: Recognition, Growth, Career Journey, Professional Development.
 *
 * LEGIBILITY & SCALING FIX:
 *   - Richer gold/bronze color (rgba(180, 135, 60)) for high contrast on light backgrounds.
 *   - Elevated base opacities (0.28 -> 0.40) so elements are cleanly readable.
 *   - Spacing compressed so all 5 milestones + 3 groups fit on all screen heights.
 *   - Positioned at left: 160px to stay clear of margins and character.
 */

const FONT_SANS = "'Inter', 'Helvetica Neue', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

// Richer bronze/gold for strong contrast on light cream background
const COLOR_GOLD = 'rgba(180, 130, 48, '; // prefix for custom opacity

const GROUPS = [
  {
    name: 'CAREER',
    items: [
      { year: '2022', label: 'Started Coding', icon: 'code2', state: 'done' },
      { year: '2023', label: 'First Website', icon: 'globe', state: 'done' },
    ]
  },
  {
    name: 'PROJECTS',
    items: [
      { year: '2025', label: 'DevMentor AI', icon: 'brain', state: 'current' },
      { year: '2025', label: '3D Portfolio', icon: 'portfolio', state: 'done' },
    ]
  },
  {
    name: 'FUTURE',
    items: [
      { year: '2026', label: 'Graduation', icon: 'graduation', state: 'inprogress' },
    ]
  }
];

const STATE = {
  done: {
    iconOpacity: 0.45,
    borderOpacity: 0.35,
    nodeBg: `rgba(180, 130, 48, 0.07)`,
    labelOpacity: 0.35,
    yearOpacity: 0.42,
    nodeSize: 34,
    iconSize: 16,
  },
  current: {
    iconOpacity: 0.95,
    borderOpacity: 0.85,
    nodeBg: `rgba(180, 130, 48, 0.16)`,
    labelOpacity: 0.85,
    yearOpacity: 0.90,
    nodeSize: 42,
    iconSize: 20,
    glow: '0 0 10px rgba(180, 130, 48, 0.28)',
  },
  inprogress: {
    iconOpacity: 0.55,
    borderOpacity: 0.42,
    nodeBg: `rgba(180, 130, 48, 0.05)`,
    labelOpacity: 0.42,
    yearOpacity: 0.50,
    nodeSize: 34,
    iconSize: 16,
  },
  future: {
    iconOpacity: 0.30,
    borderOpacity: 0.20,
    nodeBg: 'transparent',
    labelOpacity: 0.24,
    yearOpacity: 0.28,
    nodeSize: 32,
    iconSize: 14,
  },
};

// Stars — margin zones only (< 26% and > 74%)
const STARS = [
  { left: '5%',  top: '18%', nd: '3.2s', ndd: '0s'   },
  { left: '16%', top: '12%', nd: '2.8s', ndd: '1.0s' },
  { left: '76%', top: '22%', nd: '3.5s', ndd: '0.5s' },
  { left: '87%', top: '38%', nd: '2.6s', ndd: '1.8s' },
  { left: '9%',  top: '60%', nd: '3.8s', ndd: '2.4s' },
  { left: '85%', top: '62%', nd: '3.0s', ndd: '0.8s' },
  { left: '19%', top: '80%', nd: '2.5s', ndd: '3.2s' },
  { left: '79%', top: '76%', nd: '3.3s', ndd: '1.5s' },
];

// Gold rising particles — restricted to margins
const PARTICLES = [
  { size: 4, left: '6%',  nd: '3.8s', ndd: '0s'   },
  { size: 3, left: '14%', nd: '4.5s', ndd: '0.7s' },
  { size: 5, left: '22%', nd: '3.2s', ndd: '1.5s' },
  { size: 3, left: '72%', nd: '4.8s', ndd: '0.3s' },
  { size: 5, left: '80%', nd: '3.6s', ndd: '1.2s' },
  { size: 4, left: '88%', nd: '5.0s', ndd: '2.0s' },
];

export function AchievementsDecorations() {
  return (
    <>
      {/* ── Background Atmosphere & Vignette ── */}
      <div style={{
        position: 'absolute',
        left: '42%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100vw', height: '100vw',
        borderRadius: '50%',
        background: `radial-gradient(ellipse at 42% 48%,
          rgba(255, 215, 170, 0.08) 0%,
          rgba(253, 203, 110, 0.04) 28%,
          rgba(200, 180, 255, 0.025) 52%,
          rgba(100, 220, 200, 0.015) 70%,
          transparent 84%
        )`,
        filter: 'blur(30px)',
        pointerEvents: 'none',
        animation: 'env-atmo-shift 36s ease-in-out infinite',
      }} />

      {/* ── Soft vignette overlay to anchor the left story rail ── */}
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: '32%',
        background: 'linear-gradient(90deg, rgba(10, 16, 12, 0.05) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* ════════════════════════════════════════════════════
          STORY RAIL CONTAINER — shifted to left: 160px for perfect balance
      ════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          left: 160,             /* shifted right to prevent text cropping while staying clear of character */
          top: '12%',
          width: 240,
          height: '76%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 1,
          animation: 'env-rail-drift 10s ease-in-out infinite',
        }}
      >
        {/* ── Visual Anchor / Title ── */}
        <div style={{
          fontFamily: FONT_SANS,
          fontSize: 20,
          fontWeight: 500,
          letterSpacing: 4,
          textAlign: 'center',
          color: `${COLOR_GOLD}0.38)`,
          marginBottom: 6,
          animation: 'env-typo-breathe 8s ease-in-out infinite',
        }}>
          ACHIEVEMENT JOURNEY
        </div>

        <div style={{
          width: 110,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLOR_GOLD}0.22) 50%, transparent)`,
          marginBottom: 16,
        }} />

        {/* ── Vertical Stacked Groups ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}>
          {GROUPS.map((group, groupIdx) => (
            <div
              key={group.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {/* Group Title */}
              <div style={{
                fontFamily: FONT_MONO,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 4,
                color: `${COLOR_GOLD}0.45)`,
                marginBottom: 8,
                animation: 'env-typo-breathe 9s ease-in-out infinite',
              }}>
                {group.name}
              </div>

              {/* Group items (Vertical Stacked Layout) */}
              {group.items.map((item, itemIdx) => {
                const s = STATE[item.state] || STATE.done;
                const globalIndex = groupIdx * 2 + itemIdx;
                const enterDelay = `${0.12 + globalIndex * 0.12}s`;
                
                return (
                  <React.Fragment key={item.label}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        animation: `env-icon-enter 0.55s cubic-bezier(0.16, 1, 0.3, 1) both`,
                        animationDelay: enterDelay,
                      }}
                    >
                      {/* Year */}
                      <div style={{
                        fontFamily: FONT_SANS,
                        fontSize: 18,
                        fontWeight: 600,
                        color: `${COLOR_GOLD}${s.yearOpacity})`,
                        marginBottom: 3,
                        animation: 'env-typo-breathe 10s ease-in-out infinite',
                      }}>
                        {item.year}
                      </div>

                      {/* Icon container */}
                      <div style={{
                        width: s.nodeSize,
                        height: s.nodeSize,
                        borderRadius: '50%',
                        border: `1.5px solid ${COLOR_GOLD}${s.borderOpacity})`,
                        background: s.nodeBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 4,
                        boxShadow: s.glow || 'none',
                        opacity: s.iconOpacity,
                        animation: 'env-icon-pulse 7s ease-in-out infinite',
                      }}>
                        <EnvIcon name={item.icon} size={s.iconSize} color={`rgba(180, 130, 48, 1)`} />
                      </div>

                      {/* Label */}
                      <div style={{
                        fontFamily: FONT_SANS,
                        fontSize: 12,
                        fontWeight: 500,
                        letterSpacing: 2,
                        color: `${COLOR_GOLD}${s.labelOpacity})`,
                        textAlign: 'center',
                        marginBottom: 3,
                        animation: 'env-typo-breathe 9s ease-in-out infinite',
                      }}>
                        {item.label.toUpperCase()}
                      </div>
                    </div>

                    {/* Vertical Connector Line (placed between stacked nodes) */}
                    {!(groupIdx === GROUPS.length - 1 && itemIdx === group.items.length - 1) && (
                      <div style={{
                        width: 2,
                        height: 16,
                        background: `linear-gradient(180deg, ${COLOR_GOLD}0.24) 0%, ${COLOR_GOLD}0.02) 100%)`,
                        opacity: 0.8,
                        margin: '2px 0',
                        animation: `env-icon-enter 0.55s cubic-bezier(0.16, 1, 0.3, 1) both`,
                        animationDelay: enterDelay,
                      }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Preserve Star Twinkles (restricted to margin zones) ── */}
      {STARS.map(({ left, top, nd, ndd }, i) => (
        <div key={i}
          className={`env-star ${i >= 4 ? 'env-secondary' : ''}`}
          style={{ left, top, fontSize: 14, '--nd': nd, '--ndd': ndd, color: 'rgba(180, 130, 48, 0.40)' }}
        >✦</div>
      ))}

      {/* ── Preserve Gold Rising Particles (restricted to margin zones) ── */}
      {PARTICLES.map((p, i) => (
        <div key={i}
          className={`env-rise-particle ${i >= 3 ? 'env-secondary' : ''}`}
          style={{
            width: p.size, height: p.size,
            left: p.left, bottom: '10%',
            background: `radial-gradient(circle, rgba(180, 130, 48, 0.80), rgba(180, 130, 48, 0.12))`,
            boxShadow: `0 0 ${p.size + 1}px rgba(180, 130, 48, 0.30)`,
            '--nd': p.nd, '--ndd': p.ndd,
          }}
        />
      ))}
    </>
  );
}

export default AchievementsDecorations;
