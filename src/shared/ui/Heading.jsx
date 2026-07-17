import React from 'react';
import './Heading.css';

export function Heading({ 
  children, 
  level = 2, 
  className = '',
  ...props 
}) {
  const Tag = `h${level}`;
  return (
    <Tag className={`shared-heading heading-l${level} ${className}`} {...props}>
      {children}
    </Tag>
  );
}

export default Heading;
