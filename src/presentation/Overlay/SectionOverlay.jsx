import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { EventBus } from '../../core/EventBus';
import { PORTFOLIO_CONFIG } from '../../config/portfolio.config';

/**
 * SectionOverlay Component
 * Wraps individual sections, handles layout safe-zones (alignments),
 * and coordinates element fade-ins triggered by semantic timeline markers.
 */
export function SectionOverlay({ sectionId, layout, theme, align, children }) {
  const [isActive, setIsActive] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [triggeredEvents, setTriggeredEvents] = useState(new Set());
  const containerRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    // Keep active state on loop entry (without clearing captured timeline events)
    const subActive = EventBus.on('SECTION_ACTIVE', (secId) => {
      if (secId === sectionId) {
        setIsActive(true);
        setIsFadingOut(false);
        
        // Safety net: ensure all timeline events for this section are marked as triggered
        // when we enter the section loop, in case backward navigation or quick scrolling bypassed them.
        const section = PORTFOLIO_CONFIG.sections[sectionId];
        if (section && section.timeline) {
          setTriggeredEvents(prev => {
            const next = new Set(prev);
            section.timeline.forEach(t => {
              next.add(t.event);
              // Map generic CONTENT_IN to section-specific component triggers
              if (t.event === 'CONTENT_IN') {
                if (sectionId === 'skills') next.add('GRID_IN');
                else if (sectionId === 'techstack') next.add('STACK_IN');
                else if (sectionId === 'projects') next.add('CAROUSEL_IN');
                else if (sectionId === 'experience') next.add('CARDS_IN');
                else if (sectionId === 'education') {
                  next.add('TITLE_IN');
                  next.add('TIMELINE_IN');
                }
                else if (sectionId === 'achievements') next.add('LIST_IN');
                else if (sectionId === 'contact') next.add('FORM_IN');
              }
            });
            return next;
          });
        }
      }
    });

    // Handle entering and exiting transitions
    const subTransition = EventBus.on('TRANSITION_START', (data) => {
      if (data.to === sectionId) {
        setIsActive(true);
        setIsFadingOut(false);
        setTriggeredEvents(new Set()); // Reset trigger states for new entry
      }
      if (data.from === sectionId) {
        setIsFadingOut(true);
        // Turn off visibility after animation completes to fade them out smoothly
        setTimeout(() => {
          setIsActive(false);
          setTriggeredEvents(new Set());
        }, 300);
      }
    });

    // Listen to all timeline events
    const timelineEvents = [
      'TITLE_IN', 'SUBTITLE_IN', 'BUTTONS_IN', 
      'CONTENT_IN', 'GRID_IN', 'STACK_IN', 
      'CAROUSEL_IN', 'CARDS_IN', 'TIMELINE_IN', 
      'LIST_IN', 'FORM_IN'
    ];

    const unsubscribers = timelineEvents.map(evtName => {
      return EventBus.on(evtName, (secId) => {
        if (secId === sectionId) {
          setTriggeredEvents(prev => {
            const next = new Set(prev);
            next.add(evtName);

            // Map generic CONTENT_IN events to section-specific component triggers
            if (evtName === 'CONTENT_IN') {
              if (sectionId === 'skills') next.add('GRID_IN');
              else if (sectionId === 'techstack') next.add('STACK_IN');
              else if (sectionId === 'projects') next.add('CAROUSEL_IN');
              else if (sectionId === 'experience') next.add('CARDS_IN');
              else if (sectionId === 'education') {
                next.add('TITLE_IN');
                next.add('TIMELINE_IN');
              }
              else if (sectionId === 'achievements') next.add('LIST_IN');
              else if (sectionId === 'contact') next.add('FORM_IN');
            }

            return next;
          });
        }
      });
    });

    return () => {
      subActive();
      subTransition();
      unsubscribers.forEach(unsub => unsub());
    };
  }, [sectionId]);

  // Card animations are now handled by CardAnimator (Cinematic Transition System 2.0).
  // animatedRef kept for legacy compat but no longer drives card GSAP directly.
  useEffect(() => {
    if (!isActive) {
      animatedRef.current = false;
    }
  }, [isActive]);

  if (!isActive) return null;

  const alignClass  = `align-${align}`;
  const themeClass  = `theme-${theme}`;
  const layoutClass = `layout-${layout}`;
  // Keep legacy fade class for backward compat; cinematic system overrides via data-cinematic-state
  const fadeClass   = isFadingOut ? 'fade-leaving' : 'fade-entering';

  // Make visibility triggers helper available to children via cloning
  const hasTriggered = (evtName) => triggeredEvents.has(evtName);

  return (
    <div
      ref={containerRef}
      className={`section-overlay-container ${themeClass} ${alignClass} ${layoutClass} ${fadeClass}`}
      data-section={sectionId}
      data-layer="glass"
      data-cinematic-state={isFadingOut ? 'exiting' : 'active'}
    >
      <div className="section-overlay-content">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { hasTriggered });
          }
          return child;
        })}
      </div>
    </div>
  );
}

export default SectionOverlay;
