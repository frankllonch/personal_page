"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

import dynamic from "next/dynamic";

const DecorativeBackground = dynamic(
  () => import("@/components/DecorativeBackground"),
  { ssr: false }
);

import CurvedGrid from "@/components/CurveGrid";
import Particles from "@/components/particles";
import GlowCursor from "@/components/GlowCursor";

import Project from "@/components/project";
import Timeline from "@/components/timeline";
import { projects } from "@/lib/projects";
import { works, education } from "@/lib/data";

import PageReveal from "@/components/pagereveal";
import BioCard from "@/components/bio_card";


// GRID VARIANTS
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const tileVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};


// -----------------------------
// POINTER-BASED TILT (TYPESAFE)
// -----------------------------
function handle3DTilt(
  e: React.MouseEvent,
  apply: (s: React.CSSProperties) => void
) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const rotateX = ((y - rect.height / 2) / 30) * -2;
  const rotateY = ((x - rect.width / 2) / 30) * 2;

  apply({
    transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`,
  });
}

function reset3DTilt(apply: (s: React.CSSProperties) => void) {
  apply({
    transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)",
    transition: "transform 200ms ease",
  });
}



// ====================================================================
// PAGE
// ====================================================================
export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-black text-white relative">
      <PageReveal />

      {/* TOP-LEFT SIGNATURE + SOCIALS */}
      <div className="fixed top-6 left-6 z-[200] flex flex-col items-start gap-3">
        
        {/* signature */}
        <div className="font-inter font-black text-4xl tracking-tight">
          frank<span className="text-[#F4D35E]">.</span>
        </div>

        {/* SOCIAL ICONS */}
        <div className="flex flex-col gap-3">
          {[
            { href: "https://github.com/frankllonch", img: "/images/github-logo.png", alt: "GitHub" },
            { href: "https://linkedin.com/in/YOUR-LINK", img: "/images/linkedin_logo_sq.png", alt: "LinkedIn" },
            { href: "mailto:llonchfrank@gmail.com", img: "/images/email.png", alt: "Email" },
          ].map((s, i) => (
            <motion.a
              key={i}
              href={s.href}
              target="_blank"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 240, damping: 16 }}
              className="
                h-12 w-12 flex items-center justify-center
                bg-black border border-black/40
                rounded-xl shadow-[0_0_15px_rgba(244,211,94,0.12)]
              "
            >
              <Image src={s.img} alt={s.alt} width={28} height={28} />
            </motion.a>
          ))}
        </div>
      </div>


      {/* BACKGROUND SYSTEMS */}
      <CurvedGrid />
      <Particles color="#F4D35E" />
      <GlowCursor />



      {/* GRID */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
        
        <h1 className="text-3xl font-extrabold tracking-tight text-center mb-6">
          Check out my craft!
        </h1>

        <motion.div
          className="
            grid grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
            auto-rows-[200px]
          "
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* BIO CARD */}
          <motion.div
            variants={tileVariants}
            className="
              col-span-1 row-span-2
              bg-black border border-black/20 
              rounded-3xl relative overflow-hidden group p-1
            "
            style={{ transformPerspective: 1200 }}
            onMouseMove={(e) => handle3DTilt(e, s => Object.assign(e.currentTarget.style, s))}
            onMouseLeave={(e) => reset3DTilt(s => Object.assign(e.currentTarget.style, s))}
          >
            <BioCard />
          </motion.div>


          {/* PROJECT TILES */}
          {projects.map(project => (
            <motion.div
              key={project.slug}
              variants={tileVariants}
              className="
                bg-black border border-white/20
                rounded-3xl shadow-xl p-4 group 
                cursor-pointer relative overflow-hidden flex
              "
              onClick={() => window.open(project.link, "_blank")}
              style={{ transformPerspective: 1200 }}
              onMouseMove={(e) => handle3DTilt(e, s => Object.assign(e.currentTarget.style, s))}
              onMouseLeave={(e) => reset3DTilt(s => Object.assign(e.currentTarget.style, s))}
            >
              <DecorativeBackground count={4} />
              <Project {...project} />
            </motion.div>
          ))}

        </motion.div>
      </section>



      {/* WORK EXPERIENCE */}
      <section className="py-10 max-w-7xl mx-auto px-6 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-center mb-6">
          Work Experience
        </h1>
        <Timeline items={works} />
      </section>


      {/* EDUCATION */}
      <section className="py-10 max-w-7xl mx-auto px-6 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-center mb-6">
          Education
        </h1>
        <Timeline items={education} />
      </section>


      <footer className="py-10 text-center text-gray-500 text-sm">
        Frank Llonch © {currentYear}
      </footer>
    </main>
  );
}