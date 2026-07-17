import React, { useEffect, useState } from 'react';
import { RENDERER_ID } from './RendererPolicy';
import './ViewportBanner.css';

export function ViewportBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [targetMode, setTargetMode] = useState('');

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      const isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      
      // Determine what renderer policy WOULD choose now
      const wouldBeDesktop = width >= 1200 && !isCoarse;
      const currentIsDesktop = RENDERER_ID === 'desktop';

      if (wouldBeDesktop && !currentIsDesktop) {
        setTargetMode('desktop');
        setShowBanner(true);
      } else if (!wouldBeDesktop && currentIsDesktop) {
        setTargetMode('mobile');
        setShowBanner(true);
      } else {
        setShowBanner(false);
      }
    };

    // Initialize checking window size
    window.addEventListener('resize', checkViewport);
    checkViewport();

    return () => {
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  if (!showBanner) return null;

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="viewport-alert-banner">
      <div className="banner-content">
        <span className="banner-icon">⚡</span>
        <span className="banner-text">
          {targetMode === 'desktop' 
            ? 'Rotate or resize to load the cinematic desktop version.' 
            : 'Load the touch-optimized mobile experience.'}
        </span>
        <button className="banner-reload-btn" onClick={handleReload}>
          Reload ↻
        </button>
      </div>
    </div>
  );
}

export default ViewportBanner;
