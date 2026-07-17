import React, { useRef, useEffect } from 'react';
import ContentCard from '../components/ContentCard';

export function AboutSection({ theme, content, hasTriggered = () => false }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const handleWheel = (e) => {
      if (cardEl.scrollHeight <= cardEl.clientHeight) return;

      const atTop = cardEl.scrollTop === 0;
      const atBottom = Math.abs(cardEl.scrollHeight - cardEl.clientHeight - cardEl.scrollTop) < 1;
      const scrollingUp = e.deltaY < 0;
      const scrollingDown = e.deltaY > 0;

      const isWithinBounds = (scrollingUp && !atTop) || (scrollingDown && !atBottom);

      if (isWithinBounds) {
        e.stopPropagation();
      }
    };

    let startY = 0;
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length !== 1) return;
      if (cardEl.scrollHeight <= cardEl.clientHeight) return;

      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY; // positive = swipe up (scroll down)

      const atTop = cardEl.scrollTop === 0;
      const atBottom = Math.abs(cardEl.scrollHeight - cardEl.clientHeight - cardEl.scrollTop) < 1;
      const scrollingUp = deltaY < 0;
      const scrollingDown = deltaY > 0;

      const isWithinBounds = (scrollingUp && !atTop) || (scrollingDown && !atBottom);

      if (isWithinBounds) {
        e.stopPropagation();
        startY = currentY;
      }
    };

    cardEl.addEventListener('wheel', handleWheel, { passive: false });
    cardEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    cardEl.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      cardEl.removeEventListener('wheel', handleWheel);
      cardEl.removeEventListener('touchstart', handleTouchStart);
      cardEl.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const visibleInterests = content.interests.slice(0, 8);

  return (
    <div className="about-section-wrapper">
      <h2 
        className={`section-heading fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}
        data-theme={theme}
      >
        {content.heading}
      </h2>

      <ContentCard 
        ref={cardRef}
        theme={theme}
        className={`about-card fade-element ${hasTriggered('CONTENT_IN') ? 'visible' : ''}`}
      >
        <div className="about-paragraphs">
          {content.paragraphs.map((p, idx) => (
            <p key={idx} className="about-p">{p}</p>
          ))}
        </div>

        <div className="about-interests">
          <h3 className="interests-heading">Interests</h3>
          <div className="pills-grid">
            {visibleInterests.map((interest, idx) => (
              <span key={idx} className="pill-item">{interest}</span>
            ))}
          </div>
        </div>
      </ContentCard>
    </div>
  );
}

export default AboutSection;
