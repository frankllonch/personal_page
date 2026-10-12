"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Artwork, ArtworkType, Media } from "@/lib/artwork";
import "./gallery.css";

/**
 * The gallery, ported from the Claudia Valsells site's /artwork/ page.
 *
 * Three things, each a port of one of that site's client modules:
 *
 * - the grid: justified rows that fill the width, each resolving to one
 *   height, with three densities the reader chooses (`controls.ts`) — plus a
 *   filter between paintings and animations;
 * - the pointer: over a work it becomes the work's name (`cursor.ts`);
 * - the lightbox: a work opens over the sheet, the page blurred behind it, and
 *   you move between works — and here between the files of one work — without
 *   a page load (`lightbox.ts`).
 *
 * The original's opening pile, year rail and to-scale switch are deliberately
 * not here: this gallery starts laid out. Everything is an enhancement — the
 * tiles are real links to `#slug`, which opens the work on arrival, and the
 * grid is complete and readable with scripting off.
 */

/* ------------------------------------------------------------- tunables */

/**
 * Density levels. `unit` is the row height each tile starts from, in px; rows
 * then grow to fill the width, so the actual height lands a little above it.
 * The original labels these with how many of its 154 works fit on a screen;
 * for a personal collection that number means nothing, so these are words.
 */
export const DENSITIES = [
  { unit: 300, label: "Large" },
  { unit: 200, label: "Medium" },
  { unit: 130, label: "Small" },
] as const;
export const DEFAULT_DENSITY = 2;

const KINDS = [
  { key: "all", label: "All" },
  { key: "painting", label: "Paintings" },
  { key: "animation", label: "Animations" },
] as const;
type KindFilter = (typeof KINDS)[number]["key"];

/** Must match `.gal-lightbox-plate`'s transition in gallery.css. */
const FADE = 420;
/** Must match `.gal-lightbox`'s opacity transition in gallery.css. */
const CLOSE = 620;
const SWIPE = 48;
/** Leading tiles to load eagerly — the first screen or so at the default density. */
const EAGER = 12;
/**
 * The most a justified row grows past its tiles' starting size. A row only
 * wraps when the next tile would not fit, so the slack it spreads is at most
 * one tile wide; simulated across the densities and widths, rows stay under
 * this at every desktop size.
 */
const ROW_GROWTH = 1.75;
const PLATE_SIZES = "(max-width: 900px) 92vw, 60vw";
/** What can take focus inside the lightbox, for the Tab trap. */
const FOCUSABLE = 'button:not([disabled]), [href], video[controls], [tabindex]:not([tabindex="-1"])';

/**
 * The width to tell the browser a tile will be: its starting size at the
 * current density, times the most a row grows. A fixed `33vw` asked for a
 * 1920px cut of every 200px tile at Small on a 2x screen. On a phone every row
 * holds one tile, so there it is the viewport.
 */
const tileSizes = (aspect: number, unit: number) =>
  `(max-width: 599px) 100vw, ${Math.round(aspect * unit * ROW_GROWTH)}px`;

const isPlainClick = (e: React.MouseEvent) =>
  !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0;

// React does not reflect `muted` as an attribute on first render, which is
// what autoplay policies check; set it on the node itself.
const mute = (el: HTMLVideoElement | null) => {
  if (el) { el.muted = true; el.defaultMuted = true; }
};

/** `#slug` or `#slug:n` — the URL a work is open at — as a work and a file. */
const parseHash = (): { slug: string; fi: number } | null => {
  const m = /^#([a-z0-9-]+)(?::(\d+))?$/.exec(location.hash);
  return m ? { slug: m[1]!, fi: m[2] ? Math.max(0, Number(m[2]) - 1) : 0 } : null;
};

/**
 * Every history write goes through here. WebKit throws past 100 writes in
 * 30 s (Chrome silently drops them); a lost hash is harmless, the next settled
 * step rewrites it, but a throw mid-step would leave the lightbox half moved.
 *
 * The state is a plain object on purpose. Next patches push/replaceState: an
 * entry without its own markers gets them copied in and the router's URL is
 * synced to ours, whereas an entry that already carries them is written as
 * is — and the router, still believing the page sits at /gallery, would put
 * that URL back the next time anything (a link prefetch, say) updates it.
 */
const writeHistory = (method: "pushState" | "replaceState", state: object, url: string) => {
  try {
    history[method](state, "", url);
  } catch {
    /* throttled */
  }
};

/* ------------------------------------------------------------ component */

interface Position { ai: number; fi: number }

export default function Gallery({ items }: { items: readonly Artwork[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [kind, setKind] = useState<KindFilter>("all");
  const [hasCursor, setHasCursor] = useState(false);
  /** Whether the grid's animations run. Off when the system asks for less motion, and a button either way. */
  const [motion, setMotion] = useState(true);

  /** The works the filter lets through, in order. Everything below indexes into this. */
  const visible = useMemo(
    () => (kind === "all" ? items : items.filter((a) => a.type === (kind as ArtworkType))),
    [items, kind],
  );
  /** Every file of every visible work, in reading order — what the arrows step through. */
  const seq = useMemo<Position[]>(
    () => visible.flatMap((a, ai) => a.media.map((_, fi) => ({ ai, fi }))),
    [visible],
  );
  const firstOf = useCallback((ai: number) => seq.findIndex((p) => p.ai === ai), [seq]);
  const hasVideoTiles = visible.some((a) => a.cover.kind === "video");

  /* lightbox state: `shown` is what the plate draws, and lags `target` by one fade */
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [changing, setChanging] = useState(false);
  const [shown, setShown] = useState(0);
  const target = useRef(0);
  const ticket = useRef(0);
  const pending = useRef(0);
  const teardown = useRef(0);
  const shownRef = useRef(false);
  /** The tile to hand focus back to once the grid is live again. */
  const restoreTo = useRef("");

  const unit = DENSITIES[density]!.unit;

  useEffect(() => {
    setMotion(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  /* ------------------------------------------------- video tiles */

  // Animations in the grid play only while on screen: a muted loop costs
  // decode time whether or not anyone can see it. While a work is open the
  // grid is blurred behind it, so everything pauses; reconnecting the observer
  // on close replays its initial callbacks and resumes whatever is in view.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const videos = [...root.querySelectorAll<HTMLVideoElement>(".gal-tile video")];
    if (!videos.length) return;
    if (mounted || !motion) {
      for (const v of videos) v.pause();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          // Mirrors the threshold the observer fires on: leaving, the crossing
          // reports a ratio just under it; arriving, just over.
          if (e.isIntersecting && e.intersectionRatio >= 0.25) void v.play().catch(() => undefined);
          else v.pause();
        }
      },
      { threshold: [0, 0.25] },
    );
    for (const v of videos) io.observe(v);
    return () => io.disconnect();
  }, [visible, mounted, motion]);

  /* ----------------------------------------------------------- cursor */

  useEffect(() => {
    const cursor = cursorRef.current;
    const label = labelRef.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!cursor || !label || !fine.matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Only now is it safe to take the arrow away over a tile: without this a
    // browser that never runs the script would leave people with no pointer.
    setHasCursor(true);

    let targetX = 0, targetY = 0, x = 0, y = 0;
    let active = false;
    let frame = 0;
    let placed = false;

    const tick = () => {
      // Lerp toward the pointer; the lag is what gives it weight.
      const ease = reduce.matches ? 1 : 0.2;
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      cursor.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      frame = Math.abs(targetX - x) > 0.1 || Math.abs(targetY - y) > 0.1 || active
        ? requestAnimationFrame(tick)
        : 0;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      // Start where the pointer already is, or the label swoops in from 0,0.
      if (!placed) { placed = true; x = targetX; y = targetY; }

      const usable = (event.target as Element | null)?.closest<HTMLElement>(".gal-tile") ?? null;
      const title = usable?.dataset.title ?? "";

      if (usable && title) {
        const year = usable.dataset.year;
        const text = year ? `${title}, ${year}` : title;
        if (label.textContent !== text) label.textContent = text;
        if (!active) { active = true; cursor.classList.add("is-visible"); }
        // Snap rather than trail while it is standing in for the pointer.
        x = targetX; y = targetY;
      } else if (active) {
        active = false;
        cursor.classList.remove("is-visible");
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onLeave = () => { active = false; cursor.classList.remove("is-visible"); };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      setHasCursor(false);
    };
  }, []);

  /* --------------------------------------------------------- lightbox */

  const hashFor = (i: number) => {
    const p = seq[i];
    if (!p) return "";
    const slug = visible[p.ai]!.slug;
    return `#${p.fi ? `${slug}:${p.fi + 1}` : slug}`;
  };

  const show = useCallback((index: number, animate: boolean) => {
    if (!seq.length) return;
    const wrapped = ((index % seq.length) + seq.length) % seq.length;
    if (wrapped === target.current && animate) return;
    target.current = wrapped;

    const mine = ++ticket.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The URL is written once a step has settled, not once per keypress: a
    // held arrow key repeats at ~30 Hz, well past what WebKit allows.
    const settle = () => {
      setShown(wrapped);
      setChanging(false);
      const hash = hashFor(wrapped);
      if (location.hash !== hash) writeHistory("replaceState", { gal: true }, hash);
    };
    if (!animate || reduce) { settle(); return; }
    // One transition per action, and only one in flight: a newer navigation
    // takes a new ticket and this one lapses instead of racing it.
    setChanging(true);
    window.clearTimeout(pending.current);
    pending.current = window.setTimeout(() => { if (mine === ticket.current) settle(); }, FADE);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seq, visible]);

  /**
   * Open a work at one of its files. `push` adds the lightbox's own history
   * entry, so Back closes it; it is false only when the entry already exists,
   * i.e. when Forward brought it back.
   */
  const open = useCallback((ai: number, fi = 0, push = true) => {
    const i = firstOf(ai);
    if (i < 0) return;
    const at = i + Math.min(Math.max(fi, 0), visible[ai]!.media.length - 1);
    // A close still counting down belongs to the work that was on screen
    // before this one, and would otherwise empty the plate under it.
    window.clearTimeout(teardown.current);
    shownRef.current = true;
    setMounted(true);
    document.documentElement.classList.add("gal-locked");
    target.current = -1;
    // The entry goes in before the hash is written, so it is the lightbox's
    // own entry that carries the work and the one beneath stays as it was.
    if (push) writeHistory("pushState", { gal: true }, hashFor(at));
    show(at, false);
    // Opened on the next frame so the fade has a value to start from.
    requestAnimationFrame(() => { if (shownRef.current) setIsOpen(true); });
    // Focus the dialog itself, not an arrow: a focused button draws a ring,
    // which read as the arrow being highlighted for no reason.
    requestAnimationFrame(() => boxRef.current?.focus({ preventScroll: true }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstOf, show, visible]);

  const close = useCallback((restore: boolean) => {
    if (!shownRef.current) return;
    shownRef.current = false;
    ticket.current++;
    window.clearTimeout(pending.current);
    window.clearTimeout(teardown.current);
    setIsOpen(false);
    setChanging(false);
    document.documentElement.classList.remove("gal-locked");
    // Held until the fade has finished, or the painting vanishes mid-close.
    teardown.current = window.setTimeout(() => setMounted(false), CLOSE);
    // Escape and Close leave history as they found it: the lightbox's entry
    // goes, and the popstate that follows finds nothing open and does nothing.
    if (restore) history.back();
    // The grid is inert until the dialog has gone; focus returns to the tile
    // once it is live again (the effect on `isOpen` below).
    const p = seq[target.current];
    restoreTo.current = (p && visible[p.ai]?.slug) ?? "";
  }, [seq, visible]);

  useEffect(() => {
    if (isOpen || !restoreTo.current) return;
    const slug = restoreTo.current;
    restoreTo.current = "";
    gridRef.current?.querySelector<HTMLElement>(`[data-slug="${CSS.escape(slug)}"]`)?.focus({ preventScroll: true });
  }, [isOpen]);

  useEffect(() => {
    // The dialog is modal: Tab cycles inside it. The grid and controls under
    // the veil are `inert` as well, but the top bar sits above the lightbox
    // and only this keeps the keyboard off it while a work is open.
    const trapTab = (e: KeyboardEvent) => {
      const box = boxRef.current;
      if (!box) return;
      const focusable = [...box.querySelectorAll<HTMLElement>(FOCUSABLE)]
        .filter((el) => el.getClientRects().length > 0);
      if (!focusable.length) { e.preventDefault(); return; }
      const first = focusable[0]!, last = focusable[focusable.length - 1]!;
      const active = document.activeElement;
      const inside = active instanceof HTMLElement && active !== box && box.contains(active);
      if (e.shiftKey ? !inside || active === first : !inside || active === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (!shownRef.current) return;
      if (e.key === "Escape") { close(true); return; }
      if (e.key === "Tab") { trapTab(e); return; }
      // A focused <video controls> owns the arrows — they seek — not the gallery.
      if (e.target instanceof HTMLVideoElement) return;
      if (e.key === "ArrowLeft") show(target.current - 1, true);
      else if (e.key === "ArrowRight") show(target.current + 1, true);
    };
    const onPop = () => {
      if (shownRef.current) { close(false); return; }
      // Forward, back onto a work's entry: reopen it without adding another.
      const h = parseHash();
      const ai = h ? visible.findIndex((a) => a.slug === h.slug) : -1;
      if (ai >= 0) open(ai, h!.fi, false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
    };
  }, [close, show, open, visible]);

  // Unmount only: a close still counting down must not outlive the page, and
  // the lock must not either. (Kept apart from the listeners above, whose
  // effect re-runs on every filter change.)
  useEffect(() => () => {
    window.clearTimeout(pending.current);
    window.clearTimeout(teardown.current);
    document.documentElement.classList.remove("gal-locked");
  }, []);

  // Arriving with a work in the URL — the tiles' own links, or a shared one —
  // opens it. The hash is first cleared off the entry we arrived on, so that
  // this open is like any other: its own entry on top, Back to close.
  useEffect(() => {
    const h = parseHash();
    const ai = h ? visible.findIndex((a) => a.slug === h.slug) : -1;
    if (ai < 0) return;
    writeHistory("replaceState", {}, location.pathname + location.search);
    open(ai, h!.fi);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swipe between files on touch — unless the drag began on the plate's
  // video, where it is a scrub on its native controls.
  const touch = useRef({ x: 0, y: 0, onVideo: false });
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0]!;
    touch.current = { x: t.clientX, y: t.clientY, onVideo: e.target instanceof HTMLVideoElement };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touch.current.onVideo) return;
    const dx = e.changedTouches[0]!.clientX - touch.current.x;
    const dy = e.changedTouches[0]!.clientY - touch.current.y;
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) show(target.current + (dx < 0 ? 1 : -1), true);
  };

  /* ----------------------------------------------------------- render */

  if (!items.length) {
    return (
      <div className="gal" ref={rootRef}>
        <div className="gal-empty">
          <div>
            Nothing here yet. Drop images or videos into <code>public/artwork/</code> and list them in{" "}
            <code>content/artwork.json</code>.
          </div>
        </div>
      </div>
    );
  }

  const pos = seq[shown] ?? seq[0];
  const art = pos ? visible[pos.ai] : undefined;
  const media = pos && art ? art.media[pos.fi] : undefined;

  return (
    <div ref={rootRef} className={`gal${hasCursor ? " has-cursor" : ""}`}>
      <h1 className="sr-only">Gallery</h1>

      <div className="gal-controls" inert={isOpen}>
        <div className="gal-control-group" role="group" aria-label="Grid size">
          {DENSITIES.map((d, i) => (
            <button
              key={d.unit}
              type="button"
              className={`gal-control${i === density ? " is-active" : ""}`}
              aria-pressed={i === density}
              onClick={() => setDensity(i)}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div className="gal-control-group" role="group" aria-label="Show">
          {KINDS.map((k) => (
            <button
              key={k.key}
              type="button"
              className={`gal-control${k.key === kind ? " is-active" : ""}`}
              aria-pressed={k.key === kind}
              onClick={() => setKind(k.key)}
            >
              {k.label}
            </button>
          ))}
        </div>
        {/* Looping video with no way to stop it fails anyone it distracts. */}
        {hasVideoTiles && (
          <div className="gal-control-group gal-control-group-end">
            <button type="button" className="gal-control" onClick={() => setMotion((m) => !m)}>
              {motion ? "Pause animations" : "Play animations"}
            </button>
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="gal-empty">
          <div>No {kind === "animation" ? "animations" : "paintings"} yet.</div>
        </div>
      ) : (
        <div
          ref={gridRef}
          className="gal-grid"
          inert={isOpen}
          style={{ "--gal-unit": `${unit}px` } as React.CSSProperties}
        >
          {visible.map((a, i) => {
            const aspect = a.cover.width / a.cover.height;
            return (
              <a
                key={a.slug}
                id={a.slug}
                className="gal-tile"
                href={`#${a.slug}`}
                style={{ "--a": aspect.toFixed(4) } as React.CSSProperties}
                data-title={a.title}
                data-year={a.year ?? ""}
                data-slug={a.slug}
                aria-label={`${a.title}${a.year ? `, ${a.year}` : ""}${a.type === "animation" ? " (animation)" : ""}${a.media.length > 1 ? `, ${a.media.length} files` : ""}`}
                onClick={(e) => {
                  // Modified clicks mean "open this elsewhere": leave them to the browser.
                  if (!isPlainClick(e)) return;
                  e.preventDefault();
                  open(i);
                }}
              >
                <TileMedia media={a.cover} alt={a.title} eager={i < EAGER} sizes={tileSizes(aspect, unit)} />
              </a>
            );
          })}
          {/* Soaks up the last row's free space, so two stragglers do not grow to
              fill a line meant for four. */}
          <div className="gal-grid-tail" aria-hidden="true" />
        </div>
      )}

      {/* Over a painting the pointer becomes its name. Decoration, never the only
          way to learn what a work is: the same title is the tile's accessible name. */}
      <div ref={cursorRef} className="gal-cursor" aria-hidden="true">
        <div ref={labelRef} className="gal-cursor-label" />
      </div>

      {mounted && pos && art && media && (
        <div
          ref={boxRef}
          tabIndex={-1}
          className={`gal-lightbox${isOpen ? " is-open" : ""}${changing ? " is-changing" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={art.title}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="gal-lightbox-veil" onClick={() => close(true)} />
          <button type="button" className="gal-lightbox-close" onClick={() => close(true)}>Close</button>
          <button type="button" className="gal-lightbox-nav gal-lightbox-prev" aria-label="Previous" onClick={() => show(target.current - 1, true)}>←</button>

          <div className="gal-lightbox-plate">
            {media.kind === "image" ? (
              <Image
                key={media.src}
                src={media.src}
                alt={art.title}
                width={media.width}
                height={media.height}
                sizes={PLATE_SIZES}
                priority
                draggable={false}
              />
            ) : (
              <video
                key={media.src}
                src={media.src}
                width={media.width}
                height={media.height}
                controls
                autoPlay
                loop
                playsInline
                preload="metadata"
                ref={mute}
              />
            )}
          </div>

          <div className="gal-lightbox-caption">
            <div className="gal-lightbox-title">{art.title}{art.year ? `, ${art.year}` : ""}</div>
            {art.description && <div className="gal-lightbox-desc">{art.description}</div>}
            {art.size && <div className="gal-lightbox-meta"><div>{art.size}</div></div>}
            {art.media.length > 1 && (
              <div className="gal-lightbox-thumbs" role="group" aria-label="Files of this work">
                {art.media.map((m, fi) => (
                  <button
                    key={m.src}
                    type="button"
                    className={`gal-lightbox-thumb${fi === pos.fi ? " is-active" : ""}`}
                    aria-label={`${m.kind === "video" ? "Video" : "Photo"} ${fi + 1} of ${art.media.length}`}
                    aria-pressed={fi === pos.fi}
                    onClick={() => show(firstOf(pos.ai) + fi, true)}
                  >
                    {m.kind === "image"
                      ? <Image src={m.src} alt="" width={m.width} height={m.height} sizes="48px" />
                      // `#t=` makes WebKit paint a first frame it would otherwise leave black.
                      : <video src={`${m.src}#t=0.001`} muted playsInline preload="metadata" ref={mute} />}
                  </button>
                ))}
              </div>
            )}
            <div className="gal-lightbox-count">
              {pos.ai + 1} of {visible.length}
              {art.media.length > 1 ? ` · ${pos.fi + 1} / ${art.media.length}` : ""}
            </div>
          </div>

          {/* Spoken when the work changes; outside the caption so the fade does not swallow it. */}
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {art.title}{art.year ? `, ${art.year}` : ""}, {pos.ai + 1} of {visible.length}
            {art.media.length > 1 ? `, file ${pos.fi + 1} of ${art.media.length}` : ""}
          </div>

          <button type="button" className="gal-lightbox-nav gal-lightbox-next" aria-label="Next" onClick={() => show(target.current + 1, true)}>→</button>
        </div>
      )}
    </div>
  );
}

/** A work's cover in the grid: a still, or a looping muted video. */
function TileMedia({ media, alt, eager, sizes }: { media: Media; alt: string; eager: boolean; sizes: string }) {
  if (media.kind === "image") {
    return (
      <Image
        src={media.src}
        alt={alt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        priority={eager}
        draggable={false}
      />
    );
  }
  // The tile's <a> already names the work; `#t=` gets WebKit to paint a first
  // frame even when the loop never starts (motion off).
  return (
    <video
      src={`${media.src}#t=0.001`}
      width={media.width}
      height={media.height}
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      ref={mute}
    />
  );
}
