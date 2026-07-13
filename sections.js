// src/config/sections.js
//
// SOURCE OF TRUTH for the Section-Driven Animation Runtime.
// Playback speed: 12 FPS — native, never sped up, never interpolated.
// Total sequence: 517 frames (frame_0001.jpg ... frame_0517.jpg)
//
// Each section has three phases:
//   enter  — plays once when arriving at this section (from previous section's exit)
//   loop   — plays continuously while the section is active (12fps, seamless loop)
//   exit   — plays once when leaving this section toward the next one
//
// enter[n].end + 1 === loop[n].start, loop[n].end + 1 === exit[n].start,
// and exit[n].end + 1 === enter[n+1].start — the whole 0-517 range is contiguous,
// no gaps, no overlaps.

export const SECTIONS = [
  {
    id: "home",
    order: 1,
    title: "Home",
    enter: { start: 0, end: 14 },
    loop: { start: 15, end: 26 },
    exit: { start: 27, end: 69 },
    camera: { focusX: 0.38, focusY: 0.5, zoom: 1, brightness: 1 },
    theme: "light",
    safeZone: "left",
  },
  {
    id: "about",
    order: 2,
    title: "About Me",
    enter: { start: 70, end: 74 },
    loop: { start: 75, end: 85 },
    exit: { start: 86, end: 149 },
    camera: { focusX: 0.5, focusY: 0.5, zoom: 1, brightness: 1 },
    theme: "light",
    safeZone: "center",
  },
  {
    id: "skills",
    order: 3,
    title: "Skills",
    enter: { start: 150, end: 154 },
    loop: { start: 155, end: 165 },
    exit: { start: 166, end: 214 },
    camera: { focusX: 0.5, focusY: 0.5, zoom: 1, brightness: 0.9 },
    theme: "dark",
    safeZone: "center",
  },
  {
    id: "techstack",
    order: 4,
    title: "Tech Stack",
    enter: { start: 215, end: 219 },
    loop: { start: 220, end: 230 },
    exit: { start: 231, end: 270 },
    camera: { focusX: 0.5, focusY: 0.5, zoom: 1, brightness: 0.9 },
    theme: "dark",
    safeZone: "center",
  },
  {
    id: "projects",
    order: 5,
    title: "Projects",
    enter: { start: 271, end: 279 },
    loop: { start: 280, end: 305 },
    exit: { start: 306, end: 339 },
    camera: { focusX: 0.38, focusY: 0.5, zoom: 1, brightness: 1 },
    theme: "light",
    safeZone: "left",
  },
  {
    id: "experience",
    order: 6,
    title: "Experience",
    enter: { start: 340, end: 349 },
    loop: { start: 350, end: 370 },
    exit: { start: 371, end: 405 },
    camera: { focusX: 0.5, focusY: 0.5, zoom: 1, brightness: 1 },
    theme: "light",
    safeZone: "center",
  },
  {
    id: "education",
    order: 7,
    title: "Education",
    enter: { start: 406, end: 408 },
    loop: { start: 409, end: 413 },
    exit: { start: 414, end: 459 },
    camera: { focusX: 0.5, focusY: 0.5, zoom: 1, brightness: 1 },
    theme: "light",
    safeZone: "center",
  },
  {
    id: "achievements",
    order: 8,
    title: "Achievements",
    enter: { start: 460, end: 463 },
    loop: { start: 464, end: 473 },
    exit: { start: 474, end: 504 },
    camera: { focusX: 0.5, focusY: 0.5, zoom: 1, brightness: 1 },
    theme: "light",
    safeZone: "center",
  },
  {
    id: "contact",
    order: 9,
    title: "Contact",
    enter: { start: 505, end: 509 },
    loop: { start: 510, end: 517 },
    exit: null,
    camera: { focusX: 0.5, focusY: 0.5, zoom: 1, brightness: 0.95 },
    theme: "dark",
    safeZone: "center",
  },
];

export const NATIVE_FPS = 12;
export const TOTAL_FRAMES = 517;

export function getSectionById(id) {
  return SECTIONS.find((s) => s.id === id) ?? null;
}

export function getSectionByOrder(order) {
  return SECTIONS.find((s) => s.order === order) ?? null;
}
