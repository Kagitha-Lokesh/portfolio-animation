import React from 'react';
import GlassCard from '../../../shared/ui/GlassCard';
import Badge from '../../../shared/ui/Badge';
import Chip from '../../../shared/ui/Chip';
import Heading from '../../../shared/ui/Heading';
import Button from '../../../shared/ui/Button';
import './AppStoreCard.css';

export function AppStoreCard({ project, index, theme = 'dark' }) {
  const gradientStyles = [
    'linear-gradient(135deg, rgba(0, 184, 148, 0.2) 0%, rgba(9, 132, 227, 0.2) 100%)',
    'linear-gradient(135deg, rgba(253, 203, 110, 0.2) 0%, rgba(214, 48, 49, 0.2) 100%)',
    'linear-gradient(135deg, rgba(108, 92, 231, 0.2) 0%, rgba(0, 184, 148, 0.2) 100%)'
  ];

  const currentGradient = gradientStyles[index % gradientStyles.length];

  return (
    <GlassCard theme={theme} className="app-store-card" glow={index === 0}>
      {/* App Store Card Top Header Visual */}
      <div className="card-top-visual" style={{ background: currentGradient }}>
        <div className="visual-overlay" />
        <span className="card-index">0{index + 1}</span>
      </div>

      <div className="card-body-content">
        <div className="card-meta-row">
          {project.tag ? (
            <Badge variant="mint">{project.tag}</Badge>
          ) : (
            <Badge variant="teal">Featured Project</Badge>
          )}
        </div>

        <Heading level={3} className="card-project-title">
          {project.title}
        </Heading>

        <p className="card-project-desc">{project.description}</p>

        {project.features && project.features.length > 0 && (
          <div className="card-features-area">
            <h4 className="features-section-title">Capabilities</h4>
            <div className="features-chip-container">
              {project.features.slice(0, 6).map((feat, idx) => (
                <Chip key={idx}>{feat}</Chip>
              ))}
            </div>
          </div>
        )}

        <div className="card-cta-row">
          <Button 
            variant="secondary" 
            className="card-cta-btn"
            onClick={() => project.github ? window.open(project.github, '_blank') : null}
          >
            GitHub ↗
          </Button>
          {project.liveDemo && (
            <Button 
              variant="primary" 
              className="card-cta-btn"
              onClick={() => window.open(project.liveDemo, '_blank')}
            >
              Live Demo ↗
            </Button>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

export default AppStoreCard;
