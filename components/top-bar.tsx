"use client";

import Link from "next/link";
import ScrambledText from "@/components/wierdtext";
import { site } from "@/lib/data";

const NAV = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

/**
 * The signature, the sections, the links — fixed over the page with nothing
 * behind them. The bar is drawn in `difference`, so it is white over the
 * black sheet and goes black over whatever white scrolls under it (an
 * inverted box, an image), instead of sitting on a strip of its own.
 */
export default function TopBar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 mix-blend-difference text-white">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 h-12 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 md:gap-10 min-w-0">
          {/* THE SIGNATURE — size and weight live on this line: text-3xl / sm:text-4xl
              (Tailwind sizes) and font-black (Inter 900). */}
          <Link href="/" aria-label="Top" className="font-black text-3xl sm:text-4xl tracking-tighter shrink-0">
            <ScrambledText radius={30} duration={0.4} speed={0.5} scrambleChars="*">
              {site.signature}
            </ScrambledText>
          </Link>
          <nav className="hidden md:flex items-center gap-6 label">
            {NAV.map((n) => (
              <a key={n.href} href={n.href}>
                <ScrambledText radius={20} duration={0.4} speed={0.5} scrambleChars="*">
                  {n.label}
                </ScrambledText>
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 label">
          {site.links.filter((l) => l.label !== "Instagram").map((l) => (
            <a key={l.href} href={l.href} target={l.href.startsWith("/") || l.href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer">
              <ScrambledText radius={20} duration={0.4} speed={0.5} scrambleChars="*">
                {l.label}
              </ScrambledText>
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
