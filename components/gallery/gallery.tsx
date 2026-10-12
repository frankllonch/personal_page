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
 * tiles are real links, and the grid is complete and readable with scripting
 * off.
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
/* Justified tiles can be most of a row wide, so err on the large side. */
const TILE_SIZES = "(max-width: 599px) 100vw, (max-width: 1199px) 50vw, 33vw";
const PLATE_SIZES = "(max-width: 900px) 92vw, 60vw";

const isPlainClick = (e: React.MouseEvent) =>
  !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0;

// React does not reflect `muted` as an attribute on first render, which is
// what autoplay policies check; set it on the node itself.
const mute = (el: HTMLVideoElement | null) => {
  if (el) { el.muted = true; el.defaultMuted = true; }
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

  /* lightbox state: `shown` is what the plate draws, and lags `target` by one fade */
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [changing, setChanging] = useState(false);
  const [shown, setShown] = useState(0);
  const target = useRef(0);
  const ticket = useRef(0);
  const pending = useRef(0);
  const teardown = useRef(0);
  const openedAt = useRef("");
  const shownRef = useRef(false);

  const unit = DENSITIES[density]!.unit;

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
    if (mounted) {
      for (const v of videos) v.pause();
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // first frame only

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting && e.intersectionRatio > 0.2) void v.play().catch(() => undefined);
          else v.pause();
        }
      },
      { threshold: [0, 0.25] },
    );
    for (const v of videos) io.observe(v);
    return () => io.disconnect();
  }, [visible, mounted]);

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

  // Next's router reloads the page on a popstate whose state it does not
  // recognise, so every entry written here carries the router's own state.
  const withRouterState = (extra: object) => ({ ...(window.history.state ?? {}), ...extra });

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
    history.replaceState(withRouterState({ gal: true }), "", hashFor(wrapped));

    const mine = ++ticket.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!animate || reduce) {
      setShown(wrapped);
      setChanging(false);
      return;
    }
    // One transition per action, and only one in flight: a newer navigation
    // takes a new ticket and this one lapses instead of racing it.
    setChanging(true);
    window.clearTimeout(pending.current);
    pending.current = window.setTimeout(() => {
      if (mine !== ticket.current) return;
      setShown(wrapped);
      setChanging(false);
    }, FADE);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seq, visible]);

  const open = useCallback((ai: number) => {
    const i = firstOf(ai);
    if (i < 0) return;
    // A close still counting down belongs to the work that was on screen
    // before this one, and would otherwise empty the plate under it.
    window.clearTimeout(teardown.current);
    shownRef.current = true;
    openedAt.current = location.pathname + location.search;
    setMounted(true);
    document.body.classList.add("gal-locked");
    target.current = -1;
    show(i, false);
    // Opened on the next frame so the fade has a value to start from.
    requestAnimationFrame(() => { if (shownRef.current) setIsOpen(true); });
    history.pushState(withRouterState({ gal: true }), "", hashFor(i));
    // Focus the dialog itself, not an arrow: a focused button draws a ring,
    // which read as the arrow being highlighted for no reason.
    requestAnimationFrame(() => boxRef.current?.focus({ preventScroll: true }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstOf, show]);

  const close = useCallback((restore: boolean) => {
    if (!shownRef.current) return;
    shownRef.current = false;
    ticket.current++;
    window.clearTimeout(pending.current);
    window.clearTimeout(teardown.current);
    setIsOpen(false);
    setChanging(false);
    document.body.classList.remove("gal-locked");
    // Held until the fade has finished, or the painting vanishes mid-close.
    teardown.current = window.setTimeout(() => setMounted(false), CLOSE);
    if (restore && openedAt.current) history.replaceState(withRouterState({}), "", openedAt.current);
    const p = seq[target.current];
    const slug = p ? visible[p.ai]?.slug : undefined;
    if (slug) gridRef.current?.querySelector<HTMLElement>(`[data-slug="${CSS.escape(slug)}"]`)?.focus({ preventScroll: true });
  }, [seq, visible]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!shownRef.current) return;
      if (e.key === "Escape") close(true);
      else if (e.key === "ArrowLeft") show(target.current - 1, true);
      else if (e.key === "ArrowRight") show(target.current + 1, true);
    };
    const onPop = () => { if (shownRef.current) close(false); };
    document.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
      window.clearTimeout(pending.current);
      window.clearTimeout(teardown.current);
      document.body.classList.remove("gal-locked");
    };
  }, [close, show]);

  // Swipe between files on touch.
  const touch = useRef({ x: 0, y: 0 });
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.changedTouches[0]!.clientX, y: e.changedTouches[0]!.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
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

      <div className="gal-controls">
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
      </div>

      {visible.length === 0 ? (
        <div className="gal-empty">
          <div>No {kind === "animation" ? "animations" : "paintings"} yet.</div>
        </div>
      ) : (
        <div
          ref={gridRef}
          className="gal-grid"
          style={{ "--gal-unit": `${unit}px` } as React.CSSProperties}
        >
          {visible.map((a, i) => (
            <a
              key={a.slug}
              className="gal-tile"
              href={`#${a.slug}`}
              style={{ "--a": (a.cover.width / a.cover.height).toFixed(4) } as React.CSSProperties}
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
              <TileMedia media={a.cover} alt={a.title} eager={i < EAGER} />
            </a>
          ))}
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
                      : <video src={m.src} muted playsInline preload="metadata" ref={mute} />}
                  </button>
                ))}
              </div>
            )}
            <div className="gal-lightbox-count">
              {pos.ai + 1} of {visible.length}
              {art.media.length > 1 ? ` · ${pos.fi + 1} / ${art.media.length}` : ""}
            </div>
          </div>

          <button type="button" className="gal-lightbox-nav gal-lightbox-next" aria-label="Next" onClick={() => show(target.current + 1, true)}>→</button>
        </div>
      )}
    </div>
  );
}

/** A work's cover in the grid: a still, or a looping muted video. */
function TileMedia({ media, alt, eager }: { media: Media; alt: string; eager: boolean }) {
  if (media.kind === "image") {
    return (
      <Image
        src={media.src}
        alt={alt}
        width={media.width}
        height={media.height}
        sizes={TILE_SIZES}
        priority={eager}
        draggable={false}
      />
    );
  }
  return (
    <video
      src={media.src}
      width={media.width}
      height={media.height}
      loop
      playsInline
      preload="metadata"
      aria-label={alt}
      ref={mute}
    />
  );
}
