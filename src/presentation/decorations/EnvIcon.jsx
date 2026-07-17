import React from 'react';

/**
 * EnvIcon — Inline SVG Icon System
 *
 * Zero external dependencies. All paths are original minimal SVG geometry
 * designed to match Lucide / Linear visual style: 2px stroke, round caps,
 * 24x24 viewBox. No fill, stroke only.
 *
 * Usage:
 *   <EnvIcon name="react" size={16} color="rgba(97,218,251,0.6)" />
 */

const PATHS = {
  // ── Tech Icons ───────────────────────────────────────────
  react: (
    // Atom: center dot + 3 orbital ellipses
    <>
      <circle cx="12" cy="12" r="2.2" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </>
  ),
  node: (
    // Hexagon outline
    <polygon points="12,2 21.5,7 21.5,17 12,22 2.5,17 2.5,7" />
  ),
  javascript: (
    // JS square with "JS" suggestion — square with inner bracket
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 16v-5M14 11v3a2 2 0 004 0v-3" />
    </>
  ),
  git: (
    // Git branch fork
    <>
      <circle cx="6" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M6 8v8M8 6h6a4 4 0 014 4v2" />
    </>
  ),
  github: (
    // Octocat simplified: rounded square + fork shape
    <>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </>
  ),
  firebase: (
    // Flame outline
    <path d="M12 2C8 7 6 10 6 14a6 6 0 0012 0c0-2-.5-4-2-6-1 2-1.5 3-3 3C11 9 12 5 12 2z" />
  ),
  sql: (
    // Database cylinder
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0018 0V5" />
      <path d="M3 12a9 3 0 0018 0" />
    </>
  ),
  vite: (
    // Lightning bolt / diamond
    <path d="M13 2L4.5 13h7L9 22l10.5-11H12L13 2z" />
  ),
  html: (
    // Angle-bracket document outline
    <>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M9 13l-2 2 2 2M15 13l2 2-2 2" />
    </>
  ),
  css: (
    // Palette / styling: circle with inner cross
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8M12 8v8" />
    </>
  ),

  // ── Dev Tools ───────────────────────────────────────────
  terminal: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M6 9l4 3-4 3M13 15h5" />
    </>
  ),
  branch: (
    <>
      <circle cx="6" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M6 8v8M8 6h6a4 4 0 014 4v1" />
    </>
  ),
  folder: (
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  ),
  commit: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M2 12h6M16 12h6" />
    </>
  ),

  // ── Education ────────────────────────────────────────────
  graduation: (
    <>
      <path d="M22 10L12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
      <path d="M22 10v5" />
    </>
  ),
  book: (
    <>
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </>
  ),
  brain: (
    <path d="M9.5 2A2.5 2.5 0 007 4.5v.5a3 3 0 00-3 3c0 .8.3 1.5.8 2A3 3 0 003 13c0 1.4.9 2.5 2.2 2.9A3 3 0 008 19h8a3 3 0 002.8-3.1A3 3 0 0021 13a3 3 0 00-1.8-2.5c.5-.5.8-1.2.8-2a3 3 0 00-3-3v-.5A2.5 2.5 0 0014.5 2h-5z" />
  ),
  atom: (
    <>
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-60 12 12)" />
    </>
  ),
  certificate: (
    <>
      <circle cx="12" cy="8" r="6" />
      <path d="M9 12l2 2 4-4M8.5 14l-2 6 5.5-2 5.5 2-2-6" />
    </>
  ),
  school: (
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <path d="M9 22V12h6v10" />
    </>
  ),

  // ── Contact ──────────────────────────────────────────────
  mail: (
    <>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.5 14l2.5 7-6-3-6 3 2.5-7" />
    </>
  ),
  location: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.69A2 2 0 012 .13h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14c0-.04 0 2.93 0 2.92z" />
  ),
  portfolio: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),

  // ── Architecture ─────────────────────────────────────────
  server: (
    <>
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <circle cx="6" cy="6" r="1" />
      <circle cx="6" cy="18" r="1" />
    </>
  ),
  api: (
    <>
      <path d="M2 9h8M14 9h8" />
      <path d="M2 15h8M14 15h8" />
      <rect x="8" y="6" width="8" height="12" rx="1" />
    </>
  ),
  workflow: (
    <>
      <circle cx="5" cy="12" r="3" />
      <circle cx="19" cy="5" r="3" />
      <circle cx="19" cy="19" r="3" />
      <path d="M8 12h8M16 6l-4 4M16 18l-4-4" />
    </>
  ),

  // ── Achievements & Career ─────────────────────────────────
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </>
  ),
  code2: (
    <>
      <path d="M16 18l6-6-6-6M8 6L2 12l6 6" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="8" r="6" />
      <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  star: (
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  ),
  briefcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4" />
    </>
  ),
  zap: (
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
  ),
};

export function EnvIcon({
  name,
  size = 16,
  color = 'currentColor',
  style = {},
  className = '',
}) {
  const paths = PATHS[name];
  if (!paths) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}
      className={className}
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}

export default EnvIcon;
