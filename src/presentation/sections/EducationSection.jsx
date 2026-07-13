import React from 'react';

export function EducationSection({ content, hasTriggered = () => false }) {
  return (
    <div className="education-section-wrapper">
      <h2 className={`section-title fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}>
        {content.heading}
      </h2>

      <div className={`education-timeline fade-element ${hasTriggered('TIMELINE_IN') ? 'visible' : ''}`}>
        {content.items.map((edu, idx) => (
          <div key={idx} className="timeline-node glass-panel">
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default EducationSection;
