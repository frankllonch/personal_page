import { createRequire } from 'node:module';
import { mkdir, rm } from 'node:fs/promises';
const sharp = createRequire(import.meta.url)('sharp');

const SRC = 'assets-src/dream-14';
const OUT = 'public/loader';
const REF = 16;
// Only frames 16..29 show the complete car (measured: constant 2200x1700 bbox).
// Outside that range it is the same rigid body clipped by the canvas edge, so
// CSS reproduces entry/exit instead of shipping ~34 redundant frames.
// 16/19/22 are the "cruising" pose (they differ only by hand-drawn boil);
// 23..29 are the driver raising an arm to wave, every one distinct.
const FRAMES = [16, 19, 22, 23, 24, 25, 26, 27, 28, 29];
const CROP_W = 2240, CROP_H = 1740, CROP_Y = 320, BASE_X = 130;
const TARGET_W = 900, QUALITY = 58;
const WHITE = 225;
// The art is really 5 flat colours; the rest is encoder noise that wrecks
// compression. Posterise at full res, then let the downscale rebuild clean
// antialiasing.
const PAL = [[255,255,255],[255,199,0],[0,0,0],[242,226,226],[255,0,0]];

const grey = async f => {
  const { data, info } = await sharp(`${SRC}/frame_${String(f).padStart(2,'0')}.png`)
    .greyscale().raw().toBuffer({ resolveWithObject: true });
  return { d: data, W: info.width };
};

// The car advances ~109.5px/frame, alternating 109/110. Lock each frame to the
// reference by correlation so the sprite box never drifts — otherwise the car
// visibly jitters during playback.
const ref = await grey(REF);
async function offsetOf(f) {
  if (f === REF) return 0;
  const cur = await grey(f);
  const guess = Math.round((f - REF) * 109.5);
  let best = { dx: guess, m: Infinity };
  for (let dx = guess - 8; dx <= guess + 8; dx++) {
    let sad = 0, n = 0;
    for (let y = 400; y < 2050; y += 3)
      for (let x = 200; x < 3400; x += 3) {
        const xb = x + dx;
        if (xb < 0 || xb >= cur.W) continue;
        sad += Math.abs(ref.d[y * ref.W + x] - cur.d[y * cur.W + xb]); n++;
      }
    const m = sad / n;
    if (m < best.m) best = { dx, m };
  }
  return best.dx;
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

let total = 0;
const manifest = [];
for (let i = 0; i < FRAMES.length; i++) {
  const f = FRAMES[i];
  const dx = await offsetOf(f);

  const { data, info } = await sharp(`${SRC}/frame_${String(f).padStart(2,'0')}.png`)
    .extract({ left: BASE_X + dx, top: CROP_Y, width: CROP_W, height: CROP_H })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  for (let p = 0; p < W * H; p++) {
    const r = data[p*C], g = data[p*C+1], b = data[p*C+2];
    let bi = 0, bd = Infinity;
    for (let k = 0; k < PAL.length; k++) {
      const d = (r-PAL[k][0])**2 + (g-PAL[k][1])**2 + (b-PAL[k][2])**2;
      if (d < bd) { bd = d; bi = k; }
    }
    data[p*C] = PAL[bi][0]; data[p*C+1] = PAL[bi][1]; data[p*C+2] = PAL[bi][2];
  }

  // Flood fill inward from the border: only white connected to the edge is
  // removed, so the white cabin interior (enclosed by the car's outline) stays.
  const bg = new Uint8Array(W * H);
  const stack = new Int32Array(W * H);
  let sp = 0;
  const lum = p => (data[p*C]*299 + data[p*C+1]*587 + data[p*C+2]*114) / 1000;
  const push = p => { if (!bg[p] && lum(p) >= WHITE) { bg[p] = 1; stack[sp++] = p; } };
  for (let x = 0; x < W; x++) { push(x); push((H-1)*W + x); }
  for (let y = 0; y < H; y++) { push(y*W); push(y*W + W - 1); }
  while (sp > 0) {
    const p = stack[--sp], x = p % W, y = (p / W) | 0;
    if (x > 0) push(p-1);
    if (x < W-1) push(p+1);
    if (y > 0) push(p-W);
    if (y < H-1) push(p+W);
  }
  for (let p = 0; p < W * H; p++) if (bg[p]) data[p*C+3] = 0;

  const name = `car-${String(i).padStart(2,'0')}.webp`;
  const r2 = await sharp(data, { raw: { width: W, height: H, channels: C } })
    .resize({ width: TARGET_W, kernel: 'lanczos3' })
    .webp({ quality: QUALITY, alphaQuality: 85, effort: 6 })
    .toFile(`${OUT}/${name}`);

  total += r2.size;
  manifest.push({ name, w: r2.width, h: r2.height });
  console.log(`${name}  ${String(r2.size).padStart(6)}B  ${r2.width}x${r2.height}  src=frame_${f} dx=${dx}`);
}
console.log(`\nTOTAL ${(total/1024).toFixed(1)} KB · ${FRAMES.length} frames · sprite ${manifest[0].w}x${manifest[0].h}`);
