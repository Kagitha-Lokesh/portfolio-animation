import React, { useEffect, useState, useRef } from 'react';
import { EventBus } from '../../core/EventBus';
import { Runtime } from '../../core/Runtime';
import { PORTFOLIO_CONFIG, getSectionById } from '../../config/portfolio.config';
import { gsap } from 'gsap';

const NAVBAR_STYLES = {
  default: {
    height: 88,
    translateY: 0,
    blur: 20,
    backgroundOpacity: 0.45,
    padding: '20px 32px',
  },
  compact: {
    height: 60,
    translateY: -6,
    blur: 28,
    backgroundOpacity: 0.62,
    padding: '10px 24px',
  },
};

/**
 * Navbar Component
 * Sleek, floating glassmorphic navbar with smooth active-link highlight overlays.
 */
export function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [navbarMode, setNavbarMode] = useState('default');
  const [retracted, setRetracted] = useState(false);
  const [theme, setTheme] = useState('light');
  const navbarRef = useRef(null);

  // Initial setup on mount
  useEffect(() => {
    const initialSec = getSectionById('home');
    if (initialSec) {
      const mode = initialSec.navbar?.mode ?? 'default';
      setNavbarMode(mode);
      const style = NAVBAR_STYLES[mode];
      gsap.set(navbarRef.current, {
        height: style.height,
        y: style.translateY,
        padding: style.padding,
        opacity: 1,
        backdropFilter: `blur(${style.blur}px)`,
        backgroundColor: `rgba(var(--navbar-bg-rgb), ${style.backgroundOpacity})`
      });
    }
  }, []);

  // Listen to Runtime events
  useEffect(() => {
    const subActiveEnter = EventBus.on('SECTION_ENTER', (secId) => {
      setActiveSection(secId);
    });

    const subActive = EventBus.on('SECTION_ACTIVE', (secId) => {
      const section = getSectionById(secId);
      const mode = section?.navbar?.mode ?? 'default';
      setNavbarMode(mode);
    });

    const subTheme = EventBus.on('THEME_CHANGED', (newTheme) => {
      setTheme(newTheme);
    });

    return () => {
      subActiveEnter();
      subActive();
      subTheme();
    };
  }, []);

  // Animate between navbar modes & retraction states
  useEffect(() => {
    const style = NAVBAR_STYLES[navbarMode];
    const section = getSectionById(activeSection);
    const duration = section?.transition?.duration ? section.transition.duration / 1000 : 0.6;
    const ease = section?.transition?.easing || 'power2.out';

    if (retracted && navbarMode === 'compact') {
      gsap.to(navbarRef.current, {
        height: 14,
        y: -6,
        padding: '0px',
        opacity: 0.35,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    } else {
      gsap.to(navbarRef.current, {
        height: style.height,
        y: style.translateY,
        padding: style.padding,
        opacity: 1,
        backdropFilter: `blur(${style.blur}px)`,
        backgroundColor: `rgba(var(--navbar-bg-rgb), ${style.backgroundOpacity})`,
        duration: duration,
        ease: ease,
        overwrite: 'auto'
      });
    }
  }, [navbarMode, activeSection, retracted]);

  // Handle auto-retract on idle (compact mode only)
  useEffect(() => {
    if (navbarMode !== 'compact') {
      setRetracted(false);
      return;
    }

    const RETRACT_DELAY_MS = 2500;
    const HOVER_REVEAL_ZONE_PX = 80;
    let idleTimer;

    const scheduleRetract = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setRetracted(true);
      }, RETRACT_DELAY_MS);
    };

    scheduleRetract();

    const handlePointerMove = (e) => {
      if (e.clientY <= HOVER_REVEAL_ZONE_PX) {
        setRetracted(false);
        scheduleRetract();
      }
    };

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      if (touch && touch.clientY <= HOVER_REVEAL_ZONE_PX) {
        setRetracted(false);
        scheduleRetract();
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('touchstart', handleTouchStart);

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [navbarMode]);

  const handleNavClick = (sectionId) => {
    if (Runtime.isTransitionLocked()) return;
    
    Runtime.commands.push({
      type: 'NAVIGATE',
      sectionId
    });
  };

  const sections = Object.values(PORTFOLIO_CONFIG.sections);

  return (
    <nav 
      ref={navbarRef} 
      className={`portfolio-navbar ${theme} ${retracted ? 'retracted' : ''}`} 
      aria-label="Main Navigation"
    >
      <div className="navbar-logo">
        <span className="logo-text">K. Lokesh</span>
      </div>
      <ul className="navbar-links">
        {sections.map((sec) => (
          <li key={sec.id} className="nav-item">
            <button
              onClick={() => handleNavClick(sec.id)}
              className={`nav-button ${activeSection === sec.id ? 'active' : ''}`}
              aria-current={activeSection === sec.id ? 'page' : undefined}
            >
              {sec.title}
              <span className="indicator-dot" />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
