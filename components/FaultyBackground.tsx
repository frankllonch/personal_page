"use client";

import dynamic from "next/dynamic";

const FaultyTerminal = dynamic(() => import("./Faultyterminal"), {
  ssr: false,
});

export default function FaultyBackground() {
  return (
    <div
      className="fixed inset-0 z-[-20] pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    >
      <FaultyTerminal
        scale={5}
        gridMul={[2, 1]}
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
        tint="#ff0008"
        mouseReact={true}
        mouseStrength={1}
        pageLoadAnimation={false}
        brightness={0.5}
      />
    </div>
  );
}