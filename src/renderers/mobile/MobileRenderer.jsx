import React, { Suspense } from 'react';
import MobileExperience from './experience/MobileExperience';
import { useUserPreferences } from '../../shared/theme/UserPreferences';

// Import mobile styles in order
import './styles/tokens.css';
import '../../shared/design-system/glass.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/animations.css';
import './styles/utilities.css';

// Lazy load mobile sections (eager Hero)
import HeroSection from './sections/HeroSection';

const AboutSection        = React.lazy(() => import('./sections/AboutSection'));
const SkillsSection       = React.lazy(() => import('./sections/SkillsSection'));
const TechStackSection    = React.lazy(() => import('./sections/TechStackSection'));
const ProjectsSection     = React.lazy(() => import('./sections/ProjectsSection'));
const ExperienceSection   = React.lazy(() => import('./sections/ExperienceSection'));
const EducationSection    = React.lazy(() => import('./sections/EducationSection'));
const AchievementsSection = React.lazy(() => import('./sections/AchievementsSection'));
const ContactSection      = React.lazy(() => import('./sections/ContactSection'));

function SectionFallback() {
  return <div className="mobile-section-fallback" style={{ height: '80vh' }} />;
}

export function MobileRenderer() {
  const { resolvedTheme } = useUserPreferences();

  return (
    <MobileExperience>
      <div className="mobile-app-container">
        {/* Render sections in order */}
        <HeroSection theme={resolvedTheme} />
        
        <Suspense fallback={<SectionFallback />}>
          <AboutSection theme={resolvedTheme} />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <SkillsSection theme={resolvedTheme} />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <TechStackSection theme={resolvedTheme} />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <ProjectsSection theme={resolvedTheme} />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <ExperienceSection theme={resolvedTheme} />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <EducationSection theme={resolvedTheme} />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <AchievementsSection theme={resolvedTheme} />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <ContactSection theme={resolvedTheme} />
        </Suspense>
      </div>
    </MobileExperience>
  );
}

export default MobileRenderer;
