"use client";

import { Renderer, Program, Mesh, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import { shaderConfig } from "@/lib/shaderConfig";

/**
 * Full-screen background shader: dune ridges receding into the distance.
 *
 * Every knob lives in lib/shaderConfig.ts — don't edit values here.
 *
 * How it draws: for each pixel the fragment shader walks the ridges from
 * furthest to nearest. A ridge is a sum of sines; if the pixel sits below that
 * curve it takes the ridge's colour, so nearer ridges simply paint over the
 * ones behind and occlusion falls out for free.
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

// LAYERS is injected as a #define rather than passed as a uniform: WebGL1
// requires loop bounds to be compile-time constants, and relying on `break`
// with a uniform condition is what trips strict mobile drivers.
const fragment = (layers: number) => /* glsl */ `
precision highp float;

#define LAYERS ${Math.max(1, Math.round(layers))}
// Precomputed: GLSL ES 1.00 has no integer overload of max(), so the depth
// divisor is baked in here rather than worked out in the shader.
#define DEPTH_DIV ${Math.max(Math.round(layers) - 1, 1)}.0

varying vec2 vUv;

uniform float iTime;
uniform vec2  iResolution;

uniform float uAmplitude;
uniform float uFrequency;
uniform float uSpread;
uniform float uHorizon;
uniform float uRoughness;
uniform float uSpeed;
uniform float uParallax;
uniform vec2  uMouse;
uniform float uMouseStrength;
uniform vec3  uColorSky;
uniform vec3  uColorFar;
uniform vec3  uColorNear;
uniform float uShading;
uniform float uShadeFalloff;
uniform float uGrain;

// One ridge profile: a few sines at incommensurate frequencies so the crest
// never visibly repeats across the screen.
float ridge(float x, float seed, float t) {
  float h = sin(x + seed * 1.7 + t) * 0.55;
  h += sin(x * 2.17 - seed * 2.31 - t * 0.83) * 0.28 * uRoughness;
  h += sin(x * 4.31 + seed * 4.13 + t * 1.27) * 0.13 * uRoughness;
  return h;
}

void main() {
  vec2 uv = vUv;
  float aspect = max(0.0001, iResolution.x / iResolution.y);

  vec2 m = (uMouse - 0.5) * uMouseStrength;

  vec3 col = uColorSky;

  for (int k = 0; k < LAYERS; k++) {
    // 0 at the furthest ridge, 1 at the nearest.
    float depth = float(k) / DEPTH_DIV;

    // Near ridges are taller, wider and faster — that trio is what reads as
    // perspective without any actual 3D.
    float amp   = mix(uAmplitude * 0.35, uAmplitude, depth);
    float freq  = mix(uFrequency * 1.9,  uFrequency, depth);
    float speed = mix(uSpeed * (1.0 - uParallax * 0.8), uSpeed, depth);

    float baseY = uHorizon - depth * uSpread * float(LAYERS) * 0.5 + m.y * depth;

    float x = uv.x * aspect * freq + m.x * depth * 3.0;
    float h = baseY + amp * ridge(x, float(k) * 1.37, iTime * speed);

    if (uv.y < h) {
      vec3 base = mix(uColorFar, uColorNear, depth);

      // Rim light on the crest: this is the only thing separating one ridge
      // from the next, since they share a palette.
      float rim = exp(-(h - uv.y) * uShadeFalloff);
      base *= 1.0 + uShading * rim;

      col = base;
    }
  }

  // Grain, also useful for breaking up banding across the wide gradients.
  if (uGrain > 0.0) {
    float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (n - 0.5) * uGrain;
  }

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export default function DunesShader() {
  const hostRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const smoothed = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const c = shaderConfig;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new Renderer({
      dpr: Math.min(c.dpr * (window.devicePixelRatio || 1), 2),
      alpha: false,
      antialias: false,
    });
    const gl = renderer.gl;

    const program = new Program(gl, {
      vertex,
      fragment: fragment(c.layers),
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uAmplitude: { value: c.amplitude },
        uFrequency: { value: c.frequency },
        uSpread: { value: c.spread },
        uHorizon: { value: c.horizon },
        uRoughness: { value: c.roughness },
        uSpeed: { value: c.speed },
        uParallax: { value: c.parallax },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseStrength: { value: c.mouseStrength },
        uColorSky: { value: new Float32Array(hexToRgb(c.colorSky)) },
        uColorFar: { value: new Float32Array(hexToRgb(c.colorFar)) },
        uColorNear: { value: new Float32Array(hexToRgb(c.colorNear)) },
        uShading: { value: c.shading },
        uShadeFalloff: { value: c.shadeFalloff },
        uGrain: { value: c.grain },
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

    const onPointer = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth;
      pointer.current.y = 1 - e.clientY / window.innerHeight;
    };
    if (c.mouseStrength > 0) window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    const render = (t: number) => {
      raf = requestAnimationFrame(render);

      // Nothing on screen changes while the tab is hidden; don't burn GPU.
      if (document.hidden) return;

      program.uniforms.iTime.value = reduced ? 0 : t * 0.001;

      if (c.mouseStrength > 0) {
        smoothed.current.x += (pointer.current.x - smoothed.current.x) * 0.05;
        smoothed.current.y += (pointer.current.y - smoothed.current.y) * 0.05;
        const mu = program.uniforms.uMouse.value as Float32Array;
        mu[0] = smoothed.current.x;
        mu[1] = smoothed.current.y;
      }

      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(render);

    host.appendChild(gl.canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      if (gl.canvas.parentElement === host) host.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div ref={hostRef} className="absolute inset-0" aria-hidden="true" />;
}
