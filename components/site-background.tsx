"use client";

import dynamic from "next/dynamic";

// WebGL only runs client-side, and it is held back until the intro loader has
// left (see app/page.tsx) so the shader never competes with the intro.
const DunesShader = dynamic(() => import("./dunes-shader"), { ssr: false });

export default function SiteBackground() {
  return (
    <div
      // intro-bg-fade: mounts as the intro curtain starts lifting, so it has
      // the whole exit plus a long tail to come up.
      className="intro-bg-fade fixed inset-0 z-[-20] pointer-events-none"
    >
      <DunesShader />
    </div>
  );
}
