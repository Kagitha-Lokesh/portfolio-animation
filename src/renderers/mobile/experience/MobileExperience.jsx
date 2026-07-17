import React, { useState } from 'react';
import useSectionInView from '../hooks/useSectionInView';
import useScrollProgress from '../hooks/useScrollProgress';
import TopNav from '../navigation/TopNav';
import FloatingDock from '../navigation/FloatingDock';

export const SECTION_ORDER = [
  'home',
  'about',
  'skills',
  'techstack',
  'projects',
  'experience',
  'education',
  'achievements',
  'contact'
];

export const FEATURE_FLAGS = {
  showFloatingDock: true,
  showThemeToggle: true
};

export function MobileExperience({ children }) {
  const activeSection = useSectionInView(SECTION_ORDER);
  const { scrollY } = useScrollProgress();

  const handleNavClick = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Show dock after scrolling past initial Hero viewport height
  const showDock = FEATURE_FLAGS.showFloatingDock && scrollY > (window.innerHeight * 0.4);

  return (
    <>
      <TopNav activeSection={activeSection} onNavClick={handleNavClick} />
      
      {children}
      
      <FloatingDock 
        activeSection={activeSection} 
        onNavClick={handleNavClick} 
        visible={showDock}
      />
    </>
  );
}

export default MobileExperience;
