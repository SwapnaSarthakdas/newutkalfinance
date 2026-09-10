import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleApiRequest } from './server/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = 5173;

process.on('uncaughtException', (err) => {
  console.error('Server error:', err);
});

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle Backend REST API Routes
  if (req.url.startsWith('/api/')) {
    return handleApiRequest(req, res);
  }

  let rawPath = decodeURI(req.url.split('?')[0]);
  let cleanPath = rawPath.replace(/^[\/\\]+/, '');
  if (!cleanPath || cleanPath === 'index.html') {
    cleanPath = 'index.html';
  }

  let filePath = path.join(DIST_DIR, cleanPath);
  const ext = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If client requested a static asset with an extension (e.g. .js, .css, images), return 404
      if (ext && ext !== '.html') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      // Otherwise fallback to index.html for Single Page App client routing
      filePath = path.join(DIST_DIR, 'index.html');
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      if (ext === '.html') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

// Validate dist directory
if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
  console.warn('\n[WARNING] Compiled production assets not found in dist/.');
  console.warn('Run "npm run build" to compile the latest frontend.\n');
}

server.on('error', async (err) => {
  if (err.code === 'EADDRINUSE') {
    try {
      const checkRes = await fetch(`http://localhost:${PORT}/`, { signal: AbortSignal.timeout(1500) });
      if (checkRes.ok) {
        console.log('\n======================================================');
        console.log('   UTKAL FINANCE IS ALREADY RUNNING ON PORT ' + PORT);
        console.log('======================================================');
        console.log(`Localhost: http://localhost:${PORT}/`);
        console.log('======================================================\n');
        if (process.env.OPEN_BROWSER === 'true' || process.argv.includes('--open')) {
          const cmd = process.platform === 'win32' ? `start http://localhost:${PORT}/` : `open http://localhost:${PORT}/`;
          const { exec } = await import('child_process');
          exec(cmd);
        }
        process.exit(0);
      }
    } catch {}

    console.error(`\n[ERROR] Port ${PORT} is already in use by another process.`);
    console.error(`Please close any existing terminal running on port ${PORT} or restart.\n`);
    process.exit(1);
  } else {
    console.error('Server failed to start:', err);
    process.exit(1);
  }
});

// Listening without HOST binds dual-stack to both IPv4 (0.0.0.0, 127.0.0.1) and IPv6 (::, ::1/localhost)
server.listen(PORT, () => {
  console.log('\n======================================================');
  console.log('   NEW UTKAL FINANCE - APPLICATION SERVER ACTIVE      ');
  console.log('======================================================');
  console.log(`Port:      ${PORT}`);
  console.log(`Localhost: http://localhost:${PORT}/`);
  console.log(`Network:   http://127.0.0.1:${PORT}/`);
  console.log('======================================================\n');

  if (process.env.OPEN_BROWSER === 'true' || process.argv.includes('--open')) {
    const cmd = process.platform === 'win32' ? `start http://localhost:${PORT}/` : `open http://localhost:${PORT}/`;
    import('child_process').then(({ exec }) => {
      exec(cmd);
    }).catch(() => {});
  }
});
