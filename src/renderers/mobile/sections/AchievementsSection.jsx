import React from 'react';
import PortfolioRepository from '../../../shared/content/PortfolioRepository';
import SectionTitle from '../../../shared/ui/SectionTitle';
import GlassCard from '../../../shared/ui/GlassCard';
import AnimatedCounter from '../components/AnimatedCounter';
import SectionReveal from '../components/SectionReveal';
import './AchievementsSection.css';

export function AchievementsSection({ theme = 'dark' }) {
  const content = PortfolioRepository.getAchievementsData();
  const achievements = content.items || [];

  return (
    <section id="achievements" className="mobile-section">
      <SectionReveal>
        <SectionTitle 
          title={content.heading} 
          subtitle="Milestones, completions, and notable highlights." 
        />
        
        <div className="achievements-section-content">
          {/* Animated counter stats */}
          <div className="achievements-stats-grid">
            <GlassCard theme={theme} className="achievements-stat-card">
              <span className="achievements-stat-val">
                <AnimatedCounter targetValue={4} suffix="+" />
              </span>
              <span className="achievements-stat-label">Full Stack Apps</span>
            </GlassCard>
            <GlassCard theme={theme} className="achievements-stat-card">
              <span className="achievements-stat-val">
                <AnimatedCounter targetValue={100} suffix="%" />
              </span>
              <span className="achievements-stat-label">Responsive UI</span>
            </GlassCard>
          </div>

          {/* Core list card */}
          <GlassCard theme={theme} className="achievements-list-card">
            <ul className="achievements-details-list">
              {achievements.map((ach, idx) => (
                <li key={idx} className="achievement-detail-item">
                  <span className="achievement-bullet-gold">🏆</span>
                  <p className="achievement-detail-text">{ach}</p>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </SectionReveal>
    </section>
  );
}

export default AchievementsSection;
