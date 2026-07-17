import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Runtime } from '../core/Runtime';
import { invalidateDeviceProfileCache } from './fitCover';

/**
 * CanvasRenderer Component
 * Mounts the fullscreen HTML5 canvas element and binds resize events to the Runtime.
 */
export function CanvasRenderer() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
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

      invalidateDeviceProfileCache();
      Runtime.resize();

      resizeTimeoutRef.current = setTimeout(() => {
        invalidateDeviceProfileCache();
        Runtime.resize();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Subtle cosmetic camera drift loop
    const driftAnimation = gsap.to(containerRef.current, {
      scale: 1.015,
      x: "+=4",
      duration: 14,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      driftAnimation.kill();
      Runtime.destroy();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="canvas-container" 
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 20 }}
    >
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
