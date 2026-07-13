import React from 'react';

export function ExperienceSection({ content, hasTriggered = () => false }) {
  return (
    <div className="experience-section-wrapper">
      <h2 className={`section-title fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}>
        {content.heading}
      </h2>

      <div className={`experience-list fade-element ${hasTriggered('CARDS_IN') ? 'visible' : ''}`}>
        {content.items.map((exp, idx) => (
          <div key={idx} className="experience-card glass-panel">
            <div className="card-header">
              <span className="duration-tag">{exp.duration}</span>
              <h3 className="role-title">{exp.role}</h3>
              <p className="company-name">{exp.company}</p>
            </div>
            
            <ul className="responsibilities-list">
              {exp.responsibilities.map((resp, respIdx) => (
                <li key={respIdx} className="responsibility-item">
                  <span className="bullet-dot" />
                  {resp}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExperienceSection;
