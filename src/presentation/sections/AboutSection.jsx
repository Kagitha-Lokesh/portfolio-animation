import React from 'react';

export function AboutSection({ content, hasTriggered = () => false }) {
  return (
    <div className="about-section-wrapper">
      <h2 className={`section-title fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}>
        {content.heading}
      </h2>

      <div className={`about-card glass-panel fade-element ${hasTriggered('CONTENT_IN') ? 'visible' : ''}`}>
        <div className="about-paragraphs">
          {content.paragraphs.map((p, idx) => (
            <p key={idx} className="about-p">{p}</p>
          ))}
        </div>

        <div className="about-interests">
          <h3 className="interests-heading">Interests</h3>
          <div className="pills-grid">
            {content.interests.map((interest, idx) => (
              <span key={idx} className="pill-item">{interest}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
