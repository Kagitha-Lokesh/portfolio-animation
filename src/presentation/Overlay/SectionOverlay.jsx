import React, { useEffect, useState } from 'react';
import { EventBus } from '../../core/EventBus';

/**
 * SectionOverlay Component
 * Wraps individual sections, handles layout safe-zones (alignments),
 * and coordinates element fade-ins triggered by semantic timeline markers.
 */
export function SectionOverlay({ sectionId, layout, theme, align, children }) {
  const [isActive, setIsActive] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [triggeredEvents, setTriggeredEvents] = useState(new Set());

  useEffect(() => {
    // Keep active state on loop entry (without clearing captured timeline events)
    const subEnter = EventBus.on('SECTION_ENTER', (secId) => {
      if (secId === sectionId) {
        setIsActive(true);
        setIsFadingOut(false);
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
      subEnter();
      subTransition();
      unsubscribers.forEach(unsub => unsub());
    };
  }, [sectionId]);

  if (!isActive) return null;

  const alignClass = `align-${align}`;
  const themeClass = `theme-${theme}`;
  const layoutClass = `layout-${layout}`;
  const fadeClass = isFadingOut ? 'fade-leaving' : 'fade-entering';

  // Make visibility triggers helper available to children via cloning or standard context
  const hasTriggered = (evtName) => triggeredEvents.has(evtName);

  return (
    <div className={`section-overlay-container ${themeClass} ${alignClass} ${layoutClass} ${fadeClass}`}>
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
