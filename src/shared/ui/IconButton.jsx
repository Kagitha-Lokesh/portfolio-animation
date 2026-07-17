import React from 'react';
import './IconButton.css';

export function IconButton({ 
  children, 
  onClick, 
  ariaLabel,
  disabled = false,
  className = '',
  ...props 
}) {
  return (
    <button
      type="button"
      className={`shared-icon-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
}

export default IconButton;
