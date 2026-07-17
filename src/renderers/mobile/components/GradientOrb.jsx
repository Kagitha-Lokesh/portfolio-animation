import React from 'react';
import './GradientOrb.css';

export function GradientOrb({ 
  color = 'mint', 
  size = '300px', 
  top = '10%', 
  left = '10%', 
  delay = '0s',
  ...props 
}) {
  const inlineStyles = {
    width: size,
    height: size,
    top,
    left,
    animationDelay: delay,
    ...props.style
  };

  return (
    <div 
      className={`mobile-gradient-orb orb-${color}`} 
      style={inlineStyles}
      {...props}
    />
  );
}

export default GradientOrb;
