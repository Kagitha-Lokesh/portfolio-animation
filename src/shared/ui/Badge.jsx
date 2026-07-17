import React from 'react';
import './Badge.css';

export function Badge({ 
  children, 
  variant = 'mint', 
  className = '',
  ...props 
}) {
  return (
    <span className={`shared-badge badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
}

export default Badge;
