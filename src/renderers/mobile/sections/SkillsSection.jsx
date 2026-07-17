import React from 'react';
import PortfolioRepository from '../../../shared/content/PortfolioRepository';
import SectionTitle from '../../../shared/ui/SectionTitle';
import SkillCluster from '../components/SkillCluster';
import SectionReveal from '../components/SectionReveal';
import './SkillsSection.css';

export function SkillsSection({ theme = 'dark' }) {
  const content = PortfolioRepository.getSkillsData();
  const categories = content.categories || [];

  return (
    <section id="skills" className="mobile-section">
      <SectionReveal>
        <SectionTitle 
          title={content.heading} 
          subtitle="Expertise categories containing technologies and concepts I build with." 
        />
        
        <div className="mobile-skills-grid">
          {categories.map((cat, idx) => (
            <div key={idx} className="mobile-skill-cluster-item">
              <SkillCluster category={cat} theme={theme} />
            </div>
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}

export default SkillsSection;
