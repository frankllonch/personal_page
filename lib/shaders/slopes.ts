import { defineShader, hexToRgb } from "./types";

/* ===========================================================================
 *  "SLOPES" — olive hillsides stacked front-to-back at a diagonal, blue sky
 *  showing between them and a wide cream glow along every silhouette.
 *
 *  Same layered-ridge machinery as ./dunes, with three differences that do all
 *  the work: the whole field is rotated, the ridges are far bigger and fewer,
 *  and each silhouette carries a broad rim light instead of a faint one.
 *
 *  Quick recipes
 *  -------------
 *  Closer / more immersive   -> amplitude 0.5, spread 0.11, layers 7
 *  Flatter, more graphic     -> rimStrength 0.4, rimFalloff 14, roughness 0.3
 *  Steeper diagonal          -> angle 38
 *  Horizontal, like ./dunes  -> angle 0
 *  Calmer for reading over   -> colorHill "#C2C291", colorSky "#9DC8EE"
 *  Dead still                -> speed 0
 *  Ignores the pointer       -> mouseParallax 0, mouseSwell 0, clickRipple 0
 * ------------------------------------------------------------------------- */

export const slopes = defineShader({
  label: "Slopes — diagonal hillsides against sky",

  config: {
    /* --- SHAPE ---------------------------------------------------------- */

    /** How many hillsides are stacked front-to-back. Few and large is what
     *  gives this one its scale. Range ~4–16. Recompiles the shader. */
    layers: 8,

    /** Height of the hills, as a fraction of screen height. Big on purpose. */
    amplitude: 0.34,

    /** How many hill humps fit across. Low = vast slow slopes. Range ~0.6–4. */
    frequency: 1.0,

    /** Vertical gap between consecutive hillsides. Larger = they overlap less
     *  and more sky shows through. */
    spread: 0.135,

    /** Where the furthest hillside sits. 0 = bottom of screen, 1 = top. */
    horizon: 0.78,

    /** Extra detail on each crest. 0 = clean curves, 1 = natural and lumpy. */
    roughness: 0.55,

    /** Tilt of the whole scene, in degrees. This is what turns the stack of
     *  hills into the receding diagonal. 0 = flat horizontal like ./dunes. */
    angle: 30,

    /* --- MOTION --------------------------------------------------------- */

    /** Drift across the hills. 0 freezes the scene. */
    speed: 0.1,

    /** How much faster near hills move than far ones (depth parallax).
     *  0 = everything together, 1 = strong depth. */
    parallax: 0.85,

    /** How much the scene opens up as you scroll down the page.
     *  0 = ignores scrolling, 0.5 = noticeable, 1.5 = dramatic. */
    scrollExpand: 0.7,

    /* --- INTERACTION ---------------------------------------------------- */

    /** How far the scene drifts as the pointer moves. */
    mouseParallax: 0.18,
    /** How much the hills swell upward under the cursor. */
    mouseSwell: 0.09,
    /** Reach of that swell, as a fraction of screen width. */
    mouseRadius: 0.28,
    /** How fast the swell chases the pointer. 1 = glued to it. */
    mouseEase: 0.08,
    /** Height of the ripple fired on click. 0 disables clicking. */
    clickRipple: 0.08,
    /** How long a click ripple lasts, in seconds. */
    clickDuration: 1.6,

    /* --- COLOUR ----------------------------------------------------------
     *  Page text is near-black and the cards are transparent, so text sits
     *  straight on these — check it still reads after a big change.       */

    /** The sky behind and between the hills. */
    colorSky: "#58A6F0",
    /** The hillsides themselves, furthest away. */
    colorFar: "#AFAF72",
    /** The hillsides nearest the viewer. */
    colorHill: "#9C9C46",
    /** The glow along each silhouette — the thing that sells the depth. */
    colorRim: "#EFEFE2",

    /** How strongly that glow shows. 0 = hard flat silhouettes, 1 = full rim. */
    rimStrength: 0.95,
    /** How tightly it hugs the crest. Low = a broad haze spilling down the
     *  slope, high = a thin bright line. */
    rimFalloff: 7.0,

    /* --- SURFACE / PERF -------------------------------------------------- */

    /** Film grain. Hides banding across these very wide gradients. */
    grain: 0.022,
    /** Render resolution multiplier. */
    dpr: 0.9,
  },

  /**
   * For each pixel, walk the hillsides from furthest to nearest. A hillside is
   * a sum of sines; if the pixel sits below that curve it takes the hillside's
   * colour, so nearer ones paint over the ones behind and occlusion — the
   * actual source of the depth — falls out for free.
   *
   * The whole field is evaluated in a rotated frame, which is what turns the
   * stack into a receding diagonal rather than flat horizontal bands.
   */
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

uniform float uAmplitude, uFrequency, uSpread, uHorizon, uRoughness, uAngle;
uniform float uSpeed, uParallax, uGrain;
uniform float uScroll;        // 0 at top of page, 1 at the bottom
uniform float uScrollExpand;
uniform vec3  uColorSky, uColorFar, uColorHill, uColorRim;
uniform float uRimStrength, uRimFalloff;
uniform float uMouseParallax, uMouseSwell, uMouseRadius;
uniform float uClickRipple, uClickDuration;

float ridge(float x, float seed, float t) {
  float h = sin(x + seed * 1.7 + t) * 0.55;
  h += sin(x * 2.17 - seed * 2.31 - t * 0.83) * 0.28 * uRoughness;
  h += sin(x * 4.31 + seed * 4.13 + t * 1.27) * 0.13 * uRoughness;
  return h;
}

void main() {
  float aspect = max(0.0001, iResolution.x / iResolution.y);

  // Rotate about the centre so the stack of hills reads as a diagonal.
  float ca = cos(uAngle), sa = sin(uAngle);
  vec2 d = vec2((vUv.x - 0.5) * aspect, vUv.y - 0.5);
  vec2 uv = vec2(d.x * ca - d.y * sa, d.x * sa + d.y * ca) + vec2(0.5 * aspect, 0.5);

  vec2 md = vec2((uMouse.x - 0.5) * aspect, uMouse.y - 0.5);
  vec2 mRot = vec2(md.x * ca - md.y * sa, md.x * sa + md.y * ca) + vec2(0.5 * aspect, 0.5);

  vec2 m = (uMouse - 0.5) * uMouseParallax;

  float clickFade = clamp(1.0 - uClickAge / max(0.0001, uClickDuration), 0.0, 1.0);
  clickFade *= clickFade;

  // Scrolling down opens the landscape out.
  float grow = 1.0 + uScroll * uScrollExpand;

  vec3 col = uColorSky;

  // Nearest first, stopping at the first hill covering this pixel — same
  // result as painting back-to-front, but most pixels exit immediately.
  for (int i = 0; i < LAYERS; i++) {
    int k = LAYERS - 1 - i;
    float depth = float(k) / DEPTH_DIV;   // 0 furthest, 1 nearest

    float amp   = mix(uAmplitude * 0.45, uAmplitude, depth) * grow;
    float freq  = mix(uFrequency * 1.6,  uFrequency, depth);
    float speed = mix(uSpeed * (1.0 - uParallax * 0.8), uSpeed, depth);

    float baseY = uHorizon - depth * uSpread * float(LAYERS) * 0.5 * grow + m.y * depth;

    float x = uv.x * freq + m.x * depth * 3.0;
    float h = baseY + amp * ridge(x, float(k) * 1.37, iTime * speed);

    // Swell: hills bulge toward the cursor, nearer ones reacting more.
    if (uMouseSwell > 0.0) {
      float dx = (uv.x - mRot.x) / max(0.0001, uMouseRadius);
      h += uMouseSwell * exp(-dx * dx) * mix(0.35, 1.0, depth);
    }

    if (uClickRipple > 0.0 && clickFade > 0.0) {
      vec2 cd = vec2((uClick.x - 0.5) * aspect, uClick.y - 0.5);
      vec2 cRot = vec2(cd.x * ca - cd.y * sa, cd.x * sa + cd.y * ca) + vec2(0.5 * aspect, 0.5);
      float dist = distance(uv, cRot);
      h += uClickRipple * sin(dist * 16.0 - uClickAge * 7.0) * exp(-dist * 2.6)
           * clickFade * mix(0.4, 1.0, depth);
    }

    if (uv.y < h) {
      vec3 base = mix(uColorFar, uColorHill, depth);

      // Broad glow spilling down from the silhouette. Without this the hills
      // read as flat cut-out shapes.
      float rim = exp(-(h - uv.y) * uRimFalloff);
      base = mix(base, uColorRim, rim * uRimStrength);

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
    uAngle: { value: (c.angle * Math.PI) / 180 },
    uSpeed: { value: c.speed },
    uParallax: { value: c.parallax },
    uScrollExpand: { value: c.scrollExpand },
    uColorSky: { value: hexToRgb(c.colorSky) },
    uColorFar: { value: hexToRgb(c.colorFar) },
    uColorHill: { value: hexToRgb(c.colorHill) },
    uColorRim: { value: hexToRgb(c.colorRim) },
    uRimStrength: { value: c.rimStrength },
    uRimFalloff: { value: c.rimFalloff },
    uGrain: { value: c.grain },
    uMouseParallax: { value: c.mouseParallax },
    uMouseSwell: { value: c.mouseSwell },
    uMouseRadius: { value: c.mouseRadius },
    uClickRipple: { value: c.clickRipple },
    uClickDuration: { value: c.clickDuration },
  }),
});
