/* ===========================================================================
 *  WHICH BACKGROUND IS LIVE
 * ===========================================================================
 *
 *  >>> Change ACTIVE below and save. That is the whole switch. <<<
 *
 *  Each effect is one self-contained file in this folder. To tune the one
 *  that is running, open its file and edit its `config` — every value is
 *  commented, with preset recipes at the top.
 *
 *  Adding your own: copy ./slopes.ts, rename the export, change `fragment`,
 *  `config` and `uniforms`, then add it to `shaders` below. See ./types.ts
 *  for the contract and the uniforms the renderer always supplies.
 * ------------------------------------------------------------------------- */

import { dunes } from "./dunes";
import { slopes } from "./slopes";
import { straightLines } from "./straight-lines";

export const shaders = {
  /** Pale dune ridges, near-white to yellow-green. Calm, low contrast. */
  dunes,
  /** Olive hillsides at a diagonal against blue sky, with cream rim light. */
  slopes,
  /** The ridge field flattened into fine stacked lines. */
  straightLines,
};

export type ShaderName = keyof typeof shaders;

/** ←←← SWITCH THE BACKGROUND HERE: "dunes" | "slopes" | "straightLines" */
export const ACTIVE: ShaderName = "dunes";

export const activeShader = shaders[ACTIVE];
