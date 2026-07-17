import React from 'react';

export function CharacterContactShadow({ focusX }) {
  return (
    <div
      className="character-contact-shadow"
      style={{ left: `${focusX * 100}%` }}
    />
  );
}

export default CharacterContactShadow;
