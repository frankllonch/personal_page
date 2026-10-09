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

export const shaders = {
  /** Pale dune ridges, near-white to yellow-green. Calm, low contrast. */
  dunes,
  /** Olive hillsides at a diagonal against blue sky, with cream rim light. */
  slopes,
};

export type ShaderName = keyof typeof shaders;

/** ←←← SWITCH THE BACKGROUND HERE: "dunes" | "slopes" */
export const ACTIVE: ShaderName = "slopes";

export const activeShader = shaders[ACTIVE];
