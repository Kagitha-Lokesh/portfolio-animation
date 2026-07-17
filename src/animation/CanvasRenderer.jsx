import React, { useEffect, useRef } from 'react';
import { AnimationRuntime } from './AnimationRuntime';
import { ScrollManager } from './ScrollManager';
import { invalidateDeviceProfileCache } from './fitCover';

/**
 * CanvasRenderer Component
 * Mounts the fullscreen HTML5 canvas element and binds debounced resize listeners.
 */
export function CanvasRenderer() {
  const canvasRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    AnimationRuntime.init(canvas);

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Bust device profile cache immediately so subsequent reads use new viewport
      invalidateDeviceProfileCache();
      AnimationRuntime.updateState({ runtimeState: 'RESIZING' });

      resizeTimeoutRef.current = setTimeout(() => {
        AnimationRuntime.resize();
        ScrollManager.refresh();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      AnimationRuntime.destroy();
    };
  }, []);

  return (
    <div className="canvas-container">
      <canvas 
        ref={canvasRef} 
        className="animation-canvas"
        aria-label="Interactive scroll-driven character animation canvas"
      />
    </div>
  );
}

export default CanvasRenderer;
