import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ANIMATION } from '../config/animation';
import { fitContain } from '../utils/fitContain';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook to drive the canvas animation frames.
 * Uses a single requestAnimationFrame loop, interpolates the current frame index
 * toward the scroll target, and renders the result to canvas with custom object-fit.
 * 
 * @param {Array<ImageBitmap|HTMLImageElement>} images - Preloaded frame assets
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef - Ref of target canvas element
 * @param {React.RefObject<HTMLElement>} containerRef - Ref of pinning trigger container
 */
export function useFrameAnimation(images, canvasRef, containerRef) {
  const ctxRef = useRef(null);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastRenderedFrameRef = useRef(-1);
  const animationFrameIdRef = useRef(null);
  const forceRedrawRef = useRef(false);

  useEffect(() => {
    if (!images || images.length === 0 || !canvasRef.current || !containerRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    const totalFrames = images.length;

    // Check accessibility preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Drawing bounds function
    const drawFrame = (frameIndex) => {
      const image = images[frameIndex];
      if (!canvas || !ctx || !image) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dpr = ANIMATION.DPI_SCALE ? (window.devicePixelRatio || 1) : 1;
      const containerWidth = canvas.width / dpr;
      const containerHeight = canvas.height / dpr;

      const imgWidth = image.width || image.naturalWidth || 0;
      const imgHeight = image.height || image.naturalHeight || 0;

      if (imgWidth === 0 || imgHeight === 0) return;

      const { x, y, width, height } = fitContain(containerWidth, containerHeight, imgWidth, imgHeight);

      // Draw the current frame centered and contained
      ctx.drawImage(image, x, y, width, height);
    };

    // Canvas scaling logic
    let resizeTimeoutId = null;

    const resizeCanvas = () => {
      const dpr = ANIMATION.DPI_SCALE ? (window.devicePixelRatio || 1) : 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Scale context back to CSS units
      ctx.scale(dpr, dpr);

      // Force redrawing the current frame on the next tick
      forceRedrawRef.current = true;
    };

    const handleResize = () => {
      if (resizeTimeoutId) {
        cancelAnimationFrame(resizeTimeoutId);
      }
      // Throttle resize events to the next animation frame to prevent thrashing
      resizeTimeoutId = requestAnimationFrame(() => {
        resizeCanvas();
      });
    };

    // Initialize canvas dimensions
    resizeCanvas();
    window.addEventListener('resize', handleResize);

    // Setup GSAP ScrollTrigger to track progress without scrub easing (Lenis smooths scroll)
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: () => `+=${totalFrames * ANIMATION.SCROLL_MULTIPLIER}`,
      pin: true,
      scrub: false,
      anticipatePin: 1,
      onUpdate: (self) => {
        // Map 0..1 progress to frame indices
        targetFrameRef.current = self.progress * (totalFrames - 1);
      },
    });

    // Single requestAnimationFrame tick loop
    const tick = () => {
      const target = targetFrameRef.current;
      let current = currentFrameRef.current;

      // Easing interpolation
      const easing = prefersReducedMotion ? 1 : ANIMATION.INTERPOLATION;
      current += (target - current) * easing;

      // Clamp values
      if (current < 0) current = 0;
      if (current > totalFrames - 1) current = totalFrames - 1;

      currentFrameRef.current = current;

      const rounded = Math.round(current);

      // Draw only if frame index changed or if forced (e.g. on resize)
      if (rounded !== lastRenderedFrameRef.current || forceRedrawRef.current) {
        drawFrame(rounded);
        lastRenderedFrameRef.current = rounded;
        forceRedrawRef.current = false;
      }

      animationFrameIdRef.current = requestAnimationFrame(tick);
    };

    // Start rendering loop
    animationFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (resizeTimeoutId) {
        cancelAnimationFrame(resizeTimeoutId);
      }
      trigger.kill();
      ctxRef.current = null;
    };
  }, [images, canvasRef, containerRef]);
}
