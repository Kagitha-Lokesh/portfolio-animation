import { useState, useEffect, useRef } from 'react';
import { preloadImages } from '../utils/preloadImages';

/**
 * Custom hook to manage the preloading of cinematic frames.
 * Keeps track of progress percentage, loading readiness, and potential errors.
 * Stores loaded assets in a ref to avoid React state re-render overhead.
 * 
 * @returns {{images: Array<ImageBitmap|HTMLImageElement>, progress: number, ready: boolean, error: Error|null}}
 */
export function useImagePreloader() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    let isMounted = true;

    preloadImages((loaded, total) => {
      if (isMounted) {
        setProgress(Math.round((loaded / total) * 100));
      }
    })
      .then((loadedImages) => {
        if (isMounted) {
          imagesRef.current = loadedImages;
          setReady(true);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Preloader failed:', err);
          setError(err);
        }
      });

    return () => {
      isMounted = false;
      // Cleanup image references to prevent memory leaks
      imagesRef.current = [];
    };
  }, []);

  return {
    images: imagesRef.current,
    progress,
    ready,
    error,
  };
}
