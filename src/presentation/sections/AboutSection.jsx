import React from 'react';

export function AboutSection({ content, hasTriggered = () => false }) {
  return (
    <div className="about-section-wrapper">
      <h2 className={`section-title fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}>
        {content.heading}
      </h2>

      <div className="about-grid">
        <div className={`about-text-card glass-panel fade-element ${hasTriggered('CONTENT_IN') ? 'visible' : ''}`}>
          {content.paragraphs.map((p, idx) => (
            <p key={idx} className="about-p">{p}</p>
          ))}
        </div>

        <div className="about-meta-cols">
          <div className={`meta-card glass-panel fade-element ${hasTriggered('CONTENT_IN') ? 'visible' : ''}`}>
            <h3>Interests</h3>
            <div className="pills-grid">
              {content.interests.map((interest, idx) => (
                <span key={idx} className="pill-item">{interest}</span>
              ))}
            </div>
          </div>

          <div className={`meta-card glass-panel fade-element ${hasTriggered('CONTENT_IN') ? 'visible' : ''}`} style={{ marginTop: '20px' }}>
            <h3>Soft Skills</h3>
            <div className="pills-grid">
              {content.softSkills.map((skill, idx) => (
                <span key={idx} className="pill-item skill-pill">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
