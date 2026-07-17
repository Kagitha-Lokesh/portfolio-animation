import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useLenis } from './hooks/useLenis';
import { CanvasRenderer } from './rendering/CanvasRenderer';
import { Navbar } from './presentation/Navbar/Navbar';
import { ScrollProgressRail } from './presentation/components/ScrollProgressRail';
import { DeveloperConsole } from './presentation/components/DeveloperConsole';
import { SectionOverlay } from './presentation/Overlay/SectionOverlay';
import { PORTFOLIO_CONFIG } from './config/portfolio.config';
import { EventBus } from './core/EventBus';
import { TransitionDirector } from './animation/TransitionDirector';
import './styles/cinematic-transitions.css';

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

// Import newly designed premium components
import CharacterContactShadow from './presentation/components/CharacterContactShadow';
import FloatingIcons from './presentation/components/FloatingIcons';
import SectionDecorations from './presentation/decorations/SectionDecorations';

/**
 * Main Application Shell
 */
function App() {
  // Boot up Lenis smooth scrolling sync
  useLenis();

  const sceneWrapperRef = useRef(null);
  const [activeSectionId, setActiveSectionId] = useState('home');

  useEffect(() => {
    // ── Cinematic Transition System 2.0 ─────────────────────────────
    // Initialize the TransitionDirector once. It bootstraps the state machine,
    // scene clock, and all 9 specialized animation modules.
    const director = new TransitionDirector();

    // ── Scroll Tension: scene-wrapper y-tug ─────────────────────────
    // Keep the scene-wrapper tactile y-tug for the whole scene.
    // Individual layer depth-parallax is handled by OverlayAnimator.
    const unsubTension = EventBus.on("SCROLL_TENSION", ({ percent, direction }) => {
      if (!sceneWrapperRef.current) return;
      const MAX_TUG_PX = 16;
      const tug = percent * MAX_TUG_PX * -direction;
      gsap.to(sceneWrapperRef.current, {
        y: tug,
        duration: 0.12,
        ease: "power1.out",
        overwrite: "auto",
      });
    });

    const unsubRelease = EventBus.on("SCROLL_TENSION_RELEASE", () => {
      if (!sceneWrapperRef.current) return;
      gsap.to(sceneWrapperRef.current, {
        y: 0,
        duration: 0.45,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      });
    });

    const unsubActive = EventBus.on("SECTION_ACTIVE", (secId) => {
      setActiveSectionId(secId);
    });

    return () => {
      director.destroy();
      unsubTension();
      unsubRelease();
      unsubActive();
    };
  }, []);

  const activeSection = PORTFOLIO_CONFIG.sections[activeSectionId];
  const focusX = activeSection?.camera?.focusX ?? 0.5;

  return (
    <div className="app-root">
      {/* Grouping scene and text overlay to shift them together for tactile tension feedback */}
      <div ref={sceneWrapperRef} className="scene-wrapper">
        {/* z-index 10: Character contact shadow */}
        <CharacterContactShadow focusX={focusX} />

        {/* z-index 20: Fullscreen Animation canvas rendering backdrop */}
        <CanvasRenderer />

        {/* z-index 30: Floating tech icons */}
        <FloatingIcons sectionId={activeSectionId} />

        {/* z-index 35: Premium ambient decorations layer */}
        <SectionDecorations sectionId={activeSectionId} />

        {/* z-index 40: Presentation overlay contents layer */}
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

            const theme = sec.theme || (sec.lighting.profile === 'WarmMorning' ? 'light' : 'dark');
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
                {SectionComponent && <SectionComponent theme={theme} content={sec.content} />}
              </SectionOverlay>
            );
          })}
        </div>
      </div>

      {/* 2. Floating Navbar menu */}
      <Navbar />

      {/* Side Scroll-Progress Indicator */}
      <ScrollProgressRail />

      {/* 3. Developer Diagnostics Console (toggled by F2) */}
      <DeveloperConsole />

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
