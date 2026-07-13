import ffmpeg from 'ffmpeg-static';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const videoPath = path.resolve('portfolio_frames_v2.mp4');
const outputDir = path.resolve('public/frames_30fps');

console.log('Video Path:', videoPath);
console.log('Output Directory:', outputDir);

if (!fs.existsSync(videoPath)) {
  console.error(`Error: Video file not found at ${videoPath}`);
  process.exit(1);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Extracting frames at 30 FPS (JPEG quality -q:v 2)...');
try {
  const command = `"${ffmpeg}" -i "${videoPath}" -vf fps=30 -q:v 2 "${path.join(outputDir, 'frame_%04d.jpg')}"`;
  console.log('Running command:', command);
  
  execSync(command, { stdio: 'inherit' });
  console.log('\nFrames extracted successfully to public/frames_30fps!');
} catch (error) {
  console.error('Failed to extract frames:', error);
  process.exit(1);
}
