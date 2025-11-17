"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";

// JS-safe background shapes
const DecorativeBackground = dynamic(
  () => import("@/components/DecorativeBackground"),
  { ssr: false }
);

export function BioCardInner() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="
        absolute inset-0
        w-full h-full
        [transform-style:preserve-3d]
      "
    >
      {/* ===================================================== */}
      {/* FRONT FACE — Portrait + Text + Socials               */}
      {/* ===================================================== */}
      <motion.div
        className="
          absolute inset-0
          p-6 flex flex-col items-center
          [backface-visibility:hidden]
        "
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        {/* holofoil overlay */}
        <div className="
          absolute inset-0 
          bg-gradient-to-br
          from-[rgba(244,211,94,0.12)]
          via-transparent
          to-[rgba(244,211,94,0.18)]
          opacity-0 group-hover:opacity-100
          transition-all duration-700
        " />

        <DecorativeBackground count={10} />

        {/* IMAGE */}
        <div className="relative z-20 mb-4">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-xl relative">
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
        <p className="relative z-20 text-3xl font-extrabold tracking-tight text-center">
          Frank Llonch
        </p>

        <p className="relative z-20 text-sm text-gray-300 mt-3 text-center leading-relaxed px-3">
          Barcelona-born engineering student and builder.  
          Tap to flip and reveal the back of the card.
        </p>

        {/* SOCIALS */}
        <div className="relative z-20 mt-5 flex gap-4">
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

      {/* ===================================================== */}
      {/* BACK FACE — Minimal F.                               */}
      {/* ===================================================== */}
      <motion.div
        className="
          absolute inset-0
          flex items-center justify-center
          bg-[#0A0A0A]
          border border-[#F4D35E]/10
          rounded-3xl
          shadow-inner
          [backface-visibility:hidden]
          rotate-y-180
        "
        animate={{ rotateY: flipped ? 0 : -180 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <p className="text-[6rem] font-black text-[#F4D35E] tracking-tight">
          F.
        </p>
      </motion.div>
    </div>
  );
}