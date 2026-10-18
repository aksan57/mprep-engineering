// Converts every PNG/JPG under public/assets to WebP and records intrinsic
// sizes in data/image-sizes.json so <img> tags can reserve space (no layout shift).
// Run after adding or replacing images:  npm run images
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const assets = path.join(root, 'public', 'assets');
const sizes = {};

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { await walk(full); continue; }
    const ext = path.extname(entry.name).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue;
    const webPath = '/' + path.relative(path.join(root, 'public'), full).split(path.sep).join('/');
    if (ext === '.webp') {
      const m = await sharp(full).metadata();
      sizes[webPath] = [m.width, m.height];
      continue;
    }
    const out = full.slice(0, -ext.length) + '.webp';
    // Simulation screenshots carry legends and thin mesh lines: keep quality high.
    const info = await sharp(full).webp({ quality: 86, effort: 6 }).toFile(out);
    sizes[webPath.slice(0, -ext.length) + '.webp'] = [info.width, info.height];
    console.log(`${webPath} → ${(info.size / 1024).toFixed(0)} KB`);
  }
}

await walk(assets);
const sorted = Object.fromEntries(Object.entries(sizes).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(path.join(root, 'data', 'image-sizes.json'), JSON.stringify(sorted, null, 2) + '\n');
console.log(`Wrote ${Object.keys(sorted).length} entries to data/image-sizes.json`);
