import fs from 'fs';
import path from 'path';

// Define the 30 FPS configuration ranges (0-indexed absolute frames)
const sections = {
  home: { start: 0, end: 141 },
  about: { start: 142, end: 337 },
  skills: { start: 338, end: 511 },
  techstack: { start: 512, end: 656 },
  projects: { start: 657, end: 813 },
  experience: { start: 814, end: 989 },
  education: { start: 990, end: 1132 },
  achievements: { start: 1133, end: 1248 },
  contact: { start: 1249, end: 1292 }
};

const manifest = {
  totalFrames: 1293,
  sections: {}
};

const formatIndex = (idx) => {
  return String(idx).padStart(4, '0');
};

for (const [sectionId, range] of Object.entries(sections)) {
  manifest.sections[sectionId] = [];
  for (let i = range.start; i <= range.end; i++) {
    // Frames are 1-indexed filenames (frame_0001.jpg is index 0)
    const fileName = `frames_30fps/frame_${formatIndex(i + 1)}.jpg`;
    manifest.sections[sectionId].push(fileName);
  }
}

const outputPath = path.resolve('public/assets/experiences/manifest.json');
const outputDir = path.dirname(outputPath);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
console.log('New 30 FPS manifest successfully written to:', outputPath);
