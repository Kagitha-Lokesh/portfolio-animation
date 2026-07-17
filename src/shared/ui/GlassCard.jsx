import React from 'react';
import './GlassCard.css';

export function GlassCard({ 
  children, 
  className = '', 
  theme = 'dark',
  as: Component = 'div',
  glow = false,
  heavy = false,
  ...props 
}) {
  const cardClasses = [
    'shared-glass-card',
    heavy ? 'glass--heavy' : '',
    glow ? 'glass--glow' : '',
    theme === 'light' ? 'light-mode' : 'dark-mode',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={cardClasses} {...props}>
      {children}
    </Component>
  );
}

export default GlassCard;
