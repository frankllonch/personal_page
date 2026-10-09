"use client";

import { memo } from "react";
import { motion } from "framer-motion";

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

// Presentational only — the wrapping tile in app/page.tsx owns the click, so the
// whole tile (including its padding) is clickable and one click opens one tab.
const Project = memo(function Project({
  title,
  subtitle,
  starred,
  isNew,
  isUpcoming,
  pinned,
  tags = [],
}: ProjectProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="
        w-full h-full
        bg-transparent
        border border-white/10
        rounded-xl p-4
        shadow-lg cursor-pointer
        hover:shadow-xl
        transition-[transform,box-shadow] duration-300
        select-none relative group
        overflow-hidden
        flex flex-col justify-between
      "
    >


      {/* STATUS TAGS (your exact style) */}
      <div className="absolute top-0 right-0 flex flex-col items-end z-20">

        {isNew && (
          <div className="
            text-[10px] uppercase px-3 py-0.6
            bg-[#F4D35E] border-l border-b border-black/20
            rounded-bl-md text-neutral-900
          ">
            NEW
          </div>
        )}

        {starred && (
          <div className="
            text-[10px] uppercase px-3 py-0.6
            bg-[#b7891b] border-l border-b border-black/10
            rounded-bl-md text-white
          ">
            STARRED
          </div>
        )}

        {isUpcoming && (
          <div className="
            text-[10px] uppercase px-3 py-0.6
            bg-[#6d4aa6] border-l border-b border-black/10
            rounded-bl-md text-white
          ">
            UPCOMING
          </div>
        )}

        {pinned && (
          <div className="
            text-[10px] uppercase px-3 py-0.6
            bg-[#2a5f9e] border-l border-b border-black/10
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
              bg-black/30
              rounded-bl-md text-white
            "
          >
            {tag}
          </div>
        ))}
      </div>

      {/* TITLE */}
      <div className="relative z-20 on-shader text-base font-semibold text-white">
        {title}
      </div>

      {/* SUBTITLE */}
      <div className="relative z-20 on-shader text-sm text-neutral-100 mt-1">
        {subtitle}
      </div>
    </motion.div>
  );
});

export default Project;