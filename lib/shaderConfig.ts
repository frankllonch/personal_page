/* ===========================================================================
 *  BACKGROUND SHADER — ALL TUNABLE SETTINGS LIVE HERE
 * ===========================================================================
 *
 *  This is the only file you need to touch to restyle the background.
 *  Save and the dev server hot-reloads; no other file has to change.
 *
 *  What it draws: a stack of dune ridges receding into the distance. The
 *  furthest ridge sits near `horizon`, each nearer one is drawn lower, larger
 *  and scrolling faster, and the nearest ones paint over the ones behind.
 *
 *  Quick recipes
 *  -------------
 *  Calmer / more subtle   -> amplitude 0.10, layers 14, colorNear "#E4EFC4"
 *  Punchy like the video  -> amplitude 0.22, layers 26, colorNear "#7BE06B",
 *                            colorFar "#9BE8D8", colorSky "#BFF0E4"
 *  Big rolling hills      -> frequency 1.4, amplitude 0.26, spread 0.055
 *  Tight ripples          -> frequency 6.0, amplitude 0.09, spread 0.028
 *  Dead still (no motion) -> speed 0
 *  Cheap on laptops       -> layers 14, dpr 0.6
 * ------------------------------------------------------------------------- */

export type ShaderConfig = typeof shaderConfig;

export const shaderConfig = {
  /* --- SHAPE ------------------------------------------------------------ */

  /** How many dune ridges are stacked front-to-back.
   *  More = denser, deeper scene but costs more GPU. Sensible range 8–40.
   *  Changing this recompiles the shader (it is baked in as a constant). */
  layers: 22,

  /** Height of the dunes, as a fraction of screen height.
   *  0.05 = barely rolling, 0.30 = dramatic peaks. */
  amplitude: 0.17,

  /** How many dune humps fit across the screen.
   *  Lower = wide lazy hills, higher = tight ripples. Range ~1–8. */
  frequency: 2.6,

  /** Vertical gap between consecutive ridges, as a fraction of screen height.
   *  Larger = the stack spreads further down the screen and overlaps less. */
  spread: 0.042,

  /** Where the furthest ridge sits. 0 = bottom of screen, 1 = top.
   *  Raise it to push the horizon up and show more dunes. */
  horizon: 0.92,

  /** Extra high-frequency detail on each ridge.
   *  0 = pure clean sine curves, 1 = natural and lumpy, >1 = noisy. */
  roughness: 0.75,

  /* --- MOTION ----------------------------------------------------------- */

  /** Scroll speed of the dunes. 0 freezes the scene entirely.
   *  Negative values scroll the other way. ~0.05–0.6 is a nice range. */
  speed: 0.18,

  /** How much faster near ridges scroll than far ones (depth parallax).
   *  0 = everything moves together (flat), 1 = strong sense of depth. */
  parallax: 0.8,

  /* --- INTERACTION ------------------------------------------------------
   *  The shader draws; these are the values JavaScript feeds it so it reacts
   *  to you. Set them all to 0 for a purely ambient background.             */

  /** How far the whole scene drifts as the pointer moves, like looking around
   *  the landscape. 0 = locked, 0.15 = gentle, 0.5 = very loose. */
  mouseParallax: 0.18,

  /** How much the dunes swell upward under the cursor — the main "this is
   *  alive" cue. 0 = flat, 0.06 = subtle lift, 0.2 = a big bulge. */
  mouseSwell: 0.075,

  /** Width of that swell, as a fraction of screen width.
   *  Small = a tight localised poke, large = a broad gentle hill. */
  mouseRadius: 0.22,

  /** How fast the swell chases the pointer. 1 = glued to the cursor,
   *  0.02 = heavy and laggy. */
  mouseEase: 0.08,

  /** Height of the ripple that fires when you click. 0 disables clicking. */
  clickRipple: 0.07,

  /** How long a click ripple lasts, in seconds. */
  clickDuration: 1.6,

  /* --- COLOUR ----------------------------------------------------------- */
  /*  Any CSS hex string. The page text is black, so keep these light or the
   *  content stops being readable — check contrast after big changes.      */

  /** Sky, i.e. whatever is above the furthest ridge. */
  colorSky: "#FBFBF3",

  /** The furthest ridges. */
  colorFar: "#EDF3D2",

  /** The nearest ridges, at the bottom of the screen. */
  colorNear: "#BFD95A",

  /* --- SURFACE ---------------------------------------------------------- */

  /** Rim light along each ridge's crest, which is what separates overlapping
   *  dunes. 0 = flat silhouettes, 0.3 = strongly embossed.
   *  Negative values darken the crest instead. */
  shading: 0.14,

  /** How tightly that rim light hugs the crest.
   *  Higher = a thin bright edge, lower = a broad soft gradient. */
  shadeFalloff: 26.0,

  /** Film grain over the whole thing. 0 = clean, 0.06 = clearly textured.
   *  A little grain hides colour banding on wide gradients. */
  grain: 0.022,

  /* --- PERFORMANCE ------------------------------------------------------ */

  /** Render resolution multiplier. 1 = full device resolution (sharpest),
   *  0.6 = cheaper and slightly soft. The shader has no fine detail, so
   *  dropping this is usually invisible and helps a lot on laptops. */
  dpr: 0.9,
} as const;
