"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isIntroDone, onIntroDone } from "@/lib/intro";

const SiteBackground = dynamic(() => import("@/components/site-background"), { ssr: false });

// Upper bound on how long the background waits for the intro to finish.
const SAFETY_BACKGROUND_MS = 9000;

/**
 * Mounts the shader background once the intro loader has left.
 *
 * Lives in the layout, but not every page wants it: the gallery is a plain
 * white sheet (see gallery.css), so there nothing is mounted — or fetched.
 * Held back until the intro is gone: compiling and running a full-screen
 * WebGL shader while the loader animates made the intro stutter badly on
 * Safari. It fades itself in on mount.
 */
export default function BackgroundMount() {
  const pathname = usePathname();
  const plain = pathname === "/gallery" || pathname?.startsWith("/gallery/");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (plain) return;
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
  }, [plain]);

  return ready && !plain ? <SiteBackground /> : null;
}
