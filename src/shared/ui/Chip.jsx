import React from 'react';
import './Chip.css';

export function Chip({ 
  children, 
  className = '',
  active = false,
  onClick,
  ...props 
}) {
  return (
    <span 
      className={`shared-chip ${active ? 'chip-active' : ''} ${onClick ? 'chip-clickable' : ''} ${className}`} 
      onClick={onClick}
      {...props}
    >
      {children}
    </span>
  );
}

export default Chip;
