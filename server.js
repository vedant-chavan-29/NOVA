import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import app from './server/server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 5173;

// Serve static frontend assets from dist folder
app.use(express.static(DIST_DIR));

// SPA Fallback for client-side routing
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(DIST_DIR, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Production build not found. Please run "npm run build" first.');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
================================================================
🚀 AgriLink Master Full-Stack Server Running (Frontend + Backend)
================================================================
🌐 Web Portal:    http://localhost:${PORT}
📡 Backend API:   http://localhost:${PORT}/api/data
🗄️ Database:      server/database.json
👑 Super Admin:   vedantkchavan2006@gmail.com / 8482941628
================================================================
  `);
});
