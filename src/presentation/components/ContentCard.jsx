import React from 'react';

const ContentCard = React.forwardRef(({ theme, children, className = "", as: Component = "div", ...props }, ref) => {
  return (
    <Component ref={ref} className={`content-card ${className}`} data-theme={theme} {...props}>
      {children}
    </Component>
  );
});

ContentCard.displayName = 'ContentCard';

export default ContentCard;
