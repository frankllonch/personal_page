"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import DecorativeBackground from "@/components/DecorativeBackground";
import Project from "@/components/project";
import Timeline from "@/components/timeline";

import { projects } from "@/lib/projects";
import { works, education } from "@/lib/data";

// Faster, snappier, neon-mode animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      duration: 0.4,
    },
  },
};

const tileVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

// Random-ish tilt direction
function tiltForIndex(index: number) {
  const directions = [
    { rotateX: 4, rotateY: -4 },
    { rotateX: -4, rotateY: 4 },
    { rotateX: 3, rotateY: 3 },
    { rotateX: -3, rotateY: -3 },
  ];
  return directions[index % directions.length];
}

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-[#050A1A] text-white">

      {/* ===================================================== */}
      {/* 🔷 MAIN GRID — BIO (2 rows) + PROJECTS               */}
      {/* ===================================================== */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-10">

        <motion.div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
            auto-rows-[200px]          /* Slightly taller tiles */
          "
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >

          {/* ===================================================== */}
          {/* 🔵 BIO TILE (2 rows, centered image + full-width text) */}
          {/* ===================================================== */}
          <motion.div
            variants={tileVariants}
            whileHover={{
              y: -8,
              scale: 1.04,
              ...tiltForIndex(0),
            }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            style={{ transformPerspective: 1200 }}
            className="
              col-span-1
              row-span-2
              bg-[#0D172F]
              border border-white/10
              rounded-2xl
              shadow-xl
              relative overflow-hidden
              group
              flex flex-col
              items-center
              p-6
            "
          >
            {/* Neon hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-indigo-500/10 to-blue-600/30 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />

            {/* MORE geometric shapes */}
            <DecorativeBackground count={10} />

            {/* ---------------- IMAGE (centered) ---------------- */}
            <div className="relative z-20 w-24 h-24 md:w-28 md:h-28 mb-4 rounded-xl overflow-hidden shadow-xl">
              <DecorativeBackground count={2} />
              <Image
                src="/images/pedro.png"
                alt="Frank"
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>

            {/* ---------------- TEXT (full width) ---------------- */}
            <div className="relative z-20 text-center w-full">
              <p className="text-lg font-semibold mb-2">
                Hi, I’m Frank 👋
              </p>

              <p className="text-[12px] md:text-sm text-gray-300 leading-relaxed">
                Barcelona-born engineering student turning messy problems  
                into clean systems — models, automations, pipelines, and apps.
              </p>

              <p className="text-[12px] md:text-sm text-gray-300 leading-relaxed mt-2">
                I build fast. I break things. I learn. Scroll for proof.
              </p>
            </div>

            {/* ---------------- SOCIAL ICONS ---------------- */}
            <div className="relative z-20 mt-5 flex gap-3">
              {[
                {
                  href: "https://github.com/frankllonch",
                  img: "/images/github_logo.png",
                },
                {
                  href: "https://linkedin.com/in/YOUR-LINK",
                  img: "/images/linkedin_logo_sq.png",
                },
                {
                  href: "mailto:llonchfrank@gmail.com",
                  img: "/images/email.png",
                },
              ].map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  whileHover={{ y: -3, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="
                    h-10 w-10
                    flex items-center justify-center
                    bg-[#050A1A]
                    rounded-xl
                    border border-white/30
                    shadow-md shadow-cyan-500/10
                    hover:shadow-cyan-400/40
                    relative overflow-hidden group
                  "
                >
                  <DecorativeBackground count={1} />
                  <Image
                    src={item.img}
                    alt={item.href}
                    width={22}
                    height={22}
                    className="relative z-20"
                  />
                </motion.a>
              ))}
            </div>

          </motion.div>

          {/* ===================================================== */}
          {/* 🔷 PROJECT TILES (uniform size, neon + tilt)        */}
          {/* ===================================================== */}
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              variants={tileVariants}
              whileHover={{
                y: -8,
                scale: 1.04,
                ...tiltForIndex(index + 1),
              }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              style={{ transformPerspective: 1200 }}
              className="
                col-span-1
                bg-[#0D172F]
                border border-white/10
                rounded-2xl
                shadow-xl
                relative
                overflow-hidden
                p-4
                group
                cursor-pointer
                flex
              "
              onClick={() => window.open(project.link, "_blank")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-lg" />
              <DecorativeBackground count={6} />
              <Project {...project} />
            </motion.div>
          ))}

        </motion.div>
      </section>

      {/* ===================================================== */}
      {/* WORK EXPERIENCE                                       */}
      {/* ===================================================== */}
      <section className="py-10 max-w-7xl mx-auto px-6">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Work Experience
        </h1>
        <Timeline items={works} />
      </section>

      {/* ===================================================== */}
      {/* EDUCATION                                             */}
      {/* ===================================================== */}
      <section className="py-10 max-w-7xl mx-auto px-6">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Education
        </h1>
        <Timeline items={education} />
      </section>

      {/* ===================================================== */}
      {/* FOOTER                                                */}
      {/* ===================================================== */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>Frank Llonch © {currentYear}</p>
      </footer>
    </main>
  );
}