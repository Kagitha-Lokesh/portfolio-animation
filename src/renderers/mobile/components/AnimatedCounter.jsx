import React, { useState, useEffect, useRef } from 'react';
import { useInView } from '../../../shared/motion/MotionProvider';

export function AnimatedCounter({ 
  targetValue = 0, 
  durationMs = 1500, 
  className = '',
  suffix = ''
}) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseInt(targetValue, 10);
    if (start === end) return;

    const totalSteps = 60; // 60fps refresh targets
    const stepDuration = Math.round(durationMs / totalSteps);
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      const progress = stepCount / totalSteps;
      // Ease out quad
      const easedProgress = progress * (2 - progress);
      const currentValue = Math.floor(easedProgress * end);
      
      setValue(currentValue);

      if (stepCount >= totalSteps) {
        setValue(end);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, targetValue, durationMs]);

  return (
    <span ref={ref} className={`animated-counter-val ${className}`}>
      {value}
      {suffix}
    </span>
  );
}

export default AnimatedCounter;
