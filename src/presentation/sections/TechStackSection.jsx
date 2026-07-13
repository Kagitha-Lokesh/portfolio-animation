import React from 'react';

export function TechStackSection({ content, hasTriggered = () => false }) {
  return (
    <div className="techstack-section-wrapper">
      <h2 className={`section-title fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}>
        {content.heading}
      </h2>

      <div className={`techstack-grid fade-element ${hasTriggered('STACK_IN') ? 'visible' : ''}`}>
        {content.categories.map((cat, idx) => (
          <div key={idx} className="techstack-card glass-panel dark-panel">
            <h3 className="category-label">{cat.label}</h3>
            <div className="tech-badge-container">
              {cat.items.map((item, itemIdx) => (
                <span key={itemIdx} className="tech-badge">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechStackSection;
