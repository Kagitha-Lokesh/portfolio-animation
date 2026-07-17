import React from 'react';
import PortfolioRepository from '../../../shared/content/PortfolioRepository';
import SectionTitle from '../../../shared/ui/SectionTitle';
import GlassCard from '../../../shared/ui/GlassCard';
import Button from '../../../shared/ui/Button';
import Chip from '../../../shared/ui/Chip';
import SectionReveal from '../components/SectionReveal';
import './AboutSection.css';

export function AboutSection({ theme = 'dark' }) {
  const content = PortfolioRepository.getAboutData();
  const contact = PortfolioRepository.getContact();

  const handleDownloadResume = () => {
    if (contact.resumeUrl) {
      window.open(contact.resumeUrl, '_blank');
    } else {
      alert("Resume will be uploaded later.");
    }
  };

  return (
    <section id="about" className="mobile-section">
      <SectionReveal>
        <SectionTitle title={content.heading} subtitle="A brief snapshot of who I am, my drive, and my path." />
        
        <div className="about-section-content">
          <GlassCard theme={theme} className="about-story-card">
            <div className="about-story-paragraphs">
              {content.paragraphs?.map((p, idx) => (
                <p key={idx} className="about-story-p">{p}</p>
              ))}
            </div>
            
            <div className="about-info-grid">
              <div className="info-cell">
                <span className="info-cell-label">Location</span>
                <span className="info-cell-val">{contact.location}</span>
              </div>
              <div className="info-cell">
                <span className="info-cell-label">Nationality</span>
                <span className="info-cell-val">{content.personalInfo?.nationality}</span>
              </div>
            </div>
          </GlassCard>

          {/* Hobbies / Interests Badge List */}
          {content.interests && (
            <div className="about-interests-container">
              <h3 className="interests-sub-title">Areas of Interest</h3>
              <div className="about-interests-grid">
                {content.interests.map((interest, idx) => (
                  <Chip key={idx} className="interest-item-chip">{interest}</Chip>
                ))}
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="about-actions-area">
            <Button variant="secondary" className="resume-download-btn" onClick={handleDownloadResume}>
              Download Resume ↓
            </Button>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}

export default AboutSection;
