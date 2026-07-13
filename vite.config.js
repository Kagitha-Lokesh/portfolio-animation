import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Get all sorted files in frames_24fps
const framesDir = path.resolve(__dirname, 'frames_24fps')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-frames',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Dynamic Manifest API: reads directory contents on-the-fly to prevent stale cache bugs
          if (req.url === '/frames/manifest.json') {
            let frameFiles = []
            if (fs.existsSync(framesDir)) {
              frameFiles = fs.readdirSync(framesDir)
                .filter(f => f.endsWith('.jpg'))
                .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
            }
            
            const manifest = {
              frameCount: frameFiles.length,
              width: 1920,
              height: 1080,
              fps: 12,
              frames: frameFiles
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(manifest));
            return;
          }

          if (req.url.startsWith('/frames/')) {
            const cleanUrl = req.url.split('?')[0]; // strip query strings
            const fileName = cleanUrl.slice(8); // remove leading '/frames/'
            const filePath = path.join(framesDir, fileName);

            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'image/jpeg');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          }
          next();
        });
      }
    }
  ]
})
