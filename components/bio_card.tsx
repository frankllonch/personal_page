"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";

// Hydration-safe shapes
const DecorativeBackground = dynamic(
  () => import("./DecorativeBackground"),
  { ssr: false }
);

interface BioCardProps {
  photo: string;
}

export default function BioCard({ photo }: BioCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      onClick={() => setFlipped(!flipped)}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="
        relative
        w-full h-full
        col-span-1 row-span-2
        rounded-3xl overflow-hidden
        cursor-pointer select-none
        [transform-style:preserve-3d]
        bg-[#0A0A0A] border border-[#F4D35E]/10 shadow-2xl
      "
      style={{
        perspective: "1400px",
      }}
    >
      {/* ------------------------------ */}
      {/* FRONT FACE — character card    */}
      {/* ------------------------------ */}
      <motion.div
        className="
          absolute inset-0 p-5
          flex flex-col items-center
          [backface-visibility:hidden]
        "
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        {/* subtle holofoil */}
        <div className="
          absolute inset-0 opacity-0 group-hover:opacity-100
          bg-gradient-to-br from-[rgba(244,211,94,0.12)]
          via-transparent to-[rgba(244,211,94,0.18)]
          transition-all duration-700 z-0
        " />

        <DecorativeBackground count={10} />

        {/* IMAGE */}
        <div className="relative z-10 mb-3">
          <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-xl relative">
            <DecorativeBackground count={2} />
            <Image
              src={photo}
              alt="Frank"
              width={300}
              height={300}
              className="object-cover w-full h-full relative z-20"
            />
          </div>
        </div>

        {/* NAME */}
        <p className="relative z-10 text-3xl font-extrabold tracking-tight mb-2">
          Frank Llonch
        </p>

        {/* DESCRIPTION */}
        <p className="relative z-10 text-sm text-gray-300 text-center px-3 leading-relaxed">
          Barcelona-born engineering student, explorer, always building cool 
          things and breaking stuff to learn. Tap to flip ↓
        </p>

        {/* SOCIALS */}
        <div className="relative z-10 mt-6 flex gap-4">
          {[
            {
              href: "https://github.com/frankllonch",
              img: "/images/github-logo.png",
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
              whileHover={{ scale: 1.15, y: -3 }}
              transition={{ type: "spring", stiffness: 240, damping: 16 }}
              className="
                h-10 w-10 flex items-center justify-center 
                bg-black border border-white/20 
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

      {/* ------------------------------ */}
      {/* BACK FACE — clean minimal "F."  */}
      {/* ------------------------------ */}
      <motion.div
        className="
          absolute inset-0 p-5
          flex items-center justify-center
          bg-[#0A0A0A] border border-[#F4D35E]/10
          rounded-3xl shadow-inner
          [backface-visibility:hidden]
          rotate-y-180
        "
        animate={{ rotateY: flipped ? 0 : -180 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <p className="text-[6rem] font-black tracking-tighter text-[#F4D35E]">
          F.
        </p>
      </motion.div>
    </motion.div>
  );
}