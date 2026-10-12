import { open, readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * The gallery's data: content/artwork.json, resolved against public/artwork/.
 *
 * The JSON holds only what a person would want to type — title, description,
 * size, the filenames. Everything the layout needs beyond that is read from
 * the files themselves here, at build time: the grid draws each tile at the
 * picture's own proportions, and typing those by hand is exactly the kind of
 * field that drifts out of date the first time a file is swapped.
 *
 * Images are measured with sharp. Videos are measured by reading the MP4/MOV
 * container's own track header — no ffmpeg, so it works on the build server
 * too. WebM carries its size in a different format and falls back to 16:9.
 *
 * Only ever imported from a Server Component. It runs during `next build` (the
 * gallery page is static), so none of this ships to the browser.
 */

export type MediaKind = "image" | "video";

export interface Media {
  readonly kind: MediaKind;
  readonly src: string;
  readonly width: number;
  readonly height: number;
}

export type ArtworkType = "painting" | "animation";

export interface Artwork {
  /** Stable id for URLs and keys, derived from the first filename. */
  readonly slug: string;
  readonly title: string;
  readonly description?: string;
  /** As written in the JSON, e.g. "60 × 80 cm". Displayed, never parsed. */
  readonly size?: string;
  readonly year?: number;
  /** What the filter groups by. Set in the JSON, else inferred from the files. */
  readonly type: ArtworkType;
  /** What the grid shows: always the first file. */
  readonly cover: Media;
  /** Every file in order, the cover included, for the lightbox. */
  readonly media: readonly Media[];
}

interface Entry {
  files?: unknown;
  /** Older shape: a single file. Still accepted. */
  file?: unknown;
  title?: unknown;
  description?: unknown;
  size?: unknown;
  year?: unknown;
  type?: unknown;
}

const ROOT = process.cwd();
const JSON_PATH = path.join(ROOT, "content", "artwork.json");
const IMAGE_DIR = path.join(ROOT, "public", "artwork");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const VIDEO_EXT = new Set([".mp4", ".m4v", ".mov", ".webm"]);

const slugify = (file: string) =>
  file
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "work";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** The URL a file in public/artwork is served at. Encoded: a `#`, `?` or `%`
    in a filename would otherwise be read as part of the URL, not the name. */
const publicUrl = (name: string) => `/artwork/${encodeURIComponent(name)}`;

/* ------------------------------------------------------------- images */

/**
 * `scripts/build-artwork.mjs` writes a `<name>.opt.webp` beside any image that
 * is too large to serve from directly. When it exists it is what the page
 * uses; the JSON goes on naming the original, so adding work stays simple.
 */
async function servedName(name: string): Promise<string> {
  if (/\.opt\.webp$/i.test(name)) return name;
  // Named after the whole filename, so `a.jpg` and `a.png` keep separate twins.
  const twin = name + ".opt.webp";
  return stat(path.join(IMAGE_DIR, twin)).then(() => twin, () => name);
}

async function imageMedia(original: string): Promise<Media> {
  const name = await servedName(original);
  const meta = await sharp(path.join(IMAGE_DIR, name)).metadata();
  // A phone photo of a painting often carries its rotation in EXIF rather than
  // in the pixels. Browsers honour it when drawing, so the aspect the grid
  // reserves has to be the rotated one or every portrait tile would be laid
  // out landscape with the picture letterboxed inside it.
  const rotated = (meta.orientation ?? 1) >= 5;
  const width = rotated ? meta.height : meta.width;
  const height = rotated ? meta.width : meta.height;
  if (!width || !height) throw new Error("could not read its dimensions");
  return { kind: "image", src: publicUrl(name), width, height };
}

/* ------------------------------------------------------------- videos */

/** Largest `moov` we are willing to read into memory. Real ones are kilobytes. */
const MOOV_LIMIT = 64 * 1024 * 1024;

/**
 * Width and height of the first video track in an ISO base-media file (MP4,
 * M4V, MOV all share the layout): walk the top-level boxes to `moov`, then
 * inside it to each `trak`'s `tkhd`, whose last two fields are the track's
 * presentation size as 16.16 fixed point. The matrix just before them carries
 * the rotation phones record instead of rotating the pixels; a 90° or 270°
 * matrix means the displayed width and height are the other way round.
 */
async function isoBmffDims(file: string): Promise<{ width: number; height: number } | undefined> {
  const fh = await open(file, "r");
  try {
    const { size } = await fh.stat();
    const header = Buffer.alloc(16);
    let offset = 0;
    while (offset + 8 <= size) {
      await fh.read(header, 0, 16, offset);
      let boxSize: number = header.readUInt32BE(0);
      const type = header.toString("latin1", 4, 8);
      let headerLen = 8;
      if (boxSize === 1) {
        boxSize = Number(header.readBigUInt64BE(8));
        headerLen = 16;
      } else if (boxSize === 0) {
        boxSize = size - offset; // box runs to the end of the file
      }
      if (boxSize < headerLen) return undefined; // corrupt
      if (type === "moov") {
        if (boxSize > MOOV_LIMIT) return undefined;
        const moov = Buffer.alloc(boxSize - headerLen);
        await fh.read(moov, 0, moov.length, offset + headerLen);
        return dimsFromMoov(moov);
      }
      offset += boxSize;
    }
    return undefined;
  } finally {
    await fh.close();
  }
}

function dimsFromMoov(moov: Buffer): { width: number; height: number } | undefined {
  for (const trak of boxes(moov, "trak")) {
    for (const tkhd of boxes(trak, "tkhd")) {
      const version = tkhd[0];
      // fullbox(4) + times/ids (v0: 20, v1: 32) + reserved(8) layer(2) alt(2) volume(2) reserved(2)
      const matrixAt = 4 + (version === 1 ? 32 : 20) + 16;
      if (tkhd.length < matrixAt + 36 + 8) continue;
      const width = tkhd.readUInt32BE(matrixAt + 36) / 65536;
      const height = tkhd.readUInt32BE(matrixAt + 40) / 65536;
      if (!width || !height) continue; // audio tracks have none
      // Matrix elements a and d are 0 when the track is rotated a quarter turn.
      const a = tkhd.readInt32BE(matrixAt);
      const d = tkhd.readInt32BE(matrixAt + 16);
      const rotated = a === 0 && d === 0;
      return rotated
        ? { width: Math.round(height), height: Math.round(width) }
        : { width: Math.round(width), height: Math.round(height) };
    }
  }
  return undefined;
}

/** Direct children of a box payload with the given type. */
function* boxes(buf: Buffer, want: string): Generator<Buffer> {
  let offset = 0;
  while (offset + 8 <= buf.length) {
    let boxSize: number = buf.readUInt32BE(offset);
    const type = buf.toString("latin1", offset + 4, offset + 8);
    let headerLen = 8;
    if (boxSize === 1 && offset + 16 <= buf.length) {
      boxSize = Number(buf.readBigUInt64BE(offset + 8));
      headerLen = 16;
    } else if (boxSize === 0) boxSize = buf.length - offset;
    if (boxSize < headerLen) return;
    if (type === want) yield buf.subarray(offset + headerLen, offset + boxSize);
    offset += boxSize;
  }
}

async function videoMedia(name: string, label: string): Promise<Media> {
  const file = path.join(IMAGE_DIR, name);
  await stat(file); // exists and is readable; never pull the whole video into memory
  let dims: { width: number; height: number } | undefined;
  if (path.extname(name).toLowerCase() !== ".webm") {
    try {
      dims = await isoBmffDims(file);
    } catch {
      dims = undefined;
    }
  }
  if (!dims) {
    console.warn(
      `[artwork] ${label}: could not read the size of "${name}", assuming 16:9 for its tile. ` +
      `An .mp4 (H.264) carries its size and plays everywhere.`,
    );
    dims = { width: 16, height: 9 };
  }
  return { kind: "video", src: publicUrl(name), ...dims };
}

/* --------------------------------------------------------------- load */

export async function loadArtworks(): Promise<Artwork[]> {
  const raw = JSON.parse(await readFile(JSON_PATH, "utf8")) as { artworks?: Entry[] };
  const entries = Array.isArray(raw.artworks) ? raw.artworks : [];

  const out: Artwork[] = [];
  const seen = new Set<string>();

  for (const [n, entry] of entries.entries()) {
    const label = str(entry.title) ? `"${str(entry.title)}"` : `entry #${n + 1}`;

    const listed: unknown[] = Array.isArray(entry.files) ? entry.files : entry.file ? [entry.file] : [];
    // basename: a filename is a filename, never a path out of public/artwork.
    const names = listed.filter((f): f is string => typeof f === "string" && f.trim() !== "").map((f) => path.basename(f.trim()));
    if (!names.length) {
      console.warn(`[artwork] ${label} lists no files — skipped`);
      continue;
    }

    const media: Media[] = [];
    for (const name of names) {
      const ext = path.extname(name).toLowerCase();
      try {
        if (IMAGE_EXT.has(ext)) media.push(await imageMedia(name));
        else if (VIDEO_EXT.has(ext)) media.push(await videoMedia(name, label));
        else console.warn(`[artwork] ${label}: "${name}" is not an image or video type the gallery knows — skipped`);
      } catch (err) {
        console.warn(`[artwork] ${label}: skipping "${name}": ${(err as Error).message}`);
      }
    }
    if (!media.length) {
      console.warn(`[artwork] ${label}: none of its files could be used — skipped`);
      continue;
    }

    // Two entries leading with the same file would collide on slug and key.
    const base = slugify(names[0]!);
    let slug = base;
    for (let i = 2; seen.has(slug); i++) slug = `${base}-${i}`;
    seen.add(slug);

    const typed = str(entry.type).toLowerCase();
    const type: ArtworkType =
      typed === "animation" || typed === "painting"
        ? typed
        : media.some((m) => m.kind === "video") ? "animation" : "painting";

    const year = typeof entry.year === "number" ? entry.year : Number.parseInt(str(entry.year), 10);

    out.push({
      slug,
      title: str(entry.title) || "Untitled",
      description: str(entry.description) || undefined,
      size: str(entry.size) || undefined,
      year: Number.isFinite(year) ? year : undefined,
      type,
      cover: media[0]!,
      media,
    });
  }
  return out;
}
