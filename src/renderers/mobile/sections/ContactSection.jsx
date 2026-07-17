import React, { useState } from 'react';
import PortfolioRepository from '../../../shared/content/PortfolioRepository';
import SectionTitle from '../../../shared/ui/SectionTitle';
import GlassCard from '../../../shared/ui/GlassCard';
import Button from '../../../shared/ui/Button';
import Heading from '../../../shared/ui/Heading';
import GradientOrb from '../components/GradientOrb';
import SectionReveal from '../components/SectionReveal';
import './ContactSection.css';

export function ContactSection({ theme = 'dark' }) {
  const content = PortfolioRepository.getContact();
  const meta = PortfolioRepository.getSiteMeta();

  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setIsSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      } else {
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('Could not connect to the server. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="mobile-section">
      <SectionReveal>
        <SectionTitle 
          title="Contact" 
          subtitle="Reach out for collaborations, questions, or opportunities." 
        />
        
        <div className="mobile-contact-content">
          <GradientOrb color="teal" size="240px" top="40%" left="20%" delay="1s" />
          
          {/* Card Info details */}
          <GlassCard theme={theme} className="mobile-contact-info-card">
            <Heading level={3} className="contact-name">
              {meta.fullName}
            </Heading>
            <p className="contact-roles-label">
              {meta.displayName} • Full Stack Software Developer
            </p>
            
            <div className="contact-details-lines">
              {content.email && (
                <div className="contact-detail-line">
                  <span className="contact-label">Email:</span>
                  <a href={`mailto:${content.email}`} className="contact-value-link">
                    {content.email}
                  </a>
                </div>
              )}
              {content.phone && (
                <div className="contact-detail-line">
                  <span className="contact-label">Phone:</span>
                  <a href={`tel:${content.phone}`} className="contact-value-link">
                    {content.phone}
                  </a>
                </div>
              )}
              {content.location && (
                <div className="contact-detail-line">
                  <span className="contact-label">Location:</span>
                  <span className="contact-value-text">
                    {Array.isArray(content.location) ? content.location.join(", ") : content.location}
                  </span>
                </div>
              )}
            </div>

            <div className="contact-social-badge-container">
              {content.github && (
                <a href={content.github} target="_blank" rel="noopener noreferrer" className="mobile-social-badge">
                  GitHub
                </a>
              )}
              {content.linkedin && (
                <a href={content.linkedin} target="_blank" rel="noopener noreferrer" className="mobile-social-badge">
                  LinkedIn
                </a>
              )}
              {content.instagram && (
                <a href={content.instagram} target="_blank" rel="noopener noreferrer" className="mobile-social-badge">
                  Instagram
                </a>
              )}
            </div>
          </GlassCard>

          {/* Message form card */}
          <GlassCard 
            theme={theme}
            as="form"
            onSubmit={handleSubmit}
            className="mobile-contact-form-card"
          >
            {isSuccess && (
              <div className="contact-status-banner success" style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                color: '#34d399',
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>✓</span>
                <span>Your message has been sent successfully! Thank you.</span>
              </div>
            )}

            {errorMessage && (
              <div className="contact-status-banner error" style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                color: '#f87171',
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="m-form-group">
              <label htmlFor="m-name-input">Name</label>
              <input 
                id="m-name-input"
                type="text" 
                placeholder="Your Name" 
                value={formState.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={isSubmitting || isSuccess}
                required
              />
            </div>

            <div className="m-form-group">
              <label htmlFor="m-email-input">Email</label>
              <input 
                id="m-email-input"
                type="email" 
                placeholder="Your Email" 
                value={formState.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isSubmitting || isSuccess}
                required
              />
            </div>

            <div className="m-form-group">
              <label htmlFor="m-message-input">Message</label>
              <textarea 
                id="m-message-input"
                rows={4}
                placeholder="Write your message..." 
                value={formState.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                disabled={isSubmitting || isSuccess}
                required
              />
            </div>

            <Button 
              type="submit" 
              variant="primary"
              className={`m-submit-btn ${isSuccess ? 'success' : ''}`}
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? 'Sending...' : isSuccess ? 'Message Sent!' : 'Send Message'}
            </Button>
          </GlassCard>
        </div>
      </SectionReveal>
    </section>
  );
}

export default ContactSection;
