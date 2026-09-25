import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('dist/index.html not found! Run build first.');
  process.exit(1);
}

// 1. Copy 404.html for arbitrary unknown routes
const notFoundPath = path.join(distDir, '404.html');
fs.copyFileSync(indexHtmlPath, notFoundPath);
console.log('✓ Generated dist/404.html');

// 2. Generate static route directories with index.html for direct GitHub Pages HTTP 200 access
const routes = [
  'podforge',
  'dockforge',
  'commitforge',
  'roadmap',
  'practice',
  'labs',
  'ide',
  'discover',
  'conflict-arena',
  'hospital',
  'break-it',
  'two-dev',
  'undo-lab',
  'capstone',
  'config-lab',
];

for (const route of routes) {
  const routeDir = path.join(distDir, route);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  fs.copyFileSync(indexHtmlPath, path.join(routeDir, 'index.html'));
}

console.log(`✓ Generated ${routes.length} static route folders for GitHub Pages direct navigation.`);
