import React from 'react';
import Heading from './Heading';
import './SectionTitle.css';

export function SectionTitle({ 
  title, 
  subtitle, 
  className = '',
  align = 'left',
  ...props 
}) {
  return (
    <div className={`shared-section-title align-${align} ${className}`} {...props}>
      <Heading level={2} className="section-title-heading">
        {title}
      </Heading>
      {subtitle && <p className="section-title-subtitle">{subtitle}</p>}
      <div className="section-title-line" />
    </div>
  );
}

export default SectionTitle;
