import React from 'react';

export default function SectionHeading({ theme, children, className = '', visible = false }) {
  return (
    <h2
      className={`section-heading fade-element ${visible ? 'visible' : ''} ${className}`.trim()}
      data-theme={theme}
    >
      {children}
    </h2>
  );
}
