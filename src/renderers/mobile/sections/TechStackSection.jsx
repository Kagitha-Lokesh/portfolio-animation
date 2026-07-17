import React, { useState } from 'react';
import PortfolioRepository from '../../../shared/content/PortfolioRepository';
import SectionTitle from '../../../shared/ui/SectionTitle';
import GlassCard from '../../../shared/ui/GlassCard';
import Chip from '../../../shared/ui/Chip';
import { StaggerIn, StaggerItem } from '../../../shared/motion/MotionProvider';
import SectionReveal from '../components/SectionReveal';
import './TechStackSection.css';

export function TechStackSection({ theme = 'dark' }) {
  const content = PortfolioRepository.getTechStackData();
  const categories = content.categories || [];
  const [activeTab, setActiveTab] = useState(0);

  const activeCategory = categories[activeTab];

  return (
    <section id="techstack" className="mobile-section">
      <SectionReveal>
        <SectionTitle 
          title={content.heading} 
          subtitle="Specific frameworks, databases, and development tools I use day to day." 
        />
        
        <div className="techstack-tab-nav">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`techstack-tab-btn ${activeTab === idx ? 'active' : ''}`}
              onClick={() => setActiveTab(idx)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="techstack-tab-content">
          {activeCategory && (
            <GlassCard theme={theme} className="techstack-grid-card">
              <StaggerIn key={activeTab} className="techstack-items-grid" stagger={0.05}>
                {activeCategory.items.map((item, idx) => (
                  <StaggerItem key={idx} y={10} className="techstack-item-wrapper">
                    <div className="techstack-badge-item">
                      <span className="badge-bullet">●</span>
                      <span className="badge-name">{item}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerIn>
            </GlassCard>
          )}
        </div>
      </SectionReveal>
    </section>
  );
}

export default TechStackSection;
