"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

// Backgrounds
const SiteBackground = dynamic(() => import("@/components/site-background"), { ssr: false });

// Content
import Project from "@/components/project";
import Timeline from "@/components/timeline";
import BioCard from "@/components/bio_card";
import ScrambledText from "@/components/wierdtext";

// Data
import { projects } from "@/lib/projects";
import { works, education } from "@/lib/data";
import { isIntroDone, onIntroDone } from "@/lib/intro";

import type { Variants } from "framer-motion";

// =============================
// ANIMATION VARIANTS
// =============================
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// =============================
// 3D Tilt Handler — RAF-throttled, disabled on touch devices
// =============================
let tiltRafId: number | null = null;

function handle3DTilt(e: React.MouseEvent<HTMLDivElement>) {
  if (tiltRafId !== null) return;

  // Capture everything before the RAF — React nulls currentTarget after the handler returns
  const clientX = e.clientX;
  const clientY = e.clientY;
  const target = e.currentTarget;

  tiltRafId = requestAnimationFrame(() => {
    if (!target) { tiltRafId = null; return; }
    const rect = target.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / 30) * -2;
    const rotateY = ((x - rect.width / 2) / 30) * 2;
    target.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    tiltRafId = null;
  });
}


// Shared look and feel for the square tiles in the top bar (socials + CV).
// No chip behind the icons — they sit straight on the page like the
// signature does. Only the sizing and centring remain.
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
// Upper bound on how long the background waits for the intro to finish.
const SAFETY_BACKGROUND_MS = 9000;

// =============================
// PAGE COMPONENT
// =============================
export default function Home() {
  const currentYear = new Date().getFullYear();

  // Hide the top bar while scrolling down, bring it back on scroll up.
  const [barHidden, setBarHidden] = useState(false);
  const [backgroundReady, setBackgroundReady] = useState(false);
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
      setBarHidden(false);
      return;
    }

    const delta = latest - (scrollY.getPrevious() ?? latest);
    if (Math.abs(delta) < BAR_SCROLL_JITTER) return;

    setBarHidden(delta > 0);
  });

  useEffect(() => {
    // Warm the background's chunks while the intro plays. Fetching and parsing
    // them is cheap; it's creating the WebGL context and compiling the shader
    // that costs, and that still waits for the intro to finish. Without this
    // the two chained dynamic imports only start once the curtain is already
    // lifting, so the background showed up a few hundred ms late.
    void import("@/components/site-background");
    void import("@/components/background-shader");

    if (isIntroDone()) {
      setBackgroundReady(true);
      return;
    }
    const off = onIntroDone(() => setBackgroundReady(true));
    // Belt and braces: if the intro never reports in, still show the background.
    const t = window.setTimeout(() => setBackgroundReady(true), SAFETY_BACKGROUND_MS);
    return () => {
      off();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <main className="relative min-h-screen text-white bg-transparent overflow-visible z-10">

      {/* BACKGROUND — MUST BE FIRST & FIXED.
          Held back until the intro loader is gone: compiling and running a
          full-screen WebGL shader while the loader animates made the intro
          stutter badly on Safari. It fades itself in on mount. */}
      {backgroundReady && <SiteBackground />}


      {/* TOP BAR — SIGNATURE + SOCIALS
          Full-width fixed header. The inner container mirrors the content grid's
          `max-w-7xl mx-auto px-6` so the socials sit in the gutter alignment of the
          cards instead of floating over their first column on narrow viewports. */}
      <motion.header
        animate={{ y: barHidden ? "-100%" : "0%" }}
        initial={false}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        // No bar: the signature and the links just sit over the page. They
        // still slide away on scroll down and come back on scroll up.
        className="
          fixed top-0 inset-x-0 z-[200]
          pointer-events-none
          will-change-transform
        "
      >
        <div
          className="
            max-w-7xl mx-auto px-6
            h-12 sm:h-14
            flex flex-row items-center justify-between gap-4
            [&>*]:pointer-events-auto
          "
        >
          {/* TITLE */}
          <div className="on-shader font-inter font-black tracking-tight hover:text-[#F4D35E] transition-colors duration-300 cursor-default shrink-0">
            <ScrambledText
              className="scrambled-text-demo text-2xl sm:text-3xl"
              radius={30}
              duration={0.4}
              speed={0.5}
              scrambleChars="*"
            >
              frank
            </ScrambledText>
          </div>

          {/* SOCIALS */}
          <div
            className="
              flex flex-row items-center
              gap-2 sm:gap-3
            "
          >
            {[
              // The GitHub mark is natively white, which suits the white text now.
              { href: "https://github.com/frankllonch", img: "/images/github-logo.png", alt: "GitHub", invert: false },
              { href: "https://linkedin.com/in/frankllonch", img: "/images/linkedin_logo_sq.png", alt: "LinkedIn", invert: false },
              { href: "mailto:llonchfrank@gmail.com", img: "/images/email.png", alt: "Email", invert: false },
            ].map((s) => (
              <motion.a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={TILE_HOVER}
                transition={TILE_SPRING}
                className={TILE_CLASS}
              >
                <Image
                  src={s.img}
                  alt={s.alt}
                  width={18}
                  height={18}
                  style={s.invert ? { filter: "invert(1)" } : undefined}
                />
              </motion.a>
            ))}

            {/* CV */}
            <motion.a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={TILE_HOVER}
              transition={TILE_SPRING}
              aria-label="Curriculum Vitae (PDF)"
              className={`${TILE_CLASS} group`}
            >
              {/* a plain div: globals.css has unlayered `a`/`span` colour rules that
                  outrank Tailwind's layered utilities, so neither works here */}
              <div className="on-shader text-white group-hover:text-[#F4D35E] font-bold text-xs sm:text-sm tracking-wide transition-colors duration-300">
                CV
              </div>
            </motion.a>
          </div>
        </div>
      </motion.header>

      {/* GRID OF CONTENT */}
      <section className="max-w-7xl mx-auto px-6 pt-24 sm:pt-28 pb-12 relative z-10">
        <div className="flex justify-center mb-8">
          <ScrambledText
            radius={30}
            duration={0.8}
            speed={0.5}
            scrambleChars="fl"
            className="on-shader text-6xl font-extrabold tracking-tight text-center text-white"
          >
            Projects
          </ScrambledText>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[180px] sm:auto-rows-[200px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* BIO CARD */}
          <motion.div
            variants={tileVariants}
            className="col-span-1 row-span-2 bg-transparent hover:bg-white/10 backdrop-blur-[2px] border border-white/20 rounded-3xl relative overflow-hidden group p-1 transition-colors duration-300 will-change-transform"
            onMouseMove={handle3DTilt}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)";
              e.currentTarget.style.transition = "transform 200ms ease";
            }}
          >
            <BioCard />
          </motion.div>

          {/* PROJECTS */}
          {projects.map((project) => (
            <motion.div
              key={project.slug}
              variants={tileVariants}
              className="bg-transparent hover:bg-white/10 backdrop-blur-[2px] border border-white/20 rounded-3xl shadow-xl p-4 group cursor-pointer relative overflow-hidden flex transition-colors duration-300 will-change-transform"
              // Sole click owner. <Project> is presentational; handling the click in
              // both places turned one click into two window.open calls (two tabs).
              onClick={() => window.open(project.link, "_blank")}
              onMouseMove={handle3DTilt}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)";
                e.currentTarget.style.transition = "transform 200ms ease";
              }}
            >
              <Project {...project} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* WORK EXPERIENCE */}
      <section className="py-10 max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex justify-center mb-6">
          <ScrambledText
            radius={30}
            duration={0.8}
            speed={0.5}
            scrambleChars="*"
            className="on-shader text-6xl font-extrabold text-center text-white"
          >
            Work Experience
          </ScrambledText>
        </div>
        <Timeline items={works} />
      </section>

      {/* EDUCATION */}
      <section className="py-10 max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex justify-center mb-6">
          <ScrambledText
            radius={30}
            duration={0.8}
            speed={0.5}
            scrambleChars="*"
            className="on-shader text-6xl font-extrabold text-center text-white"
          >
            Education
          </ScrambledText>
        </div>
        <Timeline items={education} />
      </section>

          <footer className="on-shader py-10 text-center text-white text-sm relative z-10">
      <div className="flex justify-center items-center gap-4 flex-wrap">

        {/* Copyright */}
        <span className="opacity-80">
          Frank Llonch © {currentYear}
        </span>

        <span className="opacity-40">•</span>

        {/* GitHub Repo */}
        <a
          href="https://github.com/frankllonch/personal_page"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#F4D35E] transition-colors duration-300"
        >
          Fork this project ↗
        </a>

        <span className="opacity-40">•</span>

        {/* Inspiration */}
        <a
          href="https://gabrielferrate.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#F4D35E] transition-colors duration-300"
        >
          Inspired by gabrielferrate.com ↗
        </a>

      </div>
    </footer>
    </main>
  );
}