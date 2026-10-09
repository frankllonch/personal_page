import { dunes } from "./dunes";

/* ===========================================================================
 *  "STRAIGHT LINES" — the ridge field flattened until the crests stop rolling
 *  and read as fine horizontal lines stacked into the distance.
 *
 *  This is the same effect as ./dunes with a different set of numbers, so it
 *  reuses its shader rather than keeping a second copy of the same GLSL —
 *  edit ./dunes and both improve. Only `config` below is its own.
 *
 *  Quick recipes
 *  -------------
 *  Finer lines        -> layers 70, spread 0.03
 *  Softer, hazier     -> shadeFalloff 40, grain 0.05
 *  A little wobble    -> amplitude 0.01, roughness 0.4
 *  Dead still         -> speed 0
 * ------------------------------------------------------------------------- */

export const straightLines = {
  ...dunes,
  label: "Straight lines — flattened ridges",
  config: {
    ...dunes.config,

    /** Many thin ridges is what turns the field into lines. */
    layers: 50,
    /** Almost flat: this is the knob that makes them straight. */
    amplitude: 0.002,
    frequency: 2.6,
    spread: 0.042,
    horizon: 0.92,
    roughness: 0.75,

    speed: 0.18,
    parallax: 0.8,
    scrollExpand: 1.5,

    mouseParallax: 0.18,
    mouseSwell: 0.075,
    mouseRadius: 0.22,
    mouseEase: 0.08,
    clickRipple: 0.07,
    clickDuration: 1.6,

    colorSky: "#000000",
    colorFar: "#39507d",
    colorNear: "#5f3300",

    /** Hard, tight rim is what makes each crest read as a drawn line. */
    shading: 0.9,
    shadeFalloff: 100,
    grain: 0.1,
    dpr: 0.6,
  },
};
