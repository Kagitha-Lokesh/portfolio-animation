import React from 'react';
import PortfolioRepository from '../../../shared/content/PortfolioRepository';
import SectionTitle from '../../../shared/ui/SectionTitle';
import GlassCard from '../../../shared/ui/GlassCard';
import Badge from '../../../shared/ui/Badge';
import Heading from '../../../shared/ui/Heading';
import SectionReveal from '../components/SectionReveal';
import './EducationSection.css';

export function EducationSection({ theme = 'dark' }) {
  const content = PortfolioRepository.getEducationData();
  const items = content.items || [];

  return (
    <section id="education" className="mobile-section">
      <SectionReveal>
        <SectionTitle 
          title={content.heading} 
          subtitle="Education, institutions, branches, and academic paths." 
        />
        
        <div className="mobile-education-timeline">
          <div className="edu-connector-line" />
          
          <div className="edu-items-list">
            {items.map((item, idx) => (
              <div key={idx} className="edu-item-wrapper">
                <div className="edu-marker-dot">
                  <span className="edu-inner-glow" />
                </div>
                
                <GlassCard theme={theme} className="edu-item-card">
                  <div className="edu-card-header">
                    <div className="edu-badge-row">
                      <Badge variant="teal">
                        {item.status || item.duration || item.completed || 'Academic Info'}
                      </Badge>
                    </div>
                    
                    <Heading level={3} className="edu-degree-title">
                      {item.level}
                    </Heading>
                    
                    {item.branch && (
                      <p className="edu-branch-text">{item.branch}</p>
                    )}
                  </div>
                  
                  <div className="edu-institution-info">
                    <span className="edu-institution-name">{item.institution}</span>
                    {item.location && (
                      <span className="edu-location-bullet"> • {item.location}</span>
                    )}
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}

export default EducationSection;
