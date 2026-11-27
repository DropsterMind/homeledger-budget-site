// HomeLedger v2 — a tiny static server for local testing only.
// Serves the files under app/ on http://localhost:8080 (or --port N).
// It refuses any path that escapes app/ and only serves known types.

import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const root = join(here, 'app');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const args = process.argv.slice(2);
let port = 8080;
const eqArg = args.find((a) => a.startsWith('--port='));
if (eqArg) {
  port = Number(eqArg.split('=')[1]);
} else {
  const i = args.indexOf('--port');
  if (i >= 0 && args[i + 1]) port = Number(args[i + 1]);
}

createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url || '/', 'http://x').pathname);
  const file = normalize(join(root, path === '/' ? 'index.html' : path));
  if (!file.startsWith(root) || !existsSync(file) || !TYPES[extname(file)]) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] });
  res.end(readFileSync(file));
}).listen(port, () => console.log(`HomeLedger on http://localhost:${port}`));
