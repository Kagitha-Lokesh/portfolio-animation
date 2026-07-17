import React, { useState } from 'react';
import PortfolioRepository from '../../../shared/content/PortfolioRepository';
import SectionTitle from '../../../shared/ui/SectionTitle';
import GlassCard from '../../../shared/ui/GlassCard';
import Badge from '../../../shared/ui/Badge';
import Heading from '../../../shared/ui/Heading';
import SectionReveal from '../components/SectionReveal';
import './ExperienceSection.css';

export function ExperienceSection({ theme = 'dark' }) {
  const content = PortfolioRepository.getExperienceData();
  const items = content.items || [];
  
  // Set tracking array for expanded indexes
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section id="experience" className="mobile-section">
      <SectionReveal>
        <SectionTitle 
          title={content.heading} 
          subtitle="Professional history, roles, and internship details." 
        />
        
        <div className="mobile-experience-timeline">
          {/* Central timeline line */}
          <div className="timeline-connector-line" />
          
          <div className="timeline-items-list">
            {items.map((item, idx) => {
              const isExpanded = expandedIndex === idx;
              const visibleResponsibilities = isExpanded 
                ? item.responsibilities 
                : item.responsibilities.slice(0, 3);
              const hasMore = item.responsibilities.length > 3;

              return (
                <div key={idx} className="timeline-item-wrapper">
                  {/* Circle marker on line */}
                  <div className="timeline-marker-dot">
                    <span className="marker-inner-glow" />
                  </div>
                  
                  <GlassCard theme={theme} className="timeline-item-card">
                    <div className="timeline-card-header">
                      <div className="timeline-meta-row">
                        <Badge variant="mint">{item.duration || 'Internship'}</Badge>
                      </div>
                      
                      <Heading level={3} className="timeline-role-title">
                        {item.role}
                      </Heading>
                      
                      <span className="timeline-company-name">
                        {item.company}
                      </span>
                    </div>

                    <ul className="timeline-resp-list">
                      {visibleResponsibilities.map((resp, rIdx) => (
                        <li key={rIdx} className="timeline-resp-item">
                          <span className="resp-bullet-dot" />
                          <span className="resp-text">{resp}</span>
                        </li>
                      ))}
                    </ul>

                    {hasMore && (
                      <button 
                        className="timeline-expand-btn"
                        onClick={() => toggleExpand(idx)}
                      >
                        {isExpanded ? 'Show Less ↑' : 'Show More (Expand) ↓'}
                      </button>
                    )}
                  </GlassCard>
                </div>
              );
            })}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}

export default ExperienceSection;
