import React from 'react';

export function AchievementsSection({ content, hasTriggered = () => false }) {
  return (
    <div className="achievements-section-wrapper">
      <h2 className={`section-title fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}>
        {content.heading}
      </h2>

      <div className={`achievements-card glass-panel fade-element ${hasTriggered('LIST_IN') ? 'visible' : ''}`}>
        <ul className="achievements-list">
          {content.items.map((ach, idx) => (
            <li key={idx} className="achievement-item">
              <span className="bullet-glow" />
              <p className="achievement-text">{ach}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AchievementsSection;
