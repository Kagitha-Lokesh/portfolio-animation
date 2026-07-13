import React, { useEffect, useRef } from 'react';
import { AnimationRuntime } from './AnimationRuntime';

/**
 * DebugPanel Component
 * Optimized for production: bypasses React's Virtual DOM reconciliation during scroll.
 * Uses direct DOM refs to update metrics text at high refresh rates, preventing any React rerenders.
 */
export function DebugPanel() {
  const stateRef = useRef(null);
  const frameRef = useRef(null);
  const scrollRef = useRef(null);
  const fpsRef = useRef(null);
  const dropsRef = useRef(null);
  const renderRef = useRef(null);
  const decodeRef = useRef(null);
  const hitsRef = useRef(null);
  const missesRef = useRef(null);
  const deviceRef = useRef(null);
  const focusRef = useRef(null);
  const preloadRef = useRef(null);
  
  const statusBulbRef = useRef(null);
  const sliderRef = useRef(null);
  const sliderLabelRef = useRef(null);
  const sliderFrameRef = useRef(null);

  useEffect(() => {
    // Keep track of last bulb status to avoid redundant classList operations
    let lastStatus = '';

    const unsubscribe = AnimationRuntime.subscribe((state) => {
      const activeTotal = state.totalFrames || 1034;

      // 1. Direct DOM text writes (0ms React Virtual DOM reconciliations)
      if (stateRef.current) stateRef.current.textContent = state.runtimeState;
      if (frameRef.current) frameRef.current.textContent = `${Math.round(state.currentFrame)} / ${activeTotal}`;
      if (scrollRef.current) scrollRef.current.textContent = `${Math.round(state.scrollProgress * 100)}%`;
      if (fpsRef.current) fpsRef.current.textContent = state.fps;
      
      if (dropsRef.current) {
        dropsRef.current.textContent = state.droppedFrames;
        dropsRef.current.style.color = state.droppedFrames > 0 ? '#ff6b6b' : 'inherit';
      }

      if (renderRef.current) renderRef.current.textContent = `${state.renderTimeMs} ms`;
      if (decodeRef.current) decodeRef.current.textContent = `${state.decodeTimeMs} ms`;
      if (hitsRef.current) hitsRef.current.textContent = `${state.cacheHitRatio}%`;
      if (missesRef.current) missesRef.current.textContent = `${state.cacheMissRatio}%`;
      if (deviceRef.current) deviceRef.current.textContent = state.deviceProfile;
      if (focusRef.current) {
        focusRef.current.textContent = `X:${state.camera.focusX.toFixed(2)} Y:${state.camera.focusY.toFixed(2)}`;
      }
      if (preloadRef.current) preloadRef.current.textContent = `${state.loadedPercent}%`;

      // 2. Bulb indicator class update
      const statusClass = state.runtimeState.toLowerCase();
      if (statusBulbRef.current && lastStatus !== statusClass) {
        statusBulbRef.current.className = `debug-status-bulb ${statusClass}`;
        statusBulbRef.current.title = `Status: ${state.runtimeState}`;
        lastStatus = statusClass;
      }

      // 3. Scrubber position updates
      const currentVal = Math.round(state.currentFrame);
      if (sliderRef.current) {
        sliderRef.current.value = currentVal;
        sliderRef.current.max = activeTotal - 1;
      }
      if (sliderFrameRef.current) {
        sliderFrameRef.current.textContent = `Frame ${currentVal} of ${activeTotal}`;
      }
      if (sliderLabelRef.current) {
        const isManual = state.runtimeState !== 'READY' && state.runtimeState !== 'IDLE' && AnimationRuntime.isManualScrubberActive;
        sliderLabelRef.current.textContent = `Scrubber Mode: ${isManual ? 'Manual Overrides' : 'Active Scroll'}`;
      }
    });

    return () => unsubscribe();
  }, []);

  const handleScrubberChange = (e) => {
    const frameIndex = parseInt(e.target.value, 10);
    AnimationRuntime.scrubTo(frameIndex);
  };

  const handleScrubberRelease = () => {
    AnimationRuntime.releaseScrubber();
  };

  return (
    <>
      <div className="debug-panel" aria-label="Performance Diagnostics Panel">
        <div className="debug-header">
          <span className="debug-title">Animation Engine</span>
          <div ref={statusBulbRef} className="debug-status-bulb booting" />
        </div>

        <div className="debug-row">
          <span className="debug-label">State</span>
          <span ref={stateRef} className="debug-value">-</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">Frame</span>
          <span ref={frameRef} className="debug-value">-</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">Scroll Progress</span>
          <span ref={scrollRef} className="debug-value">-</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">FPS</span>
          <span ref={fpsRef} className="debug-value">-</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">Dropped Frames</span>
          <span ref={dropsRef} className="debug-value">-</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">Render Latency</span>
          <span ref={renderRef} className="debug-value">-</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">GPU Decode Time</span>
          <span ref={decodeRef} className="debug-value">-</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">Cache Hit Ratio</span>
          <span ref={hitsRef} className="debug-value">-</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">Cache Miss Ratio</span>
          <span ref={missesRef} className="debug-value">-</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">Device Profile</span>
          <span ref={deviceRef} className="debug-value">-</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">Focus Coordinates</span>
          <span ref={focusRef} className="debug-value">-</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">Preload Progress</span>
          <span ref={preloadRef} className="debug-value">-</span>
        </div>
      </div>

      <div className="scrubber-panel" aria-label="Manual Frame Scrubber Slider">
        <div className="scrubber-header">
          <span ref={sliderLabelRef}>Scrubber Mode: Active Scroll</span>
          <span ref={sliderFrameRef}>Frame 0 of -</span>
        </div>
        <input 
          ref={sliderRef}
          type="range"
          min="0"
          max="516"
          defaultValue="0"
          onChange={handleScrubberChange}
          onMouseUp={handleScrubberRelease}
          onTouchEnd={handleScrubberRelease}
          className="scrubber-slider"
          aria-label="Frame Scrubber Slider input"
        />
      </div>
    </>
  );
}

export default DebugPanel;
