"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

// Backgrounds
const FaultyBackground = dynamic(() => import("@/components/FaultyBackground"), { ssr: false });

// Content
import Project from "@/components/project";
import Timeline from "@/components/timeline";
import BioCard from "@/components/bio_card";
import ScrambledText from "@/components/wierdtext";

// Data
import { projects } from "@/lib/projects";
import { works, education } from "@/lib/data";

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


// =============================
// PAGE COMPONENT
// =============================
export default function Home() {
  const currentYear = new Date().getFullYear();

  // Hide the top bar while scrolling down, bring it back on scroll up.
  // REVEAL_AT is a small dead zone so a jittery trackpad can't flicker the bar.
  const [barHidden, setBarHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const delta = latest - previous;
    if (Math.abs(delta) < 4) return;

    if (delta > 0 && latest > 100) setBarHidden(true);
    else if (delta < 0) setBarHidden(false);
  });

  return (
    <main className="relative min-h-screen text-white bg-transparent overflow-visible z-10">

      {/* BACKGROUND — MUST BE FIRST & FIXED */}
      <FaultyBackground />


      {/* TOP BAR — SIGNATURE + SOCIALS
          Full-width fixed header. The inner container mirrors the content grid's
          `max-w-7xl mx-auto px-6` so the socials sit in the gutter alignment of the
          cards instead of floating over their first column on narrow viewports. */}
      <motion.header
        animate={{ y: barHidden ? "-100%" : "0%" }}
        initial={false}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="
          fixed top-0 inset-x-0 z-[200]
          bg-black/40 backdrop-blur-md
          border-b border-white/10
          will-change-transform
        "
      >
        <div
          className="
            max-w-7xl mx-auto px-6
            h-12 sm:h-14
            flex flex-row items-center justify-between gap-4
          "
        >
        {/* TITLE */}
        <div className="font-inter font-black tracking-tight hover:text-black transition-colors duration-300 cursor-default shrink-0">
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
            { href: "https://github.com/frankllonch", img: "/images/github-logo.png", alt: "GitHub" },
            { href: "https://linkedin.com/in/frankllonch", img: "/images/linkedin_logo_sq.png", alt: "LinkedIn" },
            { href: "mailto:llonchfrank@gmail.com", img: "/images/email.png", alt: "Email" },
          ].map((s, i) => (
            <motion.a
              key={i}
              href={s.href}
              target="_blank"
              whileHover={{ scale: 1.08, y: -2 }}
              transition={{ type: "spring", stiffness: 240, damping: 16 }}
              className="
                h-8 w-8 sm:h-9 sm:w-9 shrink-0
                flex items-center justify-center
                bg-black border border-white/20 rounded-xl
                shadow-[0_0_15px_rgba(244,211,94,0.15)]
              "
            >
              <Image src={s.img} alt={s.alt} width={18} height={18} />
            </motion.a>
          ))}

          {/* CV */}
          <motion.a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08, y: -2 }}
            transition={{ type: "spring", stiffness: 240, damping: 16 }}
            aria-label="Curriculum Vitae (PDF)"
            className="
              group
              h-8 w-8 sm:h-9 sm:w-9 shrink-0
              flex items-center justify-center
              bg-black border border-white/20 rounded-xl
              shadow-[0_0_15px_rgba(244,211,94,0.15)]
              hover:bg-white transition-colors duration-300
            "
          >
            {/* a plain div: globals.css has unlayered `a`/`span` colour rules that
                outrank Tailwind's layered utilities, so neither works here */}
            <div className="text-white group-hover:text-black font-bold text-xs sm:text-sm tracking-wide transition-colors duration-300">
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
            className="text-6xl font-extrabold tracking-tight text-center"
          >
            Check out my craft!
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
            className="col-span-1 row-span-2 bg-black/25 hover:bg-black/60 backdrop-blur-sm border border-white/15 rounded-3xl relative overflow-hidden group p-1 transition-colors duration-300 will-change-transform"
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
              className="bg-black/25 hover:bg-black/60 backdrop-blur-sm border border-white/15 rounded-3xl shadow-xl p-4 group cursor-pointer relative overflow-hidden flex transition-colors duration-300 will-change-transform"
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
            className="text-6xl font-extrabold text-center"
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
            className="text-6xl font-extrabold text-center"
          >
            Education
          </ScrambledText>
        </div>
        <Timeline items={education} />
      </section>

          <footer className="py-10 text-center text-gray-500 text-sm relative z-10">
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