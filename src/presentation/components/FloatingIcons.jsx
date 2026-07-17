import React from 'react';

const ICON_SETS = {
  skills: ["react", "java", "node", "git"],
  techstack: ["html", "css", "firebase", "sql"],
};

export function FloatingIcons({ sectionId }) {
  const icons = ICON_SETS[sectionId];
  if (!icons) return null;

  return (
    <div className="floating-icons-layer">
      {icons.map((icon, i) => (
        <img
          key={icon}
          src={`/icons/${icon}.svg`}
          className={`floating-icon floating-icon-${i}`}
          alt=""
        />
      ))}
    </div>
  );
}

export default FloatingIcons;
