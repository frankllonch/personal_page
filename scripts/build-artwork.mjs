import { createRequire } from 'node:module';
import { readdir, stat, mkdir } from 'node:fs/promises';
import path from 'node:path';
const sharp = createRequire(import.meta.url)('sharp');

/**
 * Optimised twins for the gallery's images.
 *
 * public/artwork holds whatever was exported — PNGs of several megabytes at
 * 4000px+. The image optimiser has to open one of those for every size it
 * serves, which is what makes a first visit slow. For each image beyond the
 * limits below this writes `<name>.opt.webp` next to it, no wider than the
 * largest size the page ever shows, and lib/artwork.ts prefers the twin when
 * it exists. The JSON keeps naming the original, so nothing changes for
 * whoever adds work.
 *
 * Runs as `prebuild`, so the deploy generates them; they are not committed.
 * Skips anything already up to date, so a rebuild with no new art costs ~0.
 */

const DIR = 'public/artwork';
const MAX_EDGE = 2400;          // the lightbox never shows more than this
const MAX_BYTES = 1.2 * 1024 * 1024;
const QUALITY = 84;
const IMAGE = /\.(jpe?g|png|webp|avif|tiff?)$/i;

await mkdir(DIR, { recursive: true });
const names = (await readdir(DIR)).filter((n) => IMAGE.test(n) && !/\.opt\.webp$/i.test(n));

let made = 0, kept = 0, before = 0, after = 0;
for (const name of names) {
  const src = path.join(DIR, name);
  const out = path.join(DIR, name + '.opt.webp');   // after the whole name: a.jpg and a.png stay apart
  const s = await stat(src);
  const meta = await sharp(src).metadata();
  const edge = Math.max(meta.width ?? 0, meta.height ?? 0);
  if (edge <= MAX_EDGE && s.size <= MAX_BYTES) continue;   // small enough as it is

  const fresh = await stat(out).then((o) => o.mtimeMs >= s.mtimeMs, () => false);
  if (fresh) { kept++; continue; }

  const info = await sharp(src)
    .rotate()                                   // bake EXIF orientation in
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(out);
  made++; before += s.size; after += info.size;
  console.log(`${name}  ${(s.size / 1048576).toFixed(1)} MB ${meta.width}x${meta.height}  ->  ${(info.size / 1048576).toFixed(2)} MB ${info.width}x${info.height}`);
}
console.log(`\n${made} written, ${kept} already current, ${names.length - made - kept} small enough to leave alone`
  + (made ? `  ·  ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB` : ''));
