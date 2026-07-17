import React from 'react';
import ContentCard from '../components/ContentCard';

export function AchievementsSection({ theme, content, hasTriggered = () => false }) {
  return (
    <div className="achievements-section-wrapper">
      <div className="achievements-content-column">
        <h2 
          className={`section-heading achievements-heading fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}
          data-theme={theme}
        >
          {content.heading}
        </h2>

        <ContentCard 
          theme={theme}
          className={`achievements-card fade-element ${hasTriggered('LIST_IN') ? 'visible' : ''}`}
        >
          <ul className="achievements-list">
            {content.items.map((ach, idx) => (
              <li key={idx} className="achievement-item">
                <span className="bullet-glow" />
                <p className="achievement-text">{ach}</p>
              </li>
            ))}
          </ul>
        </ContentCard>
      </div>
    </div>
  );
}

export default AchievementsSection;
