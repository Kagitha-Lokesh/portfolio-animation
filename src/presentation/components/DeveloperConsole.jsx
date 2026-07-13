import React, { useEffect, useState, useRef } from 'react';
import { Runtime } from '../../core/Runtime';

/**
 * DeveloperConsole Component
 * High-performance developer console HUD toggled via F2.
 * Bypasses Virtual DOM rendering during frame updates by directly writing to DOM text nodes.
 */
export function DeveloperConsole() {
  const [isVisible, setIsVisible] = useState(false);

  const stateRef = useRef(null);
  const experienceRef = useRef(null);
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const fpsRef = useRef(null);
  const cacheRef = useRef(null);
  const preloadRef = useRef(null);
  const cameraRef = useRef(null);
  const lockRef = useRef(null);

  useEffect(() => {
    // 1. Hook up F2 toggle listener
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        setIsVisible(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // 2. High frequency state subscriptions with direct DOM manipulation
    const unsubscribe = Runtime.subscribe((state) => {
      const cacheStats = Runtime.frameCache.getMetrics();
      const exp = Runtime.experienceManager.getCurrentExperience();
      const activeSectionId = state.currentSectionId;

      if (stateRef.current) stateRef.current.textContent = state.runtimeState;
      if (experienceRef.current) experienceRef.current.textContent = exp ? exp.title : '-';
      if (sectionRef.current) sectionRef.current.textContent = activeSectionId;
      if (frameRef.current) frameRef.current.textContent = `${state.currentFrame} / ${state.totalFrames || 517}`;
      if (fpsRef.current) fpsRef.current.textContent = `${state.fps} FPS`;
      if (preloadRef.current) preloadRef.current.textContent = `${state.loadedPercent}%`;
      if (lockRef.current) lockRef.current.textContent = Runtime.isTransitionLocked() ? 'LOCKED' : 'UNLOCKED';
      
      if (cacheRef.current) {
        cacheRef.current.textContent = `${cacheStats.cachedCount} frames (${cacheStats.memoryUsedMb}MB) | Hits: ${cacheStats.hitRatio}%`;
      }
      if (cameraRef.current) {
        cameraRef.current.textContent = `Zoom: ${state.camera.zoom.toFixed(2)} | Focus: [${state.camera.focusX.toFixed(2)}, ${state.camera.focusY.toFixed(2)}]`;
      }
    });

    return () => unsubscribe();
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="developer-console-panel glass-panel dark-panel" aria-label="Engine Diagnostics Console">
      <div className="console-header">
        <span className="console-title">ENGINE DIAGNOSTICS [F2]</span>
        <span className="console-status-indicator blink" />
      </div>

      <div className="console-body">
        <div className="console-row">
          <span className="console-label">Experience:</span>
          <span ref={experienceRef} className="console-value">-</span>
        </div>
        <div className="console-row">
          <span className="console-label">Active Section:</span>
          <span ref={sectionRef} className="console-value">-</span>
        </div>
        <div className="console-row">
          <span className="console-label">Runtime State:</span>
          <span ref={stateRef} className="console-value">-</span>
        </div>
        <div className="console-row">
          <span className="console-label">Transition Lock:</span>
          <span ref={lockRef} className="console-value">-</span>
        </div>
        <div className="console-row">
          <span className="console-label">Frame Index:</span>
          <span ref={frameRef} className="console-value">-</span>
        </div>
        <div className="console-row">
          <span className="console-label">Core Tick Speed:</span>
          <span ref={fpsRef} className="console-value">-</span>
        </div>
        <div className="console-row">
          <span className="console-label">Cache Profile:</span>
          <span ref={cacheRef} className="console-value">-</span>
        </div>
        <div className="console-row">
          <span className="console-label">Assets Loaded:</span>
          <span ref={preloadRef} className="console-value">-</span>
        </div>
        <div className="console-row">
          <span className="console-label">Camera Vector:</span>
          <span ref={cameraRef} className="console-value">-</span>
        </div>
      </div>
    </div>
  );
}

export default DeveloperConsole;
