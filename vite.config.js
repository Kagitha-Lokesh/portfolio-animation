import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Get all sorted files in frames_24fps
const framesDir = path.resolve(__dirname, 'frames_24fps')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
    react(),
    {
      name: 'serve-frames',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Local proxy for Contact Form API Serverless Function
          if (req.url === '/api/contact' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', async () => {
              try {
                const { default: handler } = await import('./api/contact.js');
                req.body = body ? JSON.parse(body) : {};

                // Add Vercel-like helper methods to response object
                res.status = (code) => {
                  res.statusCode = code;
                  return res;
                };
                res.json = (data) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return res;
                };

                await handler(req, res);
              } catch (err) {
                console.error('Local contact API error:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
            return;
          }

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
  ],
  build: {
    rollupOptions: {
      output: {
        minify: mode === 'production' ? {
          compress: {
            dropConsole: true,
          },
        } : false,
        manualChunks(id) {
          if (id.includes('src/renderers/desktop/DesktopRenderer')) {
            return 'renderer-desktop';
          }
          if (id.includes('src/renderers/mobile/MobileRenderer')) {
            return 'renderer-mobile';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
        }
      }
    }
  }
}
})
