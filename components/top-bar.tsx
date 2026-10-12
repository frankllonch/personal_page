"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import ScrambledText from "@/components/wierdtext";

/**
 * The signature, the gallery link and the socials, fixed over every page.
 * No bar behind them — they sit on the page — and they slide away on scroll
 * down and come back on scroll up.
 *
 * Lives in the layout so the home page and the gallery share one header; the
 * only thing that changes between them is where the link beside the signature
 * points.
 */

// Shared look and feel for the square tiles (socials + CV): only sizing and
// centring, no chip behind them.
const TILE_CLASS = `
  h-8 w-8 sm:h-9 sm:w-9 shrink-0
  flex items-center justify-center
`;
const TILE_HOVER = { scale: 1.08, y: -2 };
const TILE_SPRING = { type: "spring", stiffness: 240, damping: 16 } as const;

// Above this scroll offset the top bar is always visible.
const BAR_ALWAYS_VISIBLE_ABOVE = 100;
// Ignore scroll deltas smaller than this so trackpad jitter can't flicker the bar.
const BAR_SCROLL_JITTER = 4;

const SOCIALS = [
  // The GitHub mark is natively white, which suits the white text.
  { href: "https://github.com/frankllonch", img: "/images/github-logo.png", alt: "GitHub" },
  { href: "https://linkedin.com/in/frankllonch", img: "/images/linkedin_logo_sq.png", alt: "LinkedIn" },
  { href: "mailto:llonchfrank@gmail.com", img: "/images/email.png", alt: "Email" },
];

export default function TopBar() {
  const pathname = usePathname();
  const onGallery = pathname === "/gallery" || pathname?.startsWith("/gallery/");
  // The gallery is a white sheet with no shader: black type, no halo, and a
  // quieter hover than the yellow, which has nothing to stand on there.
  const ink = onGallery
    ? "text-black group-hover:text-neutral-500"
    : "on-shader text-white group-hover:text-[#F4D35E]";

  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const hadFirstScrollEvent = useRef(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // On mount framer-motion reports the current offset once. When the browser
    // restores a scrolled position on reload that reads as a huge downward
    // delta, which would hide the bar with no user gesture — so skip it.
    if (!hadFirstScrollEvent.current) {
      hadFirstScrollEvent.current = true;
      return;
    }
    // Near the top the bar is always shown, so a slow upward scroll made of
    // sub-jitter deltas can't strand it off-screen.
    if (latest <= BAR_ALWAYS_VISIBLE_ABOVE) {
      setHidden(false);
      return;
    }
    const delta = latest - (scrollY.getPrevious() ?? latest);
    if (Math.abs(delta) < BAR_SCROLL_JITTER) return;
    setHidden(delta > 0);
  });

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      initial={false}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      // The strip itself takes no clicks; the controls opt back in. An
      // invisible full-width bar must not swallow clicks meant for the page.
      className="fixed top-0 inset-x-0 z-[200] pointer-events-none will-change-transform"
    >
      <div
        className="
          max-w-7xl mx-auto px-6
          h-12 sm:h-14
          flex flex-row items-center justify-between gap-4
          [&>*]:pointer-events-auto
        "
      >
        <div className="flex items-center gap-4 sm:gap-6">
          {/* SIGNATURE — home */}
          <Link href="/" aria-label="Home" className="group shrink-0">
            {/* Colour and weight on a div, as for the links below: the bare
                <a> and <p> rules in globals.css would override them on the
                anchor or the paragraph; `ink-inherit` passes them down. */}
            <div className={`${ink} font-black tracking-tight transition-colors duration-300`}>
              <ScrambledText
                className="ink-inherit text-2xl sm:text-3xl"
                radius={30}
                duration={0.4}
                speed={0.5}
                scrambleChars="*"
              >
                frank
              </ScrambledText>
            </div>
          </Link>

          {/* GALLERY ⇄ PROJECTS */}
          <Link
            href={onGallery ? "/" : "/gallery"}
            aria-current={onGallery ? "page" : undefined}
            className="group shrink-0"
          >
            {/* A div, not the <a>: globals.css colours every bare <a> with the
                accent, outside any layer, so a Tailwind colour on it loses. */}
            <div className={`${ink} font-bold text-xs sm:text-sm tracking-wide transition-colors duration-300`}>
              {onGallery ? "projects" : "gallery"}
            </div>
          </Link>
        </div>

        {/* SOCIALS + CV */}
        <div className="flex flex-row items-center gap-2 sm:gap-3">
          {SOCIALS.map((s) => (
            <motion.a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={TILE_HOVER}
              transition={TILE_SPRING}
              className={TILE_CLASS}
            >
              {/* The GitHub mark is white; on the gallery's white sheet it is inverted. */}
              <Image src={s.img} alt={s.alt} width={18} height={18} className={onGallery && s.alt === "GitHub" ? "invert" : undefined} />
            </motion.a>
          ))}

          <motion.a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={TILE_HOVER}
            transition={TILE_SPRING}
            aria-label="Curriculum Vitae (PDF)"
            className={`${TILE_CLASS} group`}
          >
            <div className={`${ink} font-bold text-xs sm:text-sm tracking-wide transition-colors duration-300`}>
              CV
            </div>
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}
