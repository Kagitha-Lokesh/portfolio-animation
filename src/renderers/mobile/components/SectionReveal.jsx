import React, { useRef } from 'react';
import { useInView } from '../../../shared/motion/MotionProvider';
import './SectionReveal.css';

export function SectionReveal({ children, delay = 0, duration = 0.6, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });

  return (
    <div 
      ref={ref}
      className={`section-reveal-container ${isInView ? 'revealed' : ''} ${className}`}
      style={{
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`
      }}
    >
      {children}
    </div>
  );
}

export default SectionReveal;
