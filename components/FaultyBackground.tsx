"use client";

import dynamic from "next/dynamic";

const FaultyTerminal = dynamic(() => import("./Faultyterminal"), {
  ssr: false,
});

// Stable reference — prevents WebGL context from rebuilding on re-renders
const GRID_MUL: [number, number] = [2, 1];

export default function FaultyBackground() {
  return (
    <div className="fixed inset-0 z-[-20] pointer-events-none">
      <FaultyTerminal
        scale={5}
        gridMul={GRID_MUL}
        digitSize={0.3}
        timeScale={1}
        scanlineIntensity={1}
        glitchAmount={1}
        flickerAmount={0.5}
        noiseAmp={0.55}
        chromaticAberration={0}
        dpr={0.35}
        dither={0}
        curvature={0}
        tint="#696969"
        mouseReact={true}
        mouseStrength={1}
        pageLoadAnimation={false}
        brightness={1}
      />
    </div>
  );
}