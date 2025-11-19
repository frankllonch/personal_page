"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";




const ScrambledText = dynamic(() => import("./wierdtext"), {ssr: false});

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
            shadow-[0_18px_50px_rgba(0,0,0,0.75)]
            overflow-hidden
            border border-white/15
          "
          style={{ backfaceVisibility: "hidden" }}
        >

          {/* TOP BAR */}
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
                rounded-3xl overflow-hidden 
                shadow-[0_12px_45px_rgba(0,0,0,0.9)]
                border border-white/15
              "
            >

              <Image
                fill
                alt="Frank"
                src="/images/pedro.png"
                className="object-cover"
              />
            </div>
          </div>

          {/* NAME */}
          <p
            className="
              px-4 mt-3 text-2xl font-black tracking-tight text-white
            "
          >
            Frank Llonch
          </p>

          {/* BIO */}
          <p
            className="
              px-4 mt-3 text-[13px] text-gray-400 leading-relaxed
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
            border border-white/15
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
                text-[#F4D35E]/80
                font-inter
                font-medium
                leading-relaxed
                text-center
                drop-shadow-[0_0_25px_rgba(244,211,94,0.25)]
              "
              style={{
                fontSize: "1.4vw", // 1/3 of giant F — perfect
                lineHeight: "1",
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