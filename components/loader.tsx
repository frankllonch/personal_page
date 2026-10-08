"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { markIntroDone } from "@/lib/intro";

/**
 * Intro loader: the car drives in, waves, and uncovers "frank" as it leaves.
 *
 * How the reveal works: the car and a white cover panel share the SAME x value
 * every frame. The cover starts over the wordmark and its left edge rides the
 * car's rear bumper, so letters emerge exactly as the car clears them. Sharing
 * one number means the two can never drift apart.
 *
 * Frames come from public/loader (built by scripts/build-loader.mjs). The car
 * body is rigid across the source frames, so CSS owns the motion at 60fps and
 * the sprites only carry the driver's animation — that is why 10 frames is
 * enough where the raw export had 48.
 *
 * The sprites are painted into a single <canvas>. Stacking ten 900x733 <img>
 * elements and cross-fading them meant the compositor juggled ~26MB of decoded
 * bitmaps every frame, which Safari handled badly.
 */

const FRAME_COUNT = 10;
const CRUISE_FRAMES = 3; // indices 0-2: hands on the wheel
const WAVE_START = 3; // indices 3-9: the driver raises an arm

// The gesture runs early and is over before the car reaches the middle.
// The source art only ever raises the arm, so the lower half of the wave is the
// same frames played back in reverse — a wave looks the same going down.
// Tuned against the geometry: the car is only fully on screen for p in
// [0.254, 0.746], so the wave spans p=0.27 (just clear of the left edge) to
// p=0.50 (dead centre).
const GESTURE_START = 0.22;
const GESTURE_END = 0.62;
const CRUISE_MS = 150; // hand-drawn boil while just driving

const SPRITE_W = 900;
const SPRITE_H = 733;

const DRIVE_MS = 1750;
const HOLD_MS = 320;
const EXIT_MS = 780;
const SAFETY_MS = 8000; // never trap the page behind the overlay

const frameSrc = (i: number) => `/loader/car-${String(i).padStart(2, "0")}.webp`;

/** Cubic-bezier easing, same curve model CSS uses. */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const fx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const fy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dfx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = fx(t) - x;
      if (Math.abs(err) < 1e-7) break;
      const d = dfx(t);
      if (Math.abs(d) < 1e-7) break;
      t -= err / d;
    }
    return fy(t);
  };
}

// Drive in, ease off to say hi, then pull away. Relative speeds across the run
// are 1.23 in / 0.58 during the wave / 1.65 out, so the car visibly slows for
// the gesture and accelerates once the arm is back on the wheel.
const easeDrive = cubicBezier(0.35, 0.6, 0.775, 0.3);

export default function Loader() {
  const [mounted, setMounted] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [pct, setPct] = useState(0);
  const [driving, setDriving] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastFrameRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  // --- preload, drive, exit -------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setLeaving(true);
      window.setTimeout(() => {
        if (cancelled) return;
        setMounted(false);
        // Only now let the page start its WebGL background.
        markIntroDone();
      }, EXIT_MS);
    };

    // Hard stop: if anything stalls, the site must still become reachable.
    const safety = window.setTimeout(finish, SAFETY_MS);

    const paint = (idx: number) => {
      const ctx = ctxRef.current;
      const img = framesRef.current[idx];
      if (!ctx || !img) return;
      ctx.clearRect(0, 0, SPRITE_W, SPRITE_H);
      ctx.drawImage(img, 0, 0, SPRITE_W, SPRITE_H);
    };

    const drive = () => {
      if (cancelled || doneRef.current) return;
      if (reduced) {
        // No motion: show the finished wordmark briefly, then leave.
        if (coverRef.current) coverRef.current.style.transform = "translate3d(200vw,0,0)";
        window.setTimeout(finish, 420);
        return;
      }

      setDriving(true);
      paint(0);
      lastFrameRef.current = 0;
      const start = performance.now();

      const tick = (now: number) => {
        if (cancelled) return;
        const raw = Math.min(1, (now - start) / DRIVE_MS);
        const p = easeDrive(raw);

        const vw = window.innerWidth;
        const carW = canvasRef.current?.offsetWidth ?? vw * 0.34;
        // Rear bumper travels from just off-screen left to just off-screen right.
        const x = -carW + p * (vw + carW);

        if (canvasRef.current) canvasRef.current.style.transform = `translate3d(${x}px,-50%,0)`;
        if (coverRef.current) coverRef.current.style.transform = `translate3d(${x}px,0,0)`;

        let idx: number;
        if (raw >= GESTURE_START && raw <= GESTURE_END) {
          const g = (raw - GESTURE_START) / (GESTURE_END - GESTURE_START);
          const span = FRAME_COUNT - WAVE_START;
          // Triangle: 0 -> 1 -> 0, so the arm goes up and comes back to the wheel.
          const tri = g < 0.5 ? g / 0.5 : (1 - g) / 0.5;
          idx = WAVE_START + Math.min(span - 1, Math.floor(tri * span));
        } else {
          idx = Math.floor((now - start) / CRUISE_MS) % CRUISE_FRAMES;
        }
        if (idx !== lastFrameRef.current) {
          paint(idx);
          lastFrameRef.current = idx;
        }

        if (raw < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          window.setTimeout(finish, HOLD_MS);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    // Real progress: decode every sprite plus the wordmark font before driving,
    // so the animation never stutters on a cold cache.
    (async () => {
      let loaded = 0;
      const bump = () => {
        loaded += 1;
        if (!cancelled) setPct(Math.round((loaded / (FRAME_COUNT + 1)) * 100));
      };

      const imgs = Array.from({ length: FRAME_COUNT }, (_, i) => {
        const img = new Image();
        img.src = frameSrc(i);
        framesRef.current[i] = img;
        return img
          .decode()
          .catch(() => undefined)
          .then(bump);
      });

      const font = (document.fonts?.ready ?? Promise.resolve()).then(bump);

      await Promise.all([...imgs, font]);
      if (cancelled) return;
      setPct(100);
      // One frame of breathing room so the 100 is actually seen.
      window.setTimeout(drive, 180);
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(safety);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Park the car off-screen and the cover over the wordmark imperatively. These
  // two transforms are never React-controlled, so the re-render that starts the
  // exit cannot reset them mid-flight.
  useEffect(() => {
    const c = canvasRef.current;
    if (c) {
      c.style.setProperty("transform", "translate3d(-100vw,-50%,0)");
      ctxRef.current = c.getContext("2d");
    }
    coverRef.current?.style.setProperty("transform", "translate3d(-100vw,0,0)");
  }, []);

  // Lock scrolling while the overlay is up.
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  // If the component is ever torn down without finishing, don't strand the page.
  useEffect(() => () => markIntroDone(), []);

  if (!mounted) return null;

  const shell: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "#ffffff",
    overflow: "hidden",
    transform: leaving ? "translate3d(0,-100%,0)" : "translate3d(0,0,0)",
    transition: `transform ${EXIT_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`,
    willChange: "transform",
  };

  const word: CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    margin: 0,
    whiteSpace: "nowrap",
    fontFamily: '"Inter", sans-serif',
    fontWeight: 700,
    fontSize: "clamp(3.2rem, 19vw, 17rem)",
    letterSpacing: "-0.045em",
    lineHeight: 1,
    color: "#000000",
    userSelect: "none",
  };

  // Same x as the car, so its left edge is the car's rear bumper. 150vw is the
  // smallest width that still covers the viewport when the car is parked off
  // the left edge — a wider panel is just more area for the compositor.
  const cover: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "150vw",
    background: "#ffffff",
    willChange: "transform",
  };

  const car: CSSProperties = {
    position: "absolute",
    top: "54%",
    left: 0,
    display: "block",
    width: "clamp(230px, 34vw, 560px)",
    height: "auto",
    willChange: "transform",
    opacity: driving ? 1 : 0,
  };

  return (
    <div id="intro-loader" style={shell} aria-hidden="true">
      <div data-loader="word" style={word}>frank</div>

      <div ref={coverRef} data-loader="cover" style={cover} />

      <canvas
        ref={canvasRef}
        data-loader="car"
        width={SPRITE_W}
        height={SPRITE_H}
        style={car}
      />

      {/* Real asset progress, in the spirit of the reference site's counter. */}
      <div
        style={{
          position: "absolute",
          right: "clamp(16px, 4vw, 48px)",
          bottom: "clamp(16px, 4vw, 48px)",
          fontFamily: '"Inter", sans-serif',
          fontWeight: 700,
          fontSize: "clamp(0.75rem, 1.1vw, 0.95rem)",
          letterSpacing: "0.08em",
          color: "rgba(0,0,0,0.45)",
          fontVariantNumeric: "tabular-nums",
          opacity: driving ? 0 : 1,
          transition: "opacity 320ms ease",
          userSelect: "none",
        }}
      >
        {String(pct).padStart(3, "0")}
      </div>
    </div>
  );
}
