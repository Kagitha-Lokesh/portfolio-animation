import React from 'react';
import { useLenis } from './hooks/useLenis';
import { CanvasRenderer } from './rendering/CanvasRenderer';
import { Navbar } from './presentation/Navbar/Navbar';
import { ScrollProgressRail } from './presentation/components/ScrollProgressRail';
import { DeveloperConsole } from './presentation/components/DeveloperConsole';
import { SectionOverlay } from './presentation/Overlay/SectionOverlay';
import { PORTFOLIO_CONFIG } from './config/portfolio.config';

// Import visual section wrappers
import HeroSection from './presentation/sections/HeroSection';
import AboutSection from './presentation/sections/AboutSection';
import SkillsSection from './presentation/sections/SkillsSection';
import TechStackSection from './presentation/sections/TechStackSection';
import ProjectsSection from './presentation/sections/ProjectsSection';
import ExperienceSection from './presentation/sections/ExperienceSection';
import EducationSection from './presentation/sections/EducationSection';
import AchievementsSection from './presentation/sections/AchievementsSection';
import ContactSection from './presentation/sections/ContactSection';

/**
 * Main Application Shell
 */
function App() {
  // Boot up Lenis smooth scrolling sync
  useLenis();

  return (
    <div className="app-root">
      {/* 1. Fullscreen Animation canvas rendering backdrop */}
      <CanvasRenderer />

      {/* 2. Floating Navbar menu */}
      <Navbar />

      {/* Side Scroll-Progress Indicator */}
      <ScrollProgressRail />

      {/* 3. Developer Diagnostics Console (toggled by F2) */}
      <DeveloperConsole />

      {/* 4. Presentation overlay contents layer */}
      <div className="overlays-layer">
        {Object.values(PORTFOLIO_CONFIG.sections).map((sec) => {
          let SectionComponent = null;
          if (sec.id === 'home') SectionComponent = HeroSection;
          else if (sec.id === 'about') SectionComponent = AboutSection;
          else if (sec.id === 'skills') SectionComponent = SkillsSection;
          else if (sec.id === 'techstack') SectionComponent = TechStackSection;
          else if (sec.id === 'projects') SectionComponent = ProjectsSection;
          else if (sec.id === 'experience') SectionComponent = ExperienceSection;
          else if (sec.id === 'education') SectionComponent = EducationSection;
          else if (sec.id === 'achievements') SectionComponent = AchievementsSection;
          else if (sec.id === 'contact') SectionComponent = ContactSection;

          const theme = sec.lighting.profile === 'WarmMorning' ? 'light' : 'dark';
          const align = sec.camera.safeZone;
          const layout = sec.id;

          return (
            <SectionOverlay
              key={sec.id}
              sectionId={sec.id}
              layout={layout}
              theme={theme}
              align={align}
            >
              {SectionComponent && <SectionComponent content={sec.content} />}
            </SectionOverlay>
          );
        })}
      </div>

      {/* 5. Virtual scroll container (creates 900vh scrolling boundaries) */}
      <div className="virtual-scroll-viewport">
        {Object.values(PORTFOLIO_CONFIG.sections).map((sec) => (
          <div 
            key={sec.id} 
            className="virtual-scroll-section" 
            style={{ height: '100vh' }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
