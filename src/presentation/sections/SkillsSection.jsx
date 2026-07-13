import React from 'react';

export function SkillsSection({ content, hasTriggered = () => false }) {
  return (
    <div className="skills-section-wrapper">
      <h2 className={`section-title fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}>
        {content.heading}
      </h2>

      <div className={`skills-grid bento-grid fade-element ${hasTriggered('GRID_IN') ? 'visible' : ''}`}>
        {content.categories.map((cat, idx) => (
          <div key={idx} className="skills-card glass-panel dark-panel">
            <h3 className="category-label">{cat.label}</h3>
            <ul className="skills-list">
              {cat.items.map((item, itemIdx) => (
                <li key={itemIdx} className="skills-item">
                  <span className="dot-indicator" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsSection;
