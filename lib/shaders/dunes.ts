import { defineShader, hexToRgb } from "./types";

/* ===========================================================================
 *  "DUNES" — pale dune ridges receding into the distance, near-white at the
 *  horizon fading to yellow-green up close. The calm, low-contrast option.
 *
 *  Quick recipes
 *  -------------
 *  Calmer / more subtle   -> amplitude 0.10, layers 14, colorNear "#E4EFC4"
 *  Big rolling hills      -> frequency 1.4, amplitude 0.26, spread 0.055
 *  Tight ripples          -> frequency 6.0, amplitude 0.09, spread 0.028
 *  Dead still             -> speed 0
 *  Ignores the pointer    -> mouseParallax 0, mouseSwell 0, clickRipple 0
 *  Cheap on laptops       -> layers 14, dpr 0.6
 * ------------------------------------------------------------------------- */

export const dunes = defineShader({
  label: "Dunes — pale ridges receding",

  config: {
    /* --- SHAPE ---------------------------------------------------------- */

    /** How many dune ridges are stacked front-to-back. Range 8–40.
     *  Changing this recompiles the shader (baked in as a constant). */
    layers: 50,
    /** Height of the dunes, as a fraction of screen height. */
    amplitude: 0.1,
    /** How many dune humps fit across the screen. Range ~1–8. */
    frequency: 10,
    /** Vertical gap between consecutive ridges. */
    spread: 0.1,
    /** Where the furthest ridge sits. 0 = bottom, 1 = top. */
    horizon: 0.84,
    /** Extra detail on each ridge. 0 = clean sines, 1 = natural and lumpy. */
    roughness: 1,

    /* --- MOTION --------------------------------------------------------- */

    /** Scroll speed. 0 freezes the scene. */
    speed: 0.2,
    /** How much faster near ridges scroll than far ones. */
    parallax: 0.5,

    /** How much the scene opens up as you scroll down the page. The ridges
     *  grow and spread apart, so the landscape expands under the content.
     *  0 = ignores scrolling, 0.5 = noticeable, 1.5 = dramatic. */
    scrollExpand: 0.7,

    /* --- INTERACTION ---------------------------------------------------- */

    mouseParallax: 1,
    mouseSwell: 0.3,
    mouseRadius: 1,
    mouseEase: 0.08,
    clickRipple: 5,
    clickDuration: 0.5,

    /* --- COLOUR ---------------------------------------------------------- */

    /** Sky above the furthest ridge. */
    colorSky: "#ff0000",
    /** The furthest ridges. */
    colorFar: "#767774",
    /** The nearest ridges, at the bottom. */
    colorNear: "#ff0000",

    /* --- SURFACE / PERF --------------------------------------------------- */

    /** Rim light along each crest, which separates overlapping ridges. */
    shading: 0.90,
    /** How tightly that rim hugs the crest. */
    shadeFalloff: 100,
    /** Film grain. */
    grain: 0.1,
    /** Render resolution multiplier. */
    dpr: 0.6,
  },

  fragment: (c) => /* glsl */ `
precision highp float;

#define LAYERS ${Math.max(1, Math.round(c.layers))}
// Precomputed: GLSL ES 1.00 has no integer overload of max().
#define DEPTH_DIV ${Math.max(Math.round(c.layers) - 1, 1)}.0

varying vec2 vUv;

uniform float iTime;
uniform vec2  iResolution;
uniform vec2  uMouse;
uniform vec2  uClick;
uniform float uClickAge;

uniform float uAmplitude, uFrequency, uSpread, uHorizon, uRoughness;
uniform float uSpeed, uParallax, uGrain;
uniform float uScroll;        // 0 at top of page, 1 at the bottom
uniform float uScrollExpand;
uniform vec3  uColorSky, uColorFar, uColorNear;
uniform float uShading, uShadeFalloff;
uniform float uMouseParallax, uMouseSwell, uMouseRadius;
uniform float uClickRipple, uClickDuration;

float ridge(float x, float seed, float t) {
  float h = sin(x + seed * 1.7 + t) * 0.55;
  h += sin(x * 2.17 - seed * 2.31 - t * 0.83) * 0.28 * uRoughness;
  h += sin(x * 4.31 + seed * 4.13 + t * 1.27) * 0.13 * uRoughness;
  return h;
}

void main() {
  vec2 uv = vUv;
  float aspect = max(0.0001, iResolution.x / iResolution.y);

  vec2 m = (uMouse - 0.5) * uMouseParallax;

  float clickFade = clamp(1.0 - uClickAge / max(0.0001, uClickDuration), 0.0, 1.0);
  clickFade *= clickFade;

  // Scrolling down opens the landscape out.
  float grow = 1.0 + uScroll * uScrollExpand;

  vec3 col = uColorSky;

  // Walk NEAREST to furthest and stop at the first ridge covering this pixel.
  // Nearer ridges overwrite further ones, so the first hit going this way is
  // the same answer as painting all of them back-to-front — but most pixels
  // are covered by a near ridge, so it exits almost immediately.
  for (int i = 0; i < LAYERS; i++) {
    int k = LAYERS - 1 - i;
    float depth = float(k) / DEPTH_DIV;

    float amp   = mix(uAmplitude * 0.35, uAmplitude, depth) * grow;
    float freq  = mix(uFrequency * 1.9,  uFrequency, depth);
    float speed = mix(uSpeed * (1.0 - uParallax * 0.8), uSpeed, depth);

    float baseY = uHorizon - depth * uSpread * float(LAYERS) * 0.5 * grow + m.y * depth;

    float x = uv.x * aspect * freq + m.x * depth * 3.0;
    float h = baseY + amp * ridge(x, float(k) * 1.37, iTime * speed);

    if (uMouseSwell > 0.0) {
      float dx = (uv.x - uMouse.x) / max(0.0001, uMouseRadius);
      h += uMouseSwell * exp(-dx * dx) * mix(0.35, 1.0, depth);
    }

    if (uClickRipple > 0.0 && clickFade > 0.0) {
      float dist = distance(vec2(uv.x * aspect, uv.y), vec2(uClick.x * aspect, uClick.y));
      h += uClickRipple * sin(dist * 16.0 - uClickAge * 7.0) * exp(-dist * 2.6)
           * clickFade * mix(0.4, 1.0, depth);
    }

    if (uv.y < h) {
      vec3 base = mix(uColorFar, uColorNear, depth);
      float rim = exp(-(h - uv.y) * uShadeFalloff);
      base *= 1.0 + uShading * rim;
      col = base;
      break;
    }
  }

  if (uGrain > 0.0) {
    float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (n - 0.5) * uGrain;
  }

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`,

  uniforms: (c) => ({
    uAmplitude: { value: c.amplitude },
    uFrequency: { value: c.frequency },
    uSpread: { value: c.spread },
    uHorizon: { value: c.horizon },
    uRoughness: { value: c.roughness },
    uSpeed: { value: c.speed },
    uParallax: { value: c.parallax },
    uScrollExpand: { value: c.scrollExpand },
    uColorSky: { value: hexToRgb(c.colorSky) },
    uColorFar: { value: hexToRgb(c.colorFar) },
    uColorNear: { value: hexToRgb(c.colorNear) },
    uShading: { value: c.shading },
    uShadeFalloff: { value: c.shadeFalloff },
    uGrain: { value: c.grain },
    uMouseParallax: { value: c.mouseParallax },
    uMouseSwell: { value: c.mouseSwell },
    uMouseRadius: { value: c.mouseRadius },
    uClickRipple: { value: c.clickRipple },
    uClickDuration: { value: c.clickDuration },
  }),
});
