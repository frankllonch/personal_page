"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";

const DecorativeBackground = dynamic(
  () => import("@/components/DecorativeBackground"),
  { ssr: false }
);

export default function BioCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-full cursor-pointer select-none"
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.45, 0.15, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >

        {/* ====================================================== */}
        {/* FRONT — MINIMAL Y2K CARD                              */}
        {/* ====================================================== */}
        <div
          className="
            absolute inset-0
            rounded-3xl
            bg-gradient-to-br from-black via-[#0A0A0A] to-[#1A1A1A]
            shadow-[0_18px_50px_rgba(0,0,0,0.75)]
            overflow-hidden
            border border-white/15
          "
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* subtle wash */}
          <div className="
            absolute inset-0
            bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_60%)]
          " />

          {/* ================================================== */}
          {/* TOP BAR — LV + HUMAN                               */}
          {/* ================================================== */}
          <div className="px-4 pt-3 pb-0 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-gray-400">
              LV. 22
            </span>
            <span className="
              text-[10px] px-2 py-[2px]
              rounded-full border border-white/15
              text-gray-300 tracking-wider
            ">
              HUMAN
            </span>
          </div>

          {/* PORTRAIT */}
          <div className="px-4 pt-2">
            <div
              className="
                relative w-full aspect-[4/3]
                rounded-3xl overflow-hidden bg-black
                shadow-[0_12px_45px_rgba(0,0,0,0.9)]
                border border-white/15
              "
            >
              <DecorativeBackground count={2} />
              <Image
                fill
                alt="Frank"
                src="/images/pedro.png"
                className="object-cover"
              />
            </div>
          </div>

          {/* NAME — pulled up */}
          <p
            className="
              px-4 mt-3 text-2xl font-black tracking-tight text-white
            "
          >
            Frank Llonch
          </p>

          {/* BIO TEXT BLOCK — pulled up, border removed */}
          <p
            className="
              px-4 mt-3 text-[13px] text-gray-400 leading-relaxed
            "
          >
            Engineer navigating data, systems, AI automation and chaotic
            web experiments. Operates best at night.
          </p>

          {/* bottom glow */}
          <div className="
            absolute bottom-0 left-0 right-0 h-20
            bg-[radial-gradient(circle_at_bottom,rgba(244,211,94,0.18),transparent_70%)]
          " />
        </div>

        {/* ====================================================== */}
        {/* BACK — GIANT “F” THAT ACTUALLY GROWS                  */}
        {/* ====================================================== */}
        <div
          className="
            absolute inset-0
            rounded-3xl
            bg-black
            flex items-center justify-center
            overflow-visible
            border border-white/15
          "
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >

          {/* GIANT F */}
          <motion.span
            initial={{ scale: 1, opacity: 0.9 }}
            animate={{
              scale: [1, 1.07, 1],
              opacity: [0.9, 1, 0.95],
              x: [0, 1.2, -1.2, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              font-inter font-black
              text-[#F4D35E]
              drop-shadow-[0_0_60px_rgba(244,211,94,0.45)]
              leading-none
              pointer-events-none select-none
              absolute
            "
            style={{
              fontSize: "5vw",   // larger now
              lineHeight: 1,
              transformOrigin: "center",
            }}
          >
            f
          </motion.span>
        </div>

      </motion.div>
    </div>
  );
}