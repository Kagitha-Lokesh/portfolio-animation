import fs from 'fs';
import path from 'path';

// Define the experience mapping and frame ranges (inclusive)
const PORTFOLIO_CONFIG = {
  experiences: [
    {
      id: "developer-journey",
      sections: [
        { id: "home", start: 0, end: 69 },
        { id: "about", start: 70, end: 149 },
        { id: "skills", start: 150, end: 214 },
        { id: "techstack", start: 215, end: 270 }
      ]
    },
    {
      id: "career",
      sections: [
        { id: "projects", start: 271, end: 339 },
        { id: "experience", start: 340, end: 405 },
        { id: "achievements", start: 460, end: 504 } // Note: Education is at 406-459, which is in Personal
      ]
    },
    {
      id: "personal",
      sections: [
        { id: "education", start: 406, end: 459 },
        { id: "contact", start: 505, end: 517 }
      ]
    }
  ]
};

const SRC_DIR = './frames_24fps';
const DEST_BASE_DIR = './public/assets/experiences';
const MANIFEST_PATH = './public/assets/experiences/manifest.json';

// Helper to pad numbers (e.g. 1 -> "0001")
function pad(num, size = 4) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

async function run() {
  console.log('Starting frame organization...');
  
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`Source directory ${SRC_DIR} does not exist!`);
    process.exit(1);
  }

  const manifest = {
    totalFrames: 517,
    sections: {}
  };

  for (const exp of PORTFOLIO_CONFIG.experiences) {
    const expId = exp.id;
    for (const sec of exp.sections) {
      const secId = sec.id;
      const destDir = path.join(DEST_BASE_DIR, expId, secId);
      
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      manifest.sections[secId] = [];

      console.log(`Copying frames for section: ${secId} (${sec.start} to ${sec.end})`);

      for (let i = sec.start; i <= sec.end; i++) {
        // Clamp to max frame count (0 to 516 -> frame_0001.jpg to frame_0517.jpg)
        const frameIndex = Math.min(i, 516);
        const fileName = `frame_${pad(frameIndex + 1)}.jpg`;
        const srcPath = path.join(SRC_DIR, fileName);
        const destFileName = fileName;
        const destPath = path.join(destDir, destFileName);

        // Path relative to public/
        const relativeUrlPath = `assets/experiences/${expId}/${secId}/${destFileName}`;

        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, destPath);
          manifest.sections[secId].push(relativeUrlPath);
        } else {
          console.warn(`Warning: source frame not found at ${srcPath}`);
        }
      }
    }
  }

  // Write manifest file
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Manifest created successfully at ${MANIFEST_PATH}`);
  console.log('Frame organization complete!');
}

run().catch(err => {
  console.error('Error running frame organization:', err);
  process.exit(1);
});
