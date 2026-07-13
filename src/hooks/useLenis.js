import { useEffect } from 'react';
import { ScrollManager } from '../animation/ScrollManager';

/**
 * useLenis Hook
 */
export function useLenis() {
  useEffect(() => {
    ScrollManager.init();
    
    return () => {
      ScrollManager.destroy();
    };
  }, []);
}

export default useLenis;
