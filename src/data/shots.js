/**
 * Data-driven Shots Definition
 * Subdivides each scene into specific visual action shots.
 */
export const SHOTS = [
  // Scene 1: Hero
  {
    id: 'hero_intro',
    scene: 'hero',
    frames: { start: 0, end: 18 },
    camera: { focusX: 0.32, zoom: 1.0, brightness: 1.0 }
  },
  {
    id: 'hero_wave',
    scene: 'hero',
    frames: { start: 19, end: 37 },
    camera: { focusX: 0.32, zoom: 1.02, brightness: 1.0 }
  },
  
  // Scene 2: About Me
  {
    id: 'about_typing',
    scene: 'about',
    frames: { start: 38, end: 56 },
    camera: { focusX: 0.50, zoom: 1.0, brightness: 1.0 }
  },
  {
    id: 'about_thinking',
    scene: 'about',
    frames: { start: 57, end: 75 },
    camera: { focusX: 0.50, zoom: 1.05, brightness: 1.0 }
  },

  // Scene 3: Skills & Tech Stack
  {
    id: 'skills_point',
    scene: 'skills_tech',
    frames: { start: 76, end: 94 },
    camera: { focusX: 0.48, zoom: 1.05, brightness: 0.9 }
  },
  {
    id: 'tech_stack_show',
    scene: 'skills_tech',
    frames: { start: 95, end: 113 },
    camera: { focusX: 0.48, zoom: 1.08, brightness: 0.9 }
  },

  // Scene 4: Projects & Experience
  {
    id: 'projects_show',
    scene: 'projects_exp',
    frames: { start: 114, end: 132 },
    camera: { focusX: 0.60, zoom: 1.0, brightness: 1.0 }
  },
  {
    id: 'experience_show',
    scene: 'projects_exp',
    frames: { start: 133, end: 151 },
    camera: { focusX: 0.60, zoom: 1.02, brightness: 1.0 }
  },

  // Scene 5: Education & Achievements
  {
    id: 'edu_studying',
    scene: 'edu_achievements',
    frames: { start: 152, end: 170 },
    camera: { focusX: 0.50, zoom: 1.0, brightness: 1.0 }
  },
  {
    id: 'achievements_gallery',
    scene: 'edu_achievements',
    frames: { start: 171, end: 189 },
    camera: { focusX: 0.50, zoom: 1.04, brightness: 1.0 }
  },

  // Scene 6: Contact
  {
    id: 'contact_idle',
    scene: 'contact',
    frames: { start: 190, end: 208 },
    camera: { focusX: 0.45, zoom: 0.95, brightness: 0.95 }
  },
  {
    id: 'contact_ending',
    scene: 'contact',
    frames: { start: 209, end: 226 },
    camera: { focusX: 0.45, zoom: 0.92, brightness: 0.95 }
  }
];
export default SHOTS;
