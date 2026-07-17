import React, { useState } from 'react';
import ContentCard from '../components/ContentCard';

export function ProjectsSection({ theme, content, hasTriggered = () => false }) {
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);

  const activeProject = content.items[activeProjectIdx];

  return (
    <div className="projects-section-wrapper">
      <h2 
        className={`section-heading fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}
        data-theme={theme}
      >
        {content.heading}
      </h2>
      
      <p
        className={`projects-instructions fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          color: theme === 'dark' ? "rgba(255, 255, 255, 0.45)" : "rgba(28, 72, 50, 0.55)",
          textAlign: "center",
          marginTop: "-12px",
          marginBottom: "24px",
          letterSpacing: "0.02em",
          fontWeight: 500,
        }}
      >
        Select a project on the left to reveal capabilities
      </p>

      <div className={`projects-content-column fade-element ${hasTriggered('CAROUSEL_IN') ? 'visible' : ''}`}>
        {/* Project Selector tabs */}
        <div className="projects-list">
          {content.items.map((proj, idx) => (
            <button
              key={idx}
              className={`project-tab-button ${activeProjectIdx === idx ? 'active' : ''}`}
              onClick={() => setActiveProjectIdx(idx)}
            >
              <span className="tab-number">0{idx + 1}</span>
              <span className="tab-title">{proj.title}</span>
            </button>
          ))}
        </div>

        {/* Selected Project Card */}
        {activeProject && (
          <ContentCard theme={theme} className="project-detail-card">
            <div className="card-header">
              {activeProject.tag && <span className="project-badge">{activeProject.tag}</span>}
              <h3>{activeProject.title}</h3>
            </div>
            
            <p className="project-desc">{activeProject.description}</p>
            
            <div className="project-features-container">
              <h4>Key Capabilities</h4>
              <div className="features-pill-grid">
                {activeProject.features.map((feat, idx) => (
                  <span key={idx} className="feature-pill">
                    <span className="feature-pill-dot" />
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          </ContentCard>
        )}
      </div>
    </div>
  );
}

export default ProjectsSection;
