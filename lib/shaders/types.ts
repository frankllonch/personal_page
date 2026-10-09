/* ===========================================================================
 *  SHADER CONTRACT
 * ===========================================================================
 *  Every background shader is one self-contained file in this folder that
 *  exports a ShaderDef. The renderer (components/background-shader.tsx) is
 *  generic: it knows nothing about any particular effect.
 *
 *  To add your own, copy an existing file, change `fragment`, `config` and
 *  `uniforms`, then register it in ./index.ts.
 * ------------------------------------------------------------------------- */

/** Settings every shader must expose, because the renderer itself reads them. */
export type BaseConfig = {
  /** Render resolution multiplier. 1 = full device resolution, 0.6 = cheaper. */
  dpr: number;
  /** How fast the smoothed pointer chases the real one. 1 = instant. */
  mouseEase: number;
  /** Pointer influence. If parallax and swell are both 0 the renderer skips
   *  pointer tracking entirely. */
  mouseParallax: number;
  mouseSwell: number;
  mouseRadius: number;
  /** 0 disables click handling. */
  clickRipple: number;
  clickDuration: number;
};

/**
 * The renderer always supplies these uniforms, so declare the ones you use:
 *
 *   uniform float iTime;          seconds, frozen at 0 under reduced-motion
 *   uniform vec2  iResolution;    drawing buffer size in pixels
 *   uniform vec2  uMouse;         smoothed pointer, 0..1, y up
 *   uniform vec2  uClick;         where the last click landed, 0..1, y up
 *   uniform float uClickAge;      seconds since that click
 *
 * Anything else comes from your own `uniforms()`.
 */
export type ShaderDef<C extends BaseConfig = BaseConfig> = {
  /** Shown nowhere; it is just a label for humans reading ./index.ts. */
  label: string;
  /** This effect's tunables. */
  config: C;
  /** GLSL fragment source. Takes the config so it can bake in #defines. */
  fragment: (c: C) => string;
  /** Config values mapped to GL uniforms. */
  uniforms: (c: C) => Record<string, { value: unknown }>;
};

/** Small helper so each shader file keeps full type inference on its config. */
export const defineShader = <C extends BaseConfig>(def: ShaderDef<C>) => def;

export const hexToRgb = (hex: string): Float32Array => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return new Float32Array([((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]);
};
