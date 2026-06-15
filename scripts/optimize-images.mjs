#!/usr/bin/env node
/**
 * Image optimiser for the Labelex site.
 *
 * Converts photographic PNG/JPEG images to WebP at high quality, never
 * enlarging, only trimming wasted resolution. Logos and favicons are skipped.
 *
 * Usage:
 *   node scripts/optimize-images.mjs                 # optimise ALL content images
 *   node scripts/optimize-images.mjs <file> [file…]  # optimise only the given files
 *   npm run optimize                                 # same as the no-arg form
 *
 * Each <name>.png / <name>.jpg becomes <name>.webp alongside it. The original
 * is left in place (recoverable from git) — remove it once HTML references are
 * updated to the .webp version.
 */
import sharp from 'sharp';
import { stat, readdir } from 'node:fs/promises';
import { join, extname, dirname, basename } from 'node:path';

const QUALITY = 90;      // visually ~identical to source
const MAX_EDGE = 1600;   // never upscale; only cap oversized images
const SKIP_DIRS = ['img/ui', 'img/logo']; // favicon + logo stay as-is
const ROOT = 'img';

const kb = (n) => (n / 1024).toFixed(0) + ' KB';

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) out.push(...await walk(p));
    else if (/\.(png|jpe?g)$/i.test(entry.name)) out.push(p);
  }
  return out;
}

async function optimise(file) {
  const norm = file.replace(/\\/g, '/');
  if (SKIP_DIRS.some((d) => norm.startsWith(d))) return null;
  const out = join(dirname(norm), basename(norm, extname(norm)) + '.webp').replace(/\\/g, '/');
  const before = (await stat(norm)).size;
  const meta = await sharp(norm).metadata();
  await sharp(norm)
    .resize({ width: Math.min(meta.width, MAX_EDGE), height: Math.min(meta.height, MAX_EDGE), fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(out);
  const after = (await stat(out)).size;
  console.log(`${norm}\n  ${kb(before)} -> ${kb(after)}  (${(100 - after / before * 100).toFixed(0)}% smaller)  -> ${out}`);
  return { before, after };
}

const args = process.argv.slice(2);
const files = args.length ? args : await walk(ROOT);
let tb = 0, ta = 0, n = 0;
for (const f of files) {
  const r = await optimise(f);
  if (r) { tb += r.before; ta += r.after; n++; }
}
console.log(`\nTotal: ${n} images  ${kb(tb)} -> ${kb(ta)}  (${(100 - ta / tb * 100).toFixed(0)}% smaller)`);
