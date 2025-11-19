"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Hydration-safe DecorativeBackground
const DecorativeBackground = dynamic(
  () => import("./DecorativeBackground"),
  { ssr: false }
);

interface ProjectProps {
  title: string;
  subtitle: string;
  link: string;
  starred?: boolean;
  isNew?: boolean;
  isUpcoming?: boolean;
  pinned?: boolean;
  tags?: string[];
}

export default function Project({
  title,
  subtitle,
  link,
  starred,
  isNew,
  isUpcoming,
  pinned,
  tags = [],
}: ProjectProps) {
  const handleClick = () => window.open(link, "_blank");

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="
        w-full h-full
        bg-[#0A0A0A]
        border border-[#F4D35E]/10
        rounded-xl p-4
        shadow-lg cursor-pointer
        hover:shadow-xl
        transition-all duration-300
        select-none relative group
        overflow-hidden
        flex flex-col justify-between
      "
    >

      {/* background shapes */}
      <DecorativeBackground count={5} />

      {/* STATUS TAGS (your exact style) */}
      <div className="absolute top-0 right-0 flex flex-col items-end z-20">

        {isNew && (
          <div className="
            text-[10px] uppercase px-3 py-0.6
            bg-green-500/30 border-l border-b border-white/20
            rounded-bl-md text-white
          ">
            NEW
          </div>
        )}

        {starred && (
          <div className="
            text-[10px] uppercase px-3 py-0.6
            bg-yellow-500/30 border-l border-b border-white/20
            rounded-bl-md text-white
          ">
            STARRED
          </div>
        )}

        {isUpcoming && (
          <div className="
            text-[10px] uppercase px-3 py-0.6
            bg-purple-500/30 border-l border-b border-white/20
            rounded-bl-md text-white
          ">
            UPCOMING
          </div>
        )}

        {pinned && (
          <div className="
            text-[10px] uppercase px-3 py-0.6
            bg-blue-500/30 border-l border-b border-white/20
            rounded-bl-md text-white
          ">
            PINNED
          </div>
        )}

        {/* CATEGORY TAGS */}
        {tags.map((tag, i) => (
          <div
            key={i}
            className="
              text-[10px] uppercase px-3 py-0.6 mt-[1px]
              bg-yellow-400/10
              from-[#F4D35E]/10 to-[#E8B923]/15
              rounded-bl-md text-white
            "
          >
            {tag}
          </div>
        ))}
      </div>

      {/* TITLE */}
      <div className="relative z-20 text-base font-semibold text-white">
        {title}
      </div>

      {/* SUBTITLE */}
      <div className="relative z-20 text-sm text-gray-300 mt-1">
        {subtitle}
      </div>
    </motion.div>
  );
}