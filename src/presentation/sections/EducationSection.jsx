import React from 'react';
import ContentCard from '../components/ContentCard';

export function EducationSection({ theme, content, hasTriggered = () => false }) {
  return (
    <div className="education-section-wrapper">
      <div className="education-content-column">
        <h2 
          className={`section-heading fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}
          data-theme={theme}
        >
          {content.heading}
        </h2>

        <div className={`education-timeline fade-element ${hasTriggered('TIMELINE_IN') ? 'visible' : ''}`}>
          {content.items.map((edu, idx) => (
            <ContentCard key={idx} theme={theme} className="timeline-node education-timeline-card">
              <div className="node-marker">
                <span className="marker-inner" />
              </div>
              
              <div className="node-content">
                <span className="node-status-badge">
                  {edu.status || edu.duration || edu.completed || 'Academic Info'}
                </span>
                <h3 className="node-level">{edu.level}</h3>
                {edu.branch && <p className="node-branch">{edu.branch}</p>}
                <p className="node-institution">
                  {edu.institution}
                  {edu.location && <span className="node-location"> • {edu.location}</span>}
                </p>
              </div>
            </ContentCard>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EducationSection;
