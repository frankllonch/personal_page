"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import DecorativeBackground from "@/components/DecorativeBackground";
import Project from "@/components/project";
import Timeline from "@/components/timeline";

import { projects } from "@/lib/projects";
import { works, education } from "@/lib/data";

// Parent container variants for staggered enter animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

// Each tile fades up with small offset
const tileVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

// "Random-ish" tilt per tile based on index
function tiltForIndex(index: number) {
  const directions = [
    { rotateX: 3, rotateY: -3 },
    { rotateX: -3, rotateY: 3 },
    { rotateX: 2, rotateY: 2 },
    { rotateX: -2, rotateY: -2 },
  ];
  return directions[index % directions.length];
}

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-[#050A1A] text-white">

      {/* ===================================================== */}
      {/* 🔷 BENTO GRID — BIO (2 rows) + PROJECTS               */}
      {/* ===================================================== */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-10">

        <motion.div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
            auto-rows-[190px]
          "
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >

          {/* ===================================================== */}
          {/* 🔵 BIO TILE — row-span-2 (your chosen layout)        */}
          {/* ===================================================== */}
          <motion.div
            variants={tileVariants}
            whileHover={{
              y: -6,
              scale: 1.02,
              ...tiltForIndex(0),
            }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{ transformPerspective: 1000 }}
            className="
              col-span-1
              row-span-2
              bg-[#0D172F]
              border border-white/10
              rounded-2xl
              shadow-xl
              relative
              overflow-hidden
              p-4
              group
              flex
              flex-col
              justify-between
            "
          >
            {/* gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/15 via-transparent to-indigo-500/25 opacity-0 group-hover:opacity-100 transition-all duration-700" />

            {/* geometric blobs */}
            <DecorativeBackground count={8} />

            {/* TOP: Photo + intro text */}
            <div className="relative z-20 flex items-center gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shadow-lg relative flex-shrink-0">
                <DecorativeBackground count={2} />
                <Image
                  src="/images/pedro.png"
                  alt="Frank"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full relative z-20"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm md:text-base font-semibold">
                  Hi, I’m Frank 👋
                </p>
                <p className="text-[11px] md:text-xs text-gray-300 mt-1 leading-relaxed">
                  Barcelona-born engineering student building models, pipelines,
                  apps and automations that turn messy problems into clean, useful systems.
                </p>
              </div>
            </div>

            {/* BOTTOM: Socials */}
            <div className="relative z-20 mt-6 flex gap-3">
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
              ].map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="
                    h-10 w-10
                    flex items-center justify-center
                    bg-[#050A1A]
                    rounded-xl
                    border border-white/20
                    shadow-md
                    relative overflow-hidden group
                  "
                >
                  <DecorativeBackground count={1} />
                  <Image
                    src={item.img}
                    alt={item.alt}
                    width={22}
                    height={22}
                    className="relative z-20"
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ===================================================== */}
          {/* 🔷 PROJECT TILES (uniform size)                      */}
          {/* ===================================================== */}
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              variants={tileVariants}
              whileHover={{
                y: -6,
                scale: 1.02,
                ...tiltForIndex(index + 1),
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{ transformPerspective: 1000 }}
              className="
                col-span-1
                bg-[#0D172F]
                border border-white/10
                rounded-2xl
                shadow-xl
                relative overflow-hidden
                p-4
                group
                cursor-pointer
                flex
              "
              onClick={() => window.open(project.link, "_blank")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-transparent to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <DecorativeBackground count={4} />
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