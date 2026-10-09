"use client";

import { Renderer, Program, Mesh, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import { activeShader } from "@/lib/shaders";

/**
 * Full-screen background shader host.
 *
 * This file is generic — it owns the WebGL context, the resize handling, the
 * animation loop and the pointer/click plumbing, and nothing else. The effect
 * itself comes from whichever module lib/shaders/index.ts marks as ACTIVE.
 *
 * Switch backgrounds in lib/shaders/index.ts; tune one in its own file.
 */

const vertex = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export default function BackgroundShader() {
  const hostRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const smoothed = useRef({ x: 0.5, y: 0.5 });
  // Far enough in the past that no ripple shows on first paint.
  const clickAt = useRef(-1e6);
  const scroll = useRef(0);
  const scrollSmoothed = useRef(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const c = activeShader.config;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new Renderer({
      dpr: Math.min(c.dpr * (window.devicePixelRatio || 1), 2),
      // Transparent, so if the canvas is ever unpainted the page's own
      // background shows through instead of an opaque black rectangle.
      alpha: true,
      antialias: false,
    });
    const gl = renderer.gl;

    const program = new Program(gl, {
      vertex,
      fragment: activeShader.fragment(c),
      uniforms: {
        // Always supplied by the host; see lib/shaders/types.ts.
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uClick: { value: new Float32Array([0.5, 0.5]) },
        uClickAge: { value: 999 },
        uScroll: { value: 0 },
        // Everything else belongs to the active effect.
        ...activeShader.uniforms(c),
      },
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      renderer.setSize(host.offsetWidth, host.offsetHeight);
      const r = program.uniforms.iResolution.value as Float32Array;
      r[0] = gl.canvas.width;
      r[1] = gl.canvas.height;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const interactive = c.mouseParallax > 0 || c.mouseSwell > 0;

    // Read scroll on the event and do nothing else here: touching layout
    // properties inside the render loop would force a reflow every frame.
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    const onPointer = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth;
      pointer.current.y = 1 - e.clientY / window.innerHeight;
    };
    const onClick = (e: PointerEvent) => {
      const cl = program.uniforms.uClick.value as Float32Array;
      cl[0] = e.clientX / window.innerWidth;
      cl[1] = 1 - e.clientY / window.innerHeight;
      clickAt.current = performance.now();
    };

    // The background sits behind everything and is pointer-events:none, so
    // listen on the window — clicks on cards and links still register here
    // without the shader ever intercepting them.
    if (interactive) window.addEventListener("pointermove", onPointer, { passive: true });
    if (c.clickRipple > 0) window.addEventListener("pointerdown", onClick, { passive: true });

    let raf = 0;
    const render = (t: number) => {
      raf = requestAnimationFrame(render);

      // Nothing on screen changes while the tab is hidden; don't burn GPU.
      // The initial paint below means a hidden tab still shows the scene
      // rather than an empty canvas when it comes back.
      if (document.hidden) return;

      program.uniforms.iTime.value = reduced ? 0 : t * 0.001;

      if (interactive) {
        smoothed.current.x += (pointer.current.x - smoothed.current.x) * c.mouseEase;
        smoothed.current.y += (pointer.current.y - smoothed.current.y) * c.mouseEase;
        const mu = program.uniforms.uMouse.value as Float32Array;
        mu[0] = smoothed.current.x;
        mu[1] = smoothed.current.y;
      }

      program.uniforms.uClickAge.value = (t - clickAt.current) * 0.001;

      // Eased, so flicking the wheel glides the scene open instead of snapping.
      scrollSmoothed.current += (scroll.current - scrollSmoothed.current) * 0.07;
      program.uniforms.uScroll.value = scrollSmoothed.current;

      renderer.render({ scene: mesh });
    };
    // Paint one frame up front, independent of the loop: a tab that loads in
    // the background never runs rAF, and without this it would reveal a blank
    // canvas the moment it is focused.
    renderer.render({ scene: mesh });

    raf = requestAnimationFrame(render);

    host.appendChild(gl.canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (gl.canvas.parentElement === host) host.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div ref={hostRef} className="absolute inset-0" aria-hidden="true" />;
}
