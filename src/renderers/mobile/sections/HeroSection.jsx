import React from 'react';
import PortfolioRepository from '../../../shared/content/PortfolioRepository';
import GradientOrb from '../components/GradientOrb';
import RoleFade from '../components/RoleFade';
import Button from '../../../shared/ui/Button';
import Heading from '../../../shared/ui/Heading';
import GlassCard from '../../../shared/ui/GlassCard';
import './HeroSection.css';

export function HeroSection({ theme = 'dark' }) {
  const meta = PortfolioRepository.getSiteMeta();
  const heroData = PortfolioRepository.getHeroData();

  const handleExplore = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const roles = [
    "Java Full Stack Developer",
    "React Developer",
    "AI & ML Enthusiast"
  ];

  return (
    <section id="home" className="mobile-section mobile-section-hero">
      {/* Dynamic Background Gradient Orbs */}
      <GradientOrb color="mint" size="260px" top="25%" left="30%" delay="0s" />
      <GradientOrb color="teal" size="280px" top="65%" left="80%" delay="3s" />

      <div className="hero-section-inner">
        <div className="status-badge-container">
          <span className="status-badge">
            <span className="status-dot" />
            Available For Work
          </span>
        </div>

        <div className="hero-greeting-container">
          <p className="hero-greet-subtitle">Hello, I'm</p>
          <Heading level={1} className="hero-main-title">
            {meta.displayName}
          </Heading>
        </div>

        {/* Custom fade transition role slider */}
        <div className="hero-role-fade-wrapper">
          <RoleFade roles={roles} intervalMs={2800} />
        </div>

        <p className="hero-brand-statement">
          {meta.brandStatement}
        </p>

        {/* Apple Stat Summary Cards */}
        <GlassCard theme={theme} className="hero-quick-stats">
          <div className="stat-item">
            <span className="stat-val">3+</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-val">1</span>
            <span className="stat-label">Internship</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-val">Final Yr</span>
            <span className="stat-label">B.Tech</span>
          </div>
        </GlassCard>

        {/* Dual Actions CTAs */}
        <div className="hero-actions-container">
          <Button variant="primary" className="hero-btn" onClick={handleExplore}>
            Explore Journey
          </Button>
          <Button variant="secondary" className="hero-btn" onClick={handleContact}>
            Get In Touch
          </Button>
        </div>

        {/* Bottom indicator */}
        <div className="hero-scroll-indicator" onClick={handleExplore}>
          <span className="indicator-arrow">↓</span>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
