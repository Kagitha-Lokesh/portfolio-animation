import React from 'react';
import PortfolioRepository from '../../../shared/content/PortfolioRepository';
import SectionTitle from '../../../shared/ui/SectionTitle';
import AppStoreCard from '../components/AppStoreCard';
import SectionReveal from '../components/SectionReveal';
import './ProjectsSection.css';

export function ProjectsSection({ theme = 'dark' }) {
  const content = PortfolioRepository.getProjectsData();
  const projects = content.items || [];

  return (
    <section id="projects" className="mobile-section">
      <SectionReveal>
        <SectionTitle 
          title={content.heading} 
          subtitle="Featured software and tools designed to solve real problems." 
        />
        
        <div className="mobile-projects-list">
          {projects.map((proj, idx) => (
            <AppStoreCard 
              key={idx} 
              project={proj} 
              index={idx} 
              theme={theme} 
            />
          ))}
        </div>
      </SectionReveal>
    </section>
  );
}

export default ProjectsSection;
