"use client";

import Bio from "@/components/bio";
import Timeline from "@/components/timeline";
import Project from "@/components/project";
import DecorativeBackground from "@/components/DecorativeBackground";

import { bio, works, education } from "@/lib/data";
import { projects } from "@/lib/projects";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ----------------------------------------------------- */}
      {/* 🔷 TOP SECTION — PHOTO + BIO + SOCIAL ICONS           */}
      {/* ----------------------------------------------------- */}
      <section className="pt-12 pb-20 max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row justify-between items-start gap-10">

          {/* LEFT — PHOTO + BIO */}
          <div className="flex flex-col gap-4 w-full md:w-2/3">

            {/* Profile Picture */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="
                rounded-xl bg-white border border-gray-200
                shadow-sm hover:shadow-md
                w-44 h-44 overflow-hidden relative group
              "
            >
              {/* geometric background */}
              <DecorativeBackground svg="/shapes/triangle.svg" count={3} />

              <Image
                src="/images/sirt.png"
                alt="Frank"
                width={500}
                height={500}
                className="object-cover w-full h-full relative z-20"
              />
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="
                rounded-xl bg-white border border-gray-200
                shadow-sm hover:shadow-md p-6
                relative group overflow-hidden
              "
            >
              <DecorativeBackground svg="/shapes/circle.svg" count={5} />

              <p className="relative z-20 text-lg font-semibold">Hi, I’m Frank 👋</p>
              <p className="relative z-20 text-sm text-gray-700 mt-2">
                Barcelona-born engineering student who likes turning messy problems into clean systems—models, pipelines, apps, whatever works.
              </p>
              <p className="relative z-20 text-sm text-gray-700 mt-2">
                I build fast, learn by breaking things, and experiment with anything involving data, AI, or automation.
              </p>
              <p className="relative z-20 text-sm text-gray-700 mt-2">
                Scroll down — the rest speaks for itself.
              </p>
            </motion.div>
          </div>

          {/* RIGHT — SOCIAL ICONS */}
          <div className="flex flex-col gap-4 w-full md:w-auto">

            {[
              { href: "https://github.com/frankllonch", img: "/images/github_logo.png", alt: "GitHub" },
              { href: "https://linkedin.com/in/YOUR-LINK", img: "/images/linkedin_logo_sq.png", alt: "LinkedIn" },
              { href: "mailto:llonchfrank@gmail.com", img: "/images/email.png", alt: "Email" },
            ].map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                target="_blank"
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="
                  rounded-xl bg-white border border-gray-200
                  shadow-sm hover:shadow-md h-16 w-16
                  flex items-center justify-center relative group overflow-hidden
                "
              >
                {/* geometric shapes behind the icon */}
                <DecorativeBackground svg="/shapes/zigzag.svg" count={2} />

                <Image
                  src={item.img}
                  alt={item.alt}
                  width={40}
                  height={40}
                  className="relative z-20"
                />
              </motion.a>
            ))}

          </div>

        </div>
      </section>



      {/* ----------------------------------------------------- */}
      {/* 🔷 PROJECTS SECTION — GRID (NO SLIDER)                */}
      {/* ----------------------------------------------------- */}
      <section
        id="projects"
        className="pt-4 pb-32 max-w-7xl mx-auto px-6"
      >
        <h1 className="text-2xl text-center mb-2">These are some of my projects:</h1>
        <p className="text-sm text-center text-gray-300 mb-10">
          (Click any project to get more info)
        </p>

        {/* PROJECT GRID */}
        <div className="
          grid 
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
          gap-6
        ">
          {projects.map((project) => (
            <Project key={project.slug} {...project} />
          ))}
        </div>
      </section>



      {/* ----------------------------------------------------- */}
      {/* 🔷 WORK EXPERIENCE                                    */}
      {/* ----------------------------------------------------- */}
      <section className="py-10 max-w-7xl mx-auto px-6">
        <h1 className="text-2xl text-center">Work Experience</h1>
        <Timeline items={works} />
      </section>



      {/* ----------------------------------------------------- */}
      {/* 🔷 EDUCATION                                          */}
      {/* ----------------------------------------------------- */}
      <section className="py-10 max-w-7xl mx-auto px-6">
        <h1 className="text-2xl text-center">Education</h1>
        <Timeline items={education} />
      </section>



      {/* ----------------------------------------------------- */}
      {/* 🔷 FOOTER                                             */}
      {/* ----------------------------------------------------- */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>Frank Llonch © {currentYear}</p>
      </footer>

    </main>
  );
}