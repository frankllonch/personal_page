"use client";

import React from "react";
import { motion } from "framer-motion";
import DecorativeBackground from "./DecorativeBackground";

interface ProjectProps {
  title: string;
  subtitle: string;
  link: string;
  starred?: boolean;
  isNew?: boolean;
}

export default function Project({
  title,
  subtitle,
  link,
  starred,
  isNew,
}: ProjectProps) {
  const handleClick = () => window.open(link, "_blank");

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="
        w-full h-full               /* 🔥 FIXED TILE HEIGHT */
        bg-[#0D172F]
        border border-white/10
        rounded-xl p-4
        shadow-lg cursor-pointer 
        hover:shadow-xl
        transition-all duration-300 
        select-none relative group
        overflow-hidden
        flex flex-col justify-between
      "
    >
      {/* floating shapes */}
      <DecorativeBackground count={5} />

      {(starred || isNew) && (
        <div
          className={`
            absolute top-0 right-0 text-[10px] uppercase px-2 py-1 z-20
            ${isNew ? "bg-green-500/30" : "bg-yellow-500/30"}
            border-l border-b border-white/20 rounded-bl-md text-white
          `}
        >
          {isNew ? "NEW" : "STARRED"}
        </div>
      )}

      <div className="relative z-20 text-base font-semibold text-white">
        {title}
      </div>

      <div className="relative z-20 text-sm text-gray-300 mt-1">
        {subtitle}
      </div>
    </motion.div>
  );
}