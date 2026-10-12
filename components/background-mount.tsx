"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { isIntroDone, onIntroDone } from "@/lib/intro";

const SiteBackground = dynamic(() => import("@/components/site-background"), { ssr: false });

// Upper bound on how long the background waits for the intro to finish.
const SAFETY_BACKGROUND_MS = 9000;

/**
 * Mounts the shader background once the intro loader has left.
 *
 * Lives in the layout so every page — the projects and the gallery — sits on
 * the same background. Held back until the intro is gone: compiling and
 * running a full-screen WebGL shader while the loader animates made the intro
 * stutter badly on Safari. It fades itself in on mount.
 */
export default function BackgroundMount() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Warm the background's chunks while the intro plays. Fetching and parsing
    // them is cheap; it's creating the WebGL context and compiling the shader
    // that costs, and that still waits for the intro to finish.
    void import("@/components/site-background");
    void import("@/components/background-shader");

    if (isIntroDone()) {
      setReady(true);
      return;
    }
    const off = onIntroDone(() => setReady(true));
    // Belt and braces: if the intro never reports in, still show the background.
    const t = window.setTimeout(() => setReady(true), SAFETY_BACKGROUND_MS);
    return () => {
      off();
      window.clearTimeout(t);
    };
  }, []);

  return ready ? <SiteBackground /> : null;
}
