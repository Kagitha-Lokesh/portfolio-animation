import React, { useState, useRef, useEffect } from 'react';
import ContentCard from '../components/ContentCard';

export function SkillsSection({ theme, content, hasTriggered = () => false }) {
  const categories = content.categories || [];
  const progLang = categories.find(c => c.label.toLowerCase().includes("programming")) || { label: "Programming Languages", items: [] };
  const frontend = categories.find(c => c.label.toLowerCase().includes("frontend")) || { label: "Frontend", items: [] };
  const tools = categories.find(c => c.label.toLowerCase().includes("tools")) || { label: "Tools", items: [] };
  const backend = categories.find(c => c.label.toLowerCase().includes("backend")) || { label: "Backend", items: [] };
  const database = categories.find(c => c.label.toLowerCase().includes("database")) || { label: "Database", items: [] };
  const concepts = categories.find(c => c.label.toLowerCase().includes("concepts")) || { label: "Concepts", items: [] };

  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const scrollOffsetRef = useRef(0);
  const [leftHasOverflow, setLeftHasOverflow] = useState(false);
  const [rightHasOverflow, setRightHasOverflow] = useState(false);

  const isVisible = hasTriggered('GRID_IN');

  useEffect(() => {
    const leftEl = leftColRef.current;
    const rightEl = rightColRef.current;
    if (!leftEl || !rightEl) return;

    // ── Reset scroll position to top whenever the section becomes visible ──
    // This ensures we always start at the top content, never mid-scroll.
    if (isVisible) {
      scrollOffsetRef.current = 0;
      leftEl.scrollTop = 0;
      rightEl.scrollTop = 0;
    }

    // Check overflow state
    const checkOverflow = () => {
      setLeftHasOverflow(leftEl.scrollHeight > leftEl.clientHeight);
      setRightHasOverflow(rightEl.scrollHeight > rightEl.clientHeight);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    // The taller column determines how far there is to scroll
    const getMaxScroll = () => Math.max(
      leftEl.scrollHeight - leftEl.clientHeight,
      rightEl.scrollHeight - rightEl.clientHeight
    );

    function handleWheel(e) {
      const maxScroll = getMaxScroll();
      if (maxScroll <= 0) return; // nothing overflows, let wheel event bubble up

      const atTop = scrollOffsetRef.current <= 0;
      const atBottom = scrollOffsetRef.current >= maxScroll;
      const scrollingUp = e.deltaY < 0;
      const scrollingDown = e.deltaY > 0;

      const withinBounds = (scrollingUp && !atTop) || (scrollingDown && !atBottom);

      if (withinBounds) {
        e.stopPropagation(); // locked inside column list scroll
        e.preventDefault();
        const next = Math.min(Math.max(scrollOffsetRef.current + e.deltaY, 0), maxScroll);
        scrollOffsetRef.current = next;
        leftEl.scrollTop = next;
        rightEl.scrollTop = next;
      }
    }

    // Touch event swipe synchronization
    let startY = 0;
    function handleTouchStart(e) {
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY;
      }
    }

    function handleTouchMove(e) {
      if (e.touches.length !== 1) return;
      const maxScroll = getMaxScroll();
      if (maxScroll <= 0) return;

      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY; // positive = swipe up (scroll down)

      const atTop = scrollOffsetRef.current <= 0;
      const atBottom = scrollOffsetRef.current >= maxScroll;
      const scrollingUp = deltaY < 0;
      const scrollingDown = deltaY > 0;

      const withinBounds = (scrollingUp && !atTop) || (scrollingDown && !atBottom);

      if (withinBounds) {
        e.stopPropagation();
        e.preventDefault();
        const next = Math.min(Math.max(scrollOffsetRef.current + deltaY, 0), maxScroll);
        scrollOffsetRef.current = next;
        leftEl.scrollTop = next;
        rightEl.scrollTop = next;
        startY = currentY; // anchor swipe position
      }
    }

    const wrapper = document.querySelector(".skills-cards-area");
    wrapper?.addEventListener("wheel", handleWheel, { passive: false });
    wrapper?.addEventListener("touchstart", handleTouchStart, { passive: true });
    wrapper?.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('resize', checkOverflow);
      wrapper?.removeEventListener("wheel", handleWheel);
      wrapper?.removeEventListener("touchstart", handleTouchStart);
      wrapper?.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isVisible]);

  const renderCategory = (cat, delayClass) => {
    if (!cat) return null;
    const itemsToRender = cat.items;
    
    return (
      <ContentCard 
        theme={theme}
        className={`skill-category-card ${delayClass} ${isVisible ? 'animate-in' : ''}`}
      >
        <h3 className="category-label">
          <span className="bullet-yellow">●</span> {cat.label}
        </h3>
        <ul className="skills-list">
          {itemsToRender.map((item, itemIdx) => (
            <li key={itemIdx} className="skills-item">
              <span className="dot-indicator" />
              {item}
            </li>
          ))}
        </ul>
      </ContentCard>
    );
  };

  return (
    <div className="skills-section-wrapper">
      <h2 
        className={`section-heading skills-heading fade-element ${hasTriggered('TITLE_IN') ? 'visible' : ''}`}
        data-theme={theme}
      >
        {content.heading}
      </h2>

      <div className="skills-cards-area">
        {/* Left Column */}
        <div 
          ref={leftColRef}
          className={`skills-column left slide-left ${isVisible ? 'animate-in' : ''} ${leftHasOverflow ? 'has-overflow' : ''}`}
        >
          <div className="left-panel">
            {renderCategory(progLang, 'delay-1')}
            {renderCategory(frontend, 'delay-2')}
            {renderCategory(tools, 'delay-3')}
          </div>
        </div>

        {/* Right Column */}
        <div 
          ref={rightColRef}
          className={`skills-column right slide-right ${isVisible ? 'animate-in' : ''} ${rightHasOverflow ? 'has-overflow' : ''}`}
        >
          <div className="right-panel">
            {renderCategory(backend, 'delay-1')}
            {renderCategory(database, 'delay-2')}
            {renderCategory(concepts, 'delay-3')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillsSection;
