import React, { useEffect, useRef } from 'react';
import { Runtime } from '../core/Runtime';

/**
 * CanvasRenderer Component
 * Mounts the fullscreen HTML5 canvas element and binds resize events to the Runtime.
 */
export function CanvasRenderer() {
  const canvasRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Boot up central runtime with this canvas
    Runtime.init(canvas);

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      Runtime.resize();

      resizeTimeoutRef.current = setTimeout(() => {
        Runtime.resize();
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
      Runtime.destroy();
    };
  }, []);

  return (
    <div className="canvas-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
      <canvas 
        ref={canvasRef} 
        className="animation-canvas"
        style={{ display: 'block', width: '100%', height: '100%' }}
        aria-label="Cinematic scroll-driven character animation canvas"
      />
    </div>
  );
}

export default CanvasRenderer;
