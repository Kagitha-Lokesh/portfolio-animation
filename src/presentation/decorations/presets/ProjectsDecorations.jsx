import React from 'react';
import { EnvIcon } from '../EnvIcon';

/**
 * ProjectsDecorations  —  V3
 *
 * SAFE ZONE: safeZone "right" — content RIGHT, character LEFT (22–55%)
 * Character: desk_typing, red_hoodie
 *
 * DECORATION ZONE: far left strip 2–16% ONLY.
 * All elements are behind the content cards (z-35 < z-40).
 * Opacity: 6–10% for bg elements, 12–15% for signature terminal.
 *
 * Signature: blinking cursor in terminal block (far left, clearly in negative space)
 */

const COMMIT_PILLS = [
  { text: 'feat: add AI assistant',  left: '2%',  top: '8%',   cd: '13s', cdd: '0s'    },
  { text: 'refactor: clean hooks',   left: '12%', top: '24%',  cd: '10s', cdd: '7s'    },
  { text: 'fix: memory leak',        left: '2%',  top: '72%',  cd: '11s', cdd: '4.5s'  },
  { text: 'chore: update deps',      left: '1%',  top: '92%',  cd: '14s', cdd: '2s'    },
];

export function ProjectsDecorations() {
  return (
    <>
      {/* ── SVG git branch tree — top-left area ── */}
      <svg
        className="env-secondary"
        style={{
          position: 'absolute',
          left: '2%', top: '12%',
          width: 80, height: 110,
          overflow: 'visible',
          pointerEvents: 'none',
          opacity: 0.45,
        }}
        aria-hidden="true"
      >
        {/* Main trunk */}
        <line x1="15" y1="0" x2="15" y2="90" stroke="rgba(0,184,148,1)" strokeWidth="1.5" strokeDasharray="2 3" />
        {/* Branch: develop */}
        <line x1="15" y1="20" x2="45" y2="45" stroke="rgba(97,218,251,1)" strokeWidth="1" />
        {/* Branch: feature */}
        <line x1="45" y1="45" x2="60" y2="70" stroke="rgba(97,218,251,1)" strokeWidth="1" />
        {/* Commit nodes on trunk */}
        {[8, 20, 45, 68, 88].map((y, i) => (
          <circle key={i} cx="15" cy={y} r="3" fill="rgba(0,184,148,1)" />
        ))}
        {/* Commit on develop */}
        <circle cx="45" cy="45" r="2.5" fill="rgba(97,218,251,1)" />
        <circle cx="60" cy="70" r="2"   fill="rgba(97,218,251,1)" />
        {/* Labels */}
        <text x="19" y="10" fill="rgba(0,184,148,1)" fontSize="7" fontFamily="'JetBrains Mono',monospace">main</text>
        <text x="48" y="43" fill="rgba(97,218,251,1)" fontSize="6" fontFamily="'JetBrains Mono',monospace">dev</text>
        <text x="63" y="68" fill="rgba(97,218,251,1)" fontSize="5" fontFamily="'JetBrains Mono',monospace">feat/ai</text>
      </svg>

      {/* ── Terminal block with blinking cursor (SIGNATURE) — bottom-left area ── */}
      <div
        className="env-terminal env-secondary"
        style={{
          left: '2%', top: '76%',
          width: 148,
          opacity: 0.58,
          '--nd': '12s', '--ndd': '0s',
        }}
      >
        <div className="env-terminal-bar">
          <div className="env-terminal-dot" style={{ background: 'rgba(255,95,87,0.6)' }} />
          <div className="env-terminal-dot" style={{ background: 'rgba(255,189,46,0.6)' }} />
          <div className="env-terminal-dot" style={{ background: 'rgba(40,200,64,0.6)' }} />
        </div>
        <div className="env-terminal-body">
          <div>
            <span style={{ color: 'rgba(0,184,148,0.6)', marginRight: 5 }}>$</span>
            npm run dev
          </div>
          <div style={{ color: 'rgba(0,184,148,0.4)', fontSize: 9 }}>
            ▶ http://localhost:5173
          </div>
          <div style={{ marginTop: 4 }}>
            <span style={{ color: 'rgba(0,184,148,0.5)', marginRight: 5 }}>$</span>
            <span className="env-cursor" />
          </div>
        </div>
      </div>

      {/* ── Wireframe code window — top-left area ── */}
      <div
        className="env-code-window env-tertiary"
        style={{
          left: '10%', top: '12%',
          width: 90,
          opacity: 0.38,
          '--nd': '14s', '--ndd': '2.5s',
        }}
      >
        <div className="env-code-window-bar">
          <div className="env-terminal-dot" style={{ background: 'rgba(255,255,255,0.25)' }} />
          <div className="env-terminal-dot" style={{ background: 'rgba(255,255,255,0.25)' }} />
          <span style={{ marginLeft: 4, fontFamily: "'JetBrains Mono',monospace", fontSize: 7, color: 'rgba(255,255,255,0.30)' }}>
            App.jsx
          </span>
        </div>
        <div>
          {[80, 60, 75, 45, 65, 40].map((w, i) => (
            <div key={i} className={`env-code-line${i === 0 || i === 3 ? ' env-code-line--accent' : ''}`}
              style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>

      {/* ── Folder structure label — bottom-left area ── */}
      <div
        className="env-folder-label env-secondary"
        style={{
          left: '12%', top: '76%',
          opacity: 0.45,
          '--nd': '10s', '--ndd': '1.5s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <EnvIcon name="folder" size={10} color="rgba(255,255,255,0.7)" />
          <span> src/</span>
        </div>
        <div style={{ paddingLeft: 12 }}>├─ components/</div>
        <div style={{ paddingLeft: 12 }}>├─ hooks/</div>
        <div style={{ paddingLeft: 12 }}>└─ utils/</div>
      </div>

      {/* ── Cycling commit pills ── */}
      {COMMIT_PILLS.map(({ text, left, top, cd, cdd }) => (
        <div
          key={text}
          className="env-commit-pill env-secondary"
          style={{ left, top, '--cd': cd, '--cdd': cdd, opacity: 1 }}
        >
          {text}
        </div>
      ))}

      {/* ── Minimal background particles ── */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="env-particle env-tertiary" style={{
          width: 1.5, height: 1.5,
          left: `${3 + i * 3}%`,
          top: `${28 + i * 14}%`,
          background: 'rgba(0,184,148,0.75)',
          '--pd': `${12 + i * 2}s`,
          '--pdd': `${i * 1.5}s`,
        }} />
      ))}
    </>
  );
}

export default ProjectsDecorations;
