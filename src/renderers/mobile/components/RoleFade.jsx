import React, { useState, useEffect } from 'react';
import './RoleFade.css';

export function RoleFade({ roles = [], intervalMs = 3000 }) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (roles.length <= 1) return;

    const interval = setInterval(() => {
      setAnimating(true);
      // Wait for fade out animation
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % roles.length);
        setAnimating(false);
      }, 600);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [roles, intervalMs]);

  if (!roles.length) return null;

  return (
    <div className="role-fade-container">
      <span className={`role-fade-text ${animating ? 'exit' : 'enter'}`}>
        {roles[index]}
      </span>
    </div>
  );
}

export default RoleFade;
