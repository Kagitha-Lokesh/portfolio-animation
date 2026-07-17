import React from 'react';
import ContentCard from '../components/ContentCard';

export function ExperienceSection({ theme, content, hasTriggered = () => false }) {
  return (
    <div className="experience-section-wrapper">
      <h2 
        className={`section-heading fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}
        data-theme={theme}
      >
        {content.heading}
      </h2>

      <div className={`experience-list fade-element ${hasTriggered('CARDS_IN') ? 'visible' : ''}`}>
        <div className="experience-content-column">
          <div className="experience-cards-column">
            {content.items.map((exp, idx) => (
              <ContentCard key={idx} theme={theme} className="experience-card">
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
              </ContentCard>
            ))}
          </div>

          <div className="experience-highlight-quote">
            <div className="quote-mark">"</div>
            <p>Building scalable, intelligent software solutions while continuously growing my expertise in Full Stack Development, cloud, and AI — with the goal of creating products that deliver real, meaningful impact.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExperienceSection;
