import React, { useState } from 'react';
import ContentCard from '../components/ContentCard';

export function ContactSection({ theme, content, hasTriggered = () => false }) {
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
    <div className="contact-section-wrapper">
      <h2 
        className={`section-heading fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}
        data-theme={theme}
      >
        {content.heading}
      </h2>

      <div className="contact-grid">
        {/* Contact Info Card */}
        <ContentCard 
          theme={theme}
          className={`contact-info-card fade-element ${hasTriggered('FORM_IN') ? 'visible' : ''}`}
        >
          <h3>{content.name}</h3>
          <p className="contact-roles">{content.roles.join(' • ')}</p>
          
          <div className="contact-details">
            {content.email && (
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <a href={`mailto:${content.email}`} className="detail-value">{content.email}</a>
              </div>
            )}
            {content.phone && (
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <a href={`tel:${content.phone}`} className="detail-value">{content.phone}</a>
              </div>
            )}
            {content.location && (
              <div className="detail-item">
                <span className="detail-label">Location:</span>
                <span className="detail-value">
                  {Array.isArray(content.location) ? content.location.join(", ") : content.location}
                </span>
              </div>
            )}
          </div>

          <div className="contact-social-links">
            {content.github && (
              <a href={content.github} target="_blank" rel="noopener noreferrer" className="social-badge">
                GitHub
              </a>
            )}
            {content.linkedin && (
              <a href={content.linkedin} target="_blank" rel="noopener noreferrer" className="social-badge">
                LinkedIn
              </a>
            )}
            {content.instagram && (
              <a href={content.instagram} target="_blank" rel="noopener noreferrer" className="social-badge">
                Instagram
              </a>
            )}
          </div>
        </ContentCard>

        {/* Message Form */}
        <ContentCard 
          theme={theme}
          as="form"
          onSubmit={handleSubmit} 
          className={`contact-form-panel fade-element ${hasTriggered('FORM_IN') ? 'visible' : ''}`}
        >
          <div className="form-group">
            <label htmlFor="name-input">Name</label>
            <input 
              id="name-input"
              type="text" 
              placeholder="Your Name" 
              value={formState.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isSubmitting || isSuccess}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email-input">Email</label>
            <input 
              id="email-input"
              type="email" 
              placeholder="Your Email" 
              value={formState.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isSubmitting || isSuccess}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message-input">Message</label>
            <textarea 
              id="message-input"
              rows={4}
              placeholder="Write your message..." 
              value={formState.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              disabled={isSubmitting || isSuccess}
              required
            />
          </div>

          {errorMessage && (
            <div className="contact-error-message" style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px', textAlign: 'left' }}>
              ⚠️ {errorMessage}
            </div>
          )}

          <button 
            type="submit" 
            className={`submit-btn ${isSubmitting ? 'loading' : ''} ${isSuccess ? 'success' : ''}`}
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting ? 'Sending...' : isSuccess ? 'Message Sent!' : 'Send Message'}
          </button>
        </ContentCard>
      </div>
    </div>
  );
}

export default ContactSection;
