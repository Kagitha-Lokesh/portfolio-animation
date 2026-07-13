/**
 * Data-driven Scene Configuration
 * Organizes the 3D assets into 6 cinematic scenes.
 */
export const SCENES = {
  hero: {
    id: 'hero',
    title: 'Home',
    experience: 'intro',
    frames: { start: 0, end: 37 }, // frames 1-38 (index 0-37)
    camera: { mode: 'dolly-in', focusX: 0.32, focusY: 0.50, zoom: 1.0, brightness: 1.0, contrast: 1.0, safeZone: 'desktop-left' },
    character: { outfit: 'green_hoodie', pose: 'wave', emotion: 'smile', environment: 'workspace' },
    theme: 'light'
  },
  about: {
    id: 'about',
    title: 'About Me',
    experience: 'bio',
    frames: { start: 38, end: 75 }, // frames 39-76 (index 38-75)
    camera: { mode: 'slide-right', focusX: 0.50, focusY: 0.50, zoom: 1.0, brightness: 1.0, contrast: 1.0, safeZone: 'desktop-left' },
    character: { outfit: 'casual_tshirt', pose: 'thinking', emotion: 'neutral', environment: 'workspace' },
    theme: 'light'
  },
  skills_tech: {
    id: 'skills_tech',
    title: 'Skills & Stack',
    experience: 'developer_journey',
    frames: { start: 76, end: 113 }, // frames 77-114 (index 76-113)
    camera: { mode: 'orbit-cam', focusX: 0.48, focusY: 0.50, zoom: 1.05, brightness: 1.0, contrast: 1.0, safeZone: 'desktop-left' },
    character: { outfit: 'developer_hoodie', pose: 'typing', emotion: 'focused', environment: 'lab' },
    theme: 'dark'
  },
  projects_exp: {
    id: 'projects_exp',
    title: 'Work Showcase',
    experience: 'portfolio_showcase',
    frames: { start: 114, end: 151 }, // frames 115-152 (index 114-151)
    camera: { mode: 'push-in', focusX: 0.60, focusY: 0.50, zoom: 1.0, brightness: 1.0, contrast: 1.0, safeZone: 'desktop-right' },
    character: { outfit: 'casual_jacket', pose: 'presenting', emotion: 'confident', environment: 'gallery' },
    theme: 'light'
  },
  edu_achievements: {
    id: 'edu_achievements',
    title: 'Achievements & Education',
    experience: 'academics_gallery',
    frames: { start: 152, end: 189 }, // frames 153-190 (index 152-189)
    camera: { mode: 'track-cam', focusX: 0.50, focusY: 0.50, zoom: 1.0, brightness: 1.0, contrast: 1.0, safeZone: 'desktop-left' },
    character: { outfit: 'student_shirt', pose: 'studying', emotion: 'curious', environment: 'library' },
    theme: 'light'
  },
  contact: {
    id: 'contact',
    title: 'Contact',
    experience: 'outro',
    frames: { start: 190, end: 226 }, // frames 191-227 (index 190-226)
    camera: { mode: 'pull-back', focusX: 0.45, focusY: 0.50, zoom: 0.95, brightness: 1.0, contrast: 1.0, safeZone: 'desktop-left' },
    character: { outfit: 'formal_suit', pose: 'ending', emotion: 'cheerful', environment: 'terrace' },
    theme: 'dark'
  }
};
