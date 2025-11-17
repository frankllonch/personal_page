"use client";

import Project from "@/components/project";
import Timeline from "@/components/timeline";
import DecorativeBackground from "@/components/DecorativeBackground";

import { works, education } from "@/lib/data";
import { projects } from "@/lib/projects";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-[#050A1A] text-white">

      {/* ===================================================== */}
      {/*              🔷   MAIN BENTO GRID                    */}
      {/* ===================================================== */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div
          className="
            grid
            grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
            gap-6
          "
        >
          {/* ===================== BIO TILE ===================== */}
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="
              col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2
              bg-[#0D172F]
              border border-white/10
              rounded-2xl
              shadow-xl
              p-6
              relative
              overflow-hidden
              group
            "
          >
            {/* geometric bg */}
            <DecorativeBackground count={7} />

            {/* PHOTO */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden shadow-lg mb-4 relative z-20">
              <DecorativeBackground count={2} />
              <Image
                src="/images/pedro.png"
                alt="Frank"
                width={400}
                height={400}
                className="object-cover w-full h-full relative z-20"
              />
            </div>

            {/* TEXT */}
            <p className="relative z-20 text-xl font-semibold">
              Hi, I’m Frank 👋
            </p>

            <p className="relative z-20 text-sm text-gray-300 mt-2 leading-relaxed">
              Barcelona-born engineering student who likes turning messy problems
              into clean systems — models, pipelines, apps, whatever works.
            </p>

            <p className="relative z-20 text-sm text-gray-300 mt-2 leading-relaxed">
              I build fast, break things, and then rebuild them cleaner with data,
              AI and automation.
            </p>

            {/* SOCIAL ICONS INSIDE BIO TILE */}
            <div className="flex gap-3 mt-5 relative z-20">
              {[
                {
                  href: "https://github.com/frankllonch",
                  img: "/images/github_logo.png",
                },
                {
                  href: "https://linkedin.com/in/YOUR-LINK", // TODO: update
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
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="
                    h-11 w-11
                    flex items-center justify-center
                    bg-[#050A1A]
                    rounded-xl
                    border border-white/15
                    shadow-md
                    relative
                    overflow-hidden
                    group
                  "
                >
                  <DecorativeBackground count={1} />
                  <Image
                    src={item.img}
                    alt=""
                    width={26}
                    height={26}
                    className="relative z-20"
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ===================== PROJECT TILES ===================== */}
          {projects.map((project) => (
            <motion.div
              key={project.slug}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="
                bg-[#0D172F]
                border border-white/10
                rounded-2xl
                shadow-xl
                p-4
                relative
                overflow-hidden
                group
              "
            >
              <DecorativeBackground count={10} />
              <Project {...project} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================================================== */}
      {/*                  WORK EXPERIENCE                       */}
      {/* ===================================================== */}
      <section className="py-10 max-w-7xl mx-auto px-6">
        <Timeline items={works} />
      </section>

      {/* ===================================================== */}
      {/*                    EDUCATION                           */}
      {/* ===================================================== */}
      <section className="py-10 max-w-7xl mx-auto px-6">
        <Timeline items={education} />
      </section>

      {/* ===================================================== */}
      {/*                      FOOTER                            */}
      {/* ===================================================== */}
      <footer className="py-12 text-center text-gray-500 text-sm">
        <p>Frank Llonch © {currentYear}</p>
      </footer>
    </main>
  );
}