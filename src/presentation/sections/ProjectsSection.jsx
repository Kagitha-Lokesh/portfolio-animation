import React, { useState } from 'react';

export function ProjectsSection({ content, hasTriggered = () => false }) {
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);

  const activeProject = content.items[activeProjectIdx];

  return (
    <div className="projects-section-wrapper">
      <h2 className={`section-title fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}>
        {content.heading}
      </h2>

      <div className={`projects-container fade-element ${hasTriggered('CAROUSEL_IN') ? 'visible' : ''}`}>
        {/* Project Selector tabs */}
        <div className="project-tabs">
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
          <div className="project-detail-card glass-panel">
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
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsSection;
