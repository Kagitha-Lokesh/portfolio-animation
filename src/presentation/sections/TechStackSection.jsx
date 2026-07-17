import React from 'react';
import ContentCard from '../components/ContentCard';

export function TechStackSection({ theme, content, hasTriggered = () => false }) {
  return (
    <div className="techstack-section-wrapper">
      <div className="techstack-right-column">
        <h2 
          className={`section-heading techstack-heading fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}
          data-theme={theme}
        >
          {content.heading}
        </h2>

        <div className="techstack-content-column">
          <div className={`techstack-grid fade-element ${hasTriggered('STACK_IN') ? 'visible' : ''}`}>
            {content.categories.map((cat, idx) => {
              const isTools = cat.label.toLowerCase().includes("tools");
              return (
                <ContentCard
                  key={idx}
                  theme={theme}
                  className={`techstack-card ${isTools ? 'tools-card' : ''}`}
                >
                  <h3 className="category-label">{cat.label}</h3>
                  <div className="tech-badge-container">
                    {cat.items.map((item, itemIdx) => (
                      <span key={itemIdx} className="tech-badge">
                        {item}
                      </span>
                    ))}
                  </div>
                </ContentCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechStackSection;
