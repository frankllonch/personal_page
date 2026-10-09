"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ScrambledText from "./wierdtext";

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
        {/* FRONT OF CARD                                          */}
        {/* ====================================================== */}
        <div
          className="
            absolute inset-0
            rounded-3xl
            shadow-[0_10px_30px_rgba(0,0,0,0.10)]
            overflow-hidden
            border border-black/10
            flex flex-col
          "
          style={{ backfaceVisibility: "hidden" }}
        >

          {/* TOP BAR */}
          <div className="shrink-0 px-4 pt-3 pb-0 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-neutral-800">
              LV. 22
            </span>
            <span className="
              text-[10px] px-2 py-[2px]
              rounded-full border border-black/10
              text-neutral-700 tracking-wider
            ">
              HUMAN
            </span>
          </div>

          {/* PORTRAIT — flex-1 + min-h-0 so it absorbs the leftover height instead
              of an aspect ratio driving it past the card and clipping the bio */}
          <div className="px-4 pt-2 flex-1 min-h-0">
            <div
              className="
                relative w-full h-full
                rounded-3xl overflow-hidden
                shadow-[0_6px_20px_rgba(0,0,0,0.12)]
                border border-black/10
              "
            >

              <Image
                fill
                alt="Frank"
                src="/images/pedro.png"
                className="object-cover scale-150 object-[center_25%]"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            </div>
          </div>

          {/* NAME */}
          <p
            className="
              shrink-0 px-4 mt-3 text-2xl font-black tracking-tight text-neutral-900
            "
          >
            Frank Llonch
          </p>

          {/* BIO */}
          <p
            className="
              shrink-0 px-4 mt-2 pb-4 text-[13px] text-neutral-800 leading-relaxed
            "
          >
            Engineer navigating data, systems, AI automation and chaotic
            web experiments. Operates best at night.
          </p>

        </div>

        {/* ====================================================== */}
        {/* BACK OF CARD — SCRAMBLED INTRO TEXT                    */}
        {/* ====================================================== */}
        <div
          className="
            absolute inset-0
            rounded-3xl 
            flex items-center justify-center
            overflow-hidden
            border border-black/10
            p-6
          "
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="w-[100%] text-center select-none">
            <ScrambledText
              radius={10}
              duration={1.2}
              speed={0.5}
              scrambleChars=".:"
              className="
                text-[#4d7c0f]
                font-inter
                font-medium
                leading-relaxed
                text-center
                
              "
              style={{
                fontSize: "clamp(13px, 1.4vw, 18px)",
                lineHeight: "1.5",
              }}
            >
              Nothing here.
            </ScrambledText>
          </div>
        </div>

      </motion.div>
    </div>
  );
}