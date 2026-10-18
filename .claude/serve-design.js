// Minimal static server for local review.
//   node .claude/serve-design.js                → the HTML design prototype on :5173
//   node .claude/serve-design.js out 4173       → the built site (next build output) on :4173
const http = require('http');
const fs = require('fs');
const path = require('path');

const project = path.resolve(__dirname, '..');
const root = process.argv[2] ? path.resolve(project, process.argv[2]) : path.join(project, 'design', 'design_handoff_engineering_site');
const port = Number(process.argv[3] || process.env.PORT) || 5173;
const fallback = process.argv[2] ? 'index.html' : 'Engineering Consultancy Site.dc.html';
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.glb': 'model/gltf-binary', '.wasm': 'application/wasm',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.ico': 'image/x-icon', '.md': 'text/plain; charset=utf-8',
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += p === '/' ? fallback : 'index.html';
  let file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';
  fs.readFile(file, (err, data) => {
    if (err) {
      const nf = path.join(root, '404.html');
      res.writeHead(404, { 'Content-Type': types['.html'] });
      return res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'Not found');
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, () => console.log(`Serving ${root} on http://localhost:${port}`));
