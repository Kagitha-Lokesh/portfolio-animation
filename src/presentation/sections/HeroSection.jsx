import React from 'react';
import { Runtime } from '../../core/Runtime';

export function HeroSection({ content, hasTriggered = () => false }) {
  const handleCtaClick = () => {
    Runtime.commands.push({
      type: 'NAVIGATE',
      sectionId: 'about'
    });
  };

  return (
    <div className="hero-section-wrapper">
      <div className="hero-content-column">
        <h1 className={`hero-title fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}>
          {content.title}
        </h1>
        
        <p className={`hero-subtitle fade-element ${hasTriggered('SUBTITLE_IN') ? 'visible' : ''}`}>
          {content.subtitle}
        </p>

        <div className={`hero-body fade-element ${hasTriggered('SUBTITLE_IN') ? 'visible' : ''}`}>
          <p className="tagline">{content.tagline}</p>
          <p className="description">{content.description}</p>
        </div>

        <div className={`hero-actions fade-element ${hasTriggered('BUTTONS_IN') ? 'visible' : ''}`}>
          <button className="cta-button primary" onClick={handleCtaClick}>
            Explore Journey
            <span className="btn-glow" />
          </button>
          <button 
            className="cta-button secondary" 
            onClick={() => Runtime.commands.push({ type: 'NAVIGATE', sectionId: 'contact' })}
          >
            Get In Touch
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
