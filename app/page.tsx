"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import DecorativeBackground from "@/components/DecorativeBackground";
import CurvedGrid from "@/components/CurveGrid";
import Particles from "@/components/particles";
import GlowCursor from "@/components/GlowCursor";

import Project from "@/components/project";
import Timeline from "@/components/timeline";

import { projects } from "@/lib/projects";
import { works, education } from "@/lib/data";


// -----------------------------
//  STAGGERED GRID ENTRANCE
// -----------------------------
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
//  SOFT NATURAL RANDOM TILT
// -----------------------------
function tileTilt(index: number) {
  const dirs = [
    { rotateX: 4, rotateY: -4 },
    { rotateX: -4, rotateY: 4 },
    { rotateX: 3, rotateY: 3 },
    { rotateX: -3, rotateY: -3 },
  ];
  return dirs[index % dirs.length];
}


// -----------------------------
//  POINTER-BASED 3D TILT
// -----------------------------
function handle3DTilt(
  e: React.MouseEvent,
  setStyle: (s: any) => void
) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // smoother + more natural
  const rotateX = ((y - rect.height / 2) / 35) * -1;
  const rotateY = ((x - rect.width / 2) / 35) * 1;

  setStyle({
    transform: `perspective(1200px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 scale(1.04)`,
  });
}

function reset3DTilt(setStyle: (s: any) => void) {
  setStyle({
    transform:
      "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)",
    transition: "transform 500ms ease",
  });
}


// ====================================================================
//  PAGE
// ====================================================================
export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-[#050A1A] text-white relative">

      {/* BACKGROUND SYSTEMS */}
      <CurvedGrid />
      <Particles />
      <GlowCursor />


      {/* ===================================================== */}
      {/* 🔷 BENTO GRID — BIO (2 rows) + PROJECTS (rest)       */}
      {/* ===================================================== */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 relative z-10">

        <motion.div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
            auto-rows-[200px]
          "
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* ===================================================== */}
          {/* 🔵 BIO (SPANS 2 ROWS)                                */}
          {/* ===================================================== */}
          <motion.div
            variants={tileVariants}
            whileHover={{
              y: -6,
              scale: 1.03,
              ...tileTilt(0),
            }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="
              bg-[#0D172F]
              border border-white/10
              rounded-3xl
              shadow-2xl
              relative
              overflow-hidden
              p-5
              group
              flex
              flex-col
              justify-start
              col-span-1
              row-span-2
            "
            style={{ transformPerspective: 1200 }}
          >

            {/* HOLOFOIL OVERLAY */}
            <div className="
              absolute inset-0
              bg-gradient-to-br
              from-sky-500/20 
              via-transparent 
              to-indigo-500/30
              opacity-0 group-hover:opacity-100
              transition-all duration-700
            "></div>

            {/* SHAPES */}
            <DecorativeBackground count={6} />

            {/* IMAGE */}
            <div className="relative z-20 w-full flex justify-left mb-4">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shadow-xl relative">
                <DecorativeBackground count={2} />
                <Image
                  src="/images/pedro.png"
                  alt="Frank"
                  width={260}
                  height={260}
                  className="object-cover w-full h-full relative z-20"
                />
              </div>
            </div>

            {/* TEXT */}
            <div className="relative z-20 text-left px-1">
              <p className="text-lg font-semibold">Hi, I'm Frank 👋</p>
              <p className="text-l mt-2 text-gray-300 leading-relaxed">
                Barcelona-born engineering student building models, pipelines,
                apps and automations that turn messy problems into clean systems.
              </p>
            </div>

            {/* SOCIALS */}
            <div className="relative z-20 mt-5 flex justify-bottom gap-4">
              {[
                {
                  href: "https://github.com/frankllonch",
                  img: "/images/github_logo.png",
                  alt: "GitHub",
                },
                {
                  href: "https://linkedin.com/in/YOUR-LINK",
                  img: "/images/linkedin_logo_sq.png",
                  alt: "LinkedIn",
                },
                {
                  href: "mailto:llonchfrank@gmail.com",
                  img: "/images/email.png",
                  alt: "Email",
                },
              ].map((s, i) => (
                <motion.a
                  key={i}
                  href={s.href}
                  target="_blank"
                  whileHover={{ scale: 1.08, y: -3 }}
                  transition={{ type: "spring", stiffness: 240, damping: 16 }}
                  className="
                    h-10 w-10 flex items-center justify-center 
                    bg-[#050A1A] border border-white/20 
                    rounded-xl shadow-md relative overflow-hidden group
                  "
                >
                  <DecorativeBackground count={1} />
                  <Image
                    src={s.img}
                    alt={s.alt}
                    width={22}
                    height={22}
                    className="z-20 relative"
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>


          {/* ===================================================== */}
          {/* 🔵 PROJECT TILES                                     */}
          {/* ===================================================== */}
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              variants={tileVariants}
              className="
                bg-[#0D172F]
                border border-white/10
                rounded-3xl
                shadow-xl
                relative overflow-hidden
                p-4 
                group cursor-pointer flex
              "
              onClick={() => window.open(project.link, "_blank")}
              style={{ transformPerspective: 1200 }}
              onMouseMove={(e) =>
                handle3DTilt(e, (s) => Object.assign(e.currentTarget.style, s))
              }
              onMouseLeave={(e) =>
                reset3DTilt((s) => Object.assign(e.currentTarget.style, s))
              }
            >
              <div className="
                absolute inset-0
                bg-gradient-to-br 
                from-sky-400/15 via-transparent to-indigo-500/20
                opacity-0 group-hover:opacity-100
                transition-all duration-700
              "></div>

              <DecorativeBackground count={4} />
              <Project {...project} />
            </motion.div>
          ))}

        </motion.div>
      </section>


      {/* ===================================================== */}
      {/* 🔷 WORK EXPERIENCE                                    */}
      {/* ===================================================== */}
      <section className="py-10 max-w-7xl mx-auto px-6 relative z-10">
        <h1 className="text-2xl font-semibold text-center mb-4">Work Experience</h1>
        <Timeline items={works} />
      </section>


      {/* ===================================================== */}
      {/* 🔷 EDUCATION                                          */}
      {/* ===================================================== */}
      <section className="py-10 max-w-7xl mx-auto px-6 relative z-10">
        <h1 className="text-2xl font-semibold text-center mb-4">Education</h1>
        <Timeline items={education} />
      </section>


      <footer className="py-10 text-center text-gray-500 text-sm relative z-20">
        Frank Llonch © {currentYear}
      </footer>
    </main>
  );
}