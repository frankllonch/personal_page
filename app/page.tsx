"use client";

import { motion } from "framer-motion";

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

  return (
    <main className="relative min-h-screen text-white bg-transparent overflow-visible z-10">

      {/* The background and the top bar come from app/layout.tsx, shared with the gallery. */}

      {/* GRID OF CONTENT */}
      <section className="max-w-7xl mx-auto px-6 pt-24 sm:pt-28 pb-12 relative z-10">
        <div className="flex justify-center mb-8">
          <ScrambledText
            radius={30}
            duration={0.8}
            speed={0.5}
            scrambleChars="*"
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