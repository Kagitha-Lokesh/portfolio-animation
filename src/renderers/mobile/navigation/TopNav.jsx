import React, { useState } from 'react';
import { useUserPreferences } from '../../../shared/theme/UserPreferences';
import { PortfolioRepository } from '../../../shared/content/PortfolioRepository';
import './TopNav.css';

export function TopNav({ activeSection = 'home', onNavClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, resolvedTheme, setTheme } = useUserPreferences();
  const navigation = PortfolioRepository.getNavigation();

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (id) => {
    setIsOpen(false);
    if (onNavClick) {
      onNavClick(id);
    }
  };

  const handleToggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <header className={`mobile-top-nav ${resolvedTheme}`}>
        <div className="nav-logo">
          <span className="logo-title">K. Lokesh</span>
        </div>
        <button 
          className={`hamburger-btn ${isOpen ? 'menu-open' : ''}`} 
          onClick={handleToggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="bar bar-top"></span>
          <span className="bar bar-mid"></span>
          <span className="bar bar-bot"></span>
        </button>
      </header>

      {/* Frosted glass fullscreen menu overlay */}
      {isOpen && (
        <div className="mobile-menu-overlay" onClick={handleToggleMenu}>
          <div className="menu-inner" onClick={(e) => e.stopPropagation()}>
            <nav className="menu-links-nav">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  className={`menu-link-btn ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleLinkClick(item.id)}
                >
                  <span className="menu-link-bullet">●</span>
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="menu-footer">
              <button className="theme-switcher-btn" onClick={handleToggleTheme}>
                Theme: <span className="active-theme-label">{resolvedTheme}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TopNav;
