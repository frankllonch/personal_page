"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";

// Backgrounds
const FaultyBackground = dynamic(() => import("@/components/FaultyBackground"), { ssr: false });
const CurvedGrid = dynamic(() => import("@/components/CurveGrid"), { ssr: false });



// Content
import Project from "@/components/project";
import Timeline from "@/components/timeline";
import BioCard from "@/components/bio_card";
import ScrambledText from "@/components/wierdtext";

// Data
import { projects } from "@/lib/projects";
import { works, education } from "@/lib/data";

import PageReveal from "@/components/pagereveal";
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
// 3D Tilt Handler
// =============================
function handle3DTilt(
  e: React.MouseEvent<HTMLDivElement>,
  setStyle: (styles: React.CSSProperties) => void
) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const rotateX = ((y - rect.height / 2) / 30) * -2;
  const rotateY = ((x - rect.width / 2) / 30) * 2;

  setStyle({
    transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`,
  });
}

function reset3DTilt(setStyle: (styles: React.CSSProperties) => void) {
  setStyle({
    transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)",
    transition: "transform 200ms ease",
  });
}

// =============================
// PAGE COMPONENT
// =============================
export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="relative min-h-screen text-white bg-transparent overflow-visible z-10">
      {/* PAGE REVEAL */}
      <PageReveal />

      {/* BACKGROUND — MUST BE FIRST & FIXED */}
      <FaultyBackground />


      {/* TOP LEFT — SIGNATURE + SOCIALS */}
      <div
        className="
          fixed top-4 left-4 z-[200]
          flex flex-col gap-3
        "
      >
        {/* TITLE */}
        <div className="font-inter font-black text-6xl sm:text-7xl tracking-tight">
          <ScrambledText
            className="scrambled-text-demo text-8xl sm:text-8xl"
            radius={30}
            duration={0.4}
            speed={0.5}
            scrambleChars=".:"
            
          >
            frank
          </ScrambledText>
        </div> 

        {/* SOCIALS */}
        <div
          className="
            flex flex-row gap-3
            sm:flex-col sm:gap-4
            mt-1
          "
        >
          {[
            { href: "https://github.com/frankllonch", img: "/images/github-logo.png", alt: "GitHub" },
            { href: "https://linkedin.com/in/YOUR-LINK", img: "/images/linkedin_logo_sq.png", alt: "LinkedIn" },
            { href: "mailto:llonchfrank@gmail.com", img: "/images/email.png", alt: "Email" },
          ].map((s, i) => (
            <motion.a
              key={i}
              href={s.href}
              target="_blank"
              whileHover={{ scale: 1.08, y: -2 }}
              transition={{ type: "spring", stiffness: 240, damping: 16 }}
              className="
                h-10 w-10 sm:h-12 sm:w-12
                flex items-center justify-center
                bg-transparent border border-black/20 rounded-xl
                shadow-[0_0_15px_rgba(244,211,94,0.15)]
              "
            >
              <Image src={s.img} alt={s.alt} width={24} height={24} />
            </motion.a>
          ))}
        </div>
      </div>

      {/* GRID OF CONTENT */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-center mb-8">
          Check out my craft!
        </h1>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[200px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* BIO CARD */}
          <motion.div
            variants={tileVariants}
            className="col-span-1 row-span-2 bg-transparent/60 backdrop-blur border border-white/15 rounded-3xl relative overflow-hidden group p-1"
            onMouseMove={(e) => handle3DTilt(e, (s) => Object.assign(e.currentTarget.style, s))}
            onMouseLeave={() => reset3DTilt((s) => {})}
          >
            <BioCard />
          </motion.div>

          {/* PROJECTS */}
          {projects.map((project) => (
            <motion.div
              key={project.slug}
              variants={tileVariants}
              className="bg-transparent/60 backdrop-blur border border-white/15 rounded-3xl shadow-xl p-4 group cursor-pointer relative overflow-hidden flex"
              onClick={() => window.open(project.link, "_blank")}
              onMouseMove={(e) => handle3DTilt(e, (s) => Object.assign(e.currentTarget.style, s))}
              onMouseLeave={() => reset3DTilt((s) => {})}
            >
              <Project {...project} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* WORK EXPERIENCE */}
      <section className="py-10 max-w-7xl mx-auto px-6 relative z-10">
        <h1 className="text-3xl font-extrabold text-center mb-6">Work Experience</h1>
        <Timeline items={works} />
      </section>

      {/* EDUCATION */}
      <section className="py-10 max-w-7xl mx-auto px-6 relative z-10">
        <h1 className="text-3xl font-extrabold text-center mb-6">Education</h1>
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