import React, { useEffect, useRef } from 'react';
import { EventBus } from '../../core/EventBus';

import HomeDecorations          from './presets/HomeDecorations';
import AboutDecorations         from './presets/AboutDecorations';
import SkillsDecorations        from './presets/SkillsDecorations';
import TechConstellationLayer   from './presets/TechConstellationLayer';
import ProjectsDecorations      from './presets/ProjectsDecorations';
import ExperienceDecorations    from './presets/ExperienceDecorations';
import EducationTimeline        from './presets/EducationTimeline';
import AchievementsDecorations  from './presets/AchievementsDecorations';
import ContactDecorations       from './presets/ContactDecorations';

/**
 * SectionDecorations — Persistent DOM Architecture
 *
 * ALL 9 decoration scenes are ALWAYS rendered in the DOM.
 * They are NEVER unmounted between sections.
 *
 * Transition flow (3-step CSS trick):
 *   1. Set incoming scene to  data-state="entering"  (opacity:0, blur:3px, offset) — no transition
 *   2. requestAnimationFrame → set to data-state="active"  (CSS transition fires: slides in, sharpens)
 *   3. Set outgoing scene to data-state="exiting" simultaneously (CSS transition: drifts out, fades)
 *   4. After 700ms: outgoing scene → data-state="dormant" (hidden, animations paused)
 *
 * Direction-aware: data-dir="1" (forward) or data-dir="-1" (backward)
 *   Forward  → new enters from below, old exits upward
 *   Backward → new enters from above, old exits downward
 *
 * Sits at z-index 35 between FloatingIcons (z-30) and overlays (z-40).
 */

const ALL_SECTIONS = [
  'home', 'about', 'skills', 'techstack',
  'projects', 'experience', 'education', 'achievements', 'contact',
];

const DECORATION_MAP = {
  home:         <HomeDecorations />,
  about:        <AboutDecorations />,
  skills:       <SkillsDecorations />,
  techstack:    <TechConstellationLayer />,
  projects:     <ProjectsDecorations />,
  experience:   <ExperienceDecorations />,
  education:    <EducationTimeline />,
  achievements: <AchievementsDecorations />,
  contact:      <ContactDecorations />,
};

function SectionDecorations({ sectionId }) {
  const prevSectionRef  = useRef(null);
  const directionRef    = useRef(1);
  const dormantTimerRef = useRef(null);

  // Sync initial mount state
  useEffect(() => {
    // Hide all scenes on start except initial
    const scenes = document.querySelectorAll('.decoration-scene');
    scenes.forEach(scene => {
      const isInitial = scene.dataset.section === sectionId;
      scene.dataset.state = isInitial ? 'active' : 'dormant';
    });
    prevSectionRef.current = sectionId;
  }, []);

  // ── Synchronized Event Listeners ──
  useEffect(() => {
    // Clear dormant timer on new transition
    const clearTimer = () => {
      if (dormantTimerRef.current) {
        clearTimeout(dormantTimerRef.current);
        dormantTimerRef.current = null;
      }
    };

    // 1. Transition Start: immediately fade out old decorations
    const unsubStart = EventBus.on('TRANSITION_START', ({ from, direction = 1 }) => {
      directionRef.current = direction;
      clearTimer();

      if (from) {
        const prevScene = document.querySelector(`.decoration-scene[data-section="${from}"]`);
        if (prevScene) {
          prevScene.dataset.dir   = direction;
          prevScene.dataset.state = 'exiting';
          
          dormantTimerRef.current = setTimeout(() => {
            if (prevScene.dataset.state === 'exiting') {
              prevScene.dataset.state = 'dormant';
              delete prevScene.dataset.dir;
            }
          }, 600); // 600ms match exit window
        }
      }
    });

    // 2. Title / Content In: fade in new decorations together with text/cards
    const triggerEntry = (targetSecId) => {
      const nextScene = document.querySelector(`.decoration-scene[data-section="${targetSecId}"]`);
      if (nextScene && nextScene.dataset.state !== 'active' && nextScene.dataset.state !== 'looping') {
        clearTimer();
        nextScene.dataset.dir   = directionRef.current;
        nextScene.dataset.state = 'entering';

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (nextScene.dataset.state === 'entering') {
              nextScene.dataset.state = 'active';
            }
          });
        });
      }
    };

    const unsubTitleIn   = EventBus.on('TITLE_IN', triggerEntry);
    const unsubContentIn = EventBus.on('CONTENT_IN', triggerEntry);

    return () => {
      unsubStart();
      unsubTitleIn();
      unsubContentIn();
    };
  }, []);

  // ── Listen for CINEMATIC_STATE to finalize looping ──
  useEffect(() => {
    const unsub = EventBus.on('CINEMATIC_STATE', ({ state, context }) => {
      if (state === 'LOOPING' && context?.to) {
        const scene = document.querySelector(`.decoration-scene[data-section="${context.to}"]`);
        if (scene && (scene.dataset.state === 'active' || scene.dataset.state === 'entering')) {
          scene.dataset.state = 'looping';
        }
      }
    });
    return () => unsub();
  }, []);

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      if (dormantTimerRef.current) clearTimeout(dormantTimerRef.current);
    };
  }, []);

  return (
    <div
      className="section-decorations-root"
      aria-hidden="true"
      data-active-section={sectionId}
    >
      {ALL_SECTIONS.map(id => (
        <div
          key={id}
          className="decoration-scene"
          data-section={id}
          data-layer="decoration"
          // Initial render: active section is visible, others dormant
          // After first render, data-state is managed imperatively via useEffect
          data-state={id === sectionId ? 'active' : 'dormant'}
        >
          {DECORATION_MAP[id]}
        </div>
      ))}
    </div>
  );
}

export default SectionDecorations;
