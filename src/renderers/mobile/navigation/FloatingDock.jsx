import React from 'react';
import { AnimatePresence, SlideUp } from '../../../shared/motion/MotionProvider';
import './FloatingDock.css';

export function FloatingDock({ activeSection = 'home', onNavClick, visible = false }) {
  const dockItems = [
    { id: 'home', label: 'Home', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )},
    { id: 'about', label: 'About', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )},
    { id: 'skills', label: 'Skills', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    )},
    { id: 'projects', label: 'Projects', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    )},
    { id: 'contact', label: 'Contact', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    )}
  ];

  return (
    <AnimatePresence>
      {visible && (
        <SlideUp className="mobile-floating-dock-wrapper">
          <div className="mobile-floating-dock glass">
            {dockItems.map((item) => (
              <button
                key={item.id}
                className={`dock-btn ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => onNavClick && onNavClick(item.id)}
                aria-label={`Navigate to ${item.label}`}
              >
                <div className="dock-btn-icon">
                  {item.icon}
                </div>
                <span className="dock-btn-label">{item.label}</span>
              </button>
            ))}
          </div>
        </SlideUp>
      )}
    </AnimatePresence>
  );
}

export default FloatingDock;
