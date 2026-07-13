import { useEffect } from 'react';

/**
 * useResize hook
 * Listens to viewport resize and device orientation changes, throttling events
 * to requestAnimationFrame ticks to prevent layout thrashing.
 * 
 * @param {function} onResize - The callback to execute when resize happens
 */
export function useResize(onResize) {
  useEffect(() => {
    let resizeTimeoutId = null;

    const handleResize = () => {
      if (resizeTimeoutId) {
        cancelAnimationFrame(resizeTimeoutId);
      }
      resizeTimeoutId = requestAnimationFrame(() => {
        if (typeof onResize === 'function') {
          onResize();
        }
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (resizeTimeoutId) {
        cancelAnimationFrame(resizeTimeoutId);
      }
    };
  }, [onResize]);
}
export default useResize;
