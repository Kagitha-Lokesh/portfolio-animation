import React, { useEffect, useState } from "react";
import { EventBus } from "../../core/EventBus";
import { PORTFOLIO_CONFIG, getSectionByOrder } from "../../config/portfolio.config";

/**
 * ScrollProgressRail Component
 * Displays a sleek vertical progress indicator on the right edge of the viewport,
 * showing the current scroll progress percentage and dot navigation for all 9 sections.
 */
export function ScrollProgressRail() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [activeSectionOrder, setActiveSectionOrder] = useState(1);
  const [railTheme, setRailTheme] = useState("light");
  const [tensionPercent, setTensionPercent] = useState(0);

  useEffect(() => {
    const unsubFrame = EventBus.on("FRAME_CHANGED", (frame) => setCurrentFrame(frame));
    
    const unsubSection = EventBus.on("SECTION_ACTIVE", (sectionId) => {
      const section = PORTFOLIO_CONFIG.sections[sectionId];
      if (section) {
        setActiveSectionOrder(section.order);
        const theme = section.lighting.profile === "WarmMorning" ? "light" : "dark";
        setRailTheme(theme);
      }
    });

    const unsubTension = EventBus.on("SCROLL_TENSION", ({ percent }) => {
      setTensionPercent(percent);
    });

    const unsubRelease = EventBus.on("SCROLL_TENSION_RELEASE", () => {
      setTensionPercent(0);
    });

    const unsubTransitionStart = EventBus.on("TRANSITION_START", () => {
      setTensionPercent(0);
    });

    return () => {
      unsubFrame();
      unsubSection();
      unsubTension();
      unsubRelease();
      unsubTransitionStart();
    };
  }, []);

  const percent = Math.round((currentFrame / PORTFOLIO_CONFIG.totalFrames) * 100);
  const sections = Array.from({ length: 9 }, (_, i) => getSectionByOrder(i + 1));

  const handleDotClick = (sectionId) => {
    EventBus.emit("NAVIGATION_CLICK", sectionId); // triggers existing direct-transition navigation
  };

  return (
    <div className={`scroll-progress-rail ${railTheme}`} aria-label="Section progress">
      <span className="scroll-progress-percent">{percent}%</span>
      <div className="scroll-progress-track">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`scroll-progress-dot ${section.order === activeSectionOrder ? "active" : ""} ${
              section.order < activeSectionOrder ? "passed" : ""
            }`}
            onClick={() => handleDotClick(section.id)}
            title={section.title}
            aria-label={`Go to ${section.title}`}
            style={section.order === activeSectionOrder ? { "--tension-percent": `${tensionPercent * 100}%` } : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export default ScrollProgressRail;
