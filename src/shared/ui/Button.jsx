import React from 'react';
import './Button.css'; // Let's keep shared/ui components clean and modular

export function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button', 
  disabled = false,
  className = '',
  ...props 
}) {
  return (
    <button
      type={type}
      className={`shared-btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
      {variant === 'primary' && <span className="btn-glow" />}
    </button>
  );
}

export default Button;
