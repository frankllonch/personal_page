"use client";

import React from "react";
import { motion } from "framer-motion";
import DecorativeBackground from "./DecorativeBackground";

interface ProjectProps {
  title: string;
  subtitle: string;
  link: string;
  color: string;
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
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="
        w-full bg-white
        border border-gray-200
        rounded-xl p-4
        shadow-sm cursor-pointer 
        hover:shadow-lg
        transition-all duration-300 
        select-none relative group
        overflow-hidden
      "
    >
      <DecorativeBackground svg="/shapes/blob.svg" count={4} />

      {(starred || isNew) && (
        <div
          className={`
            absolute top-0 right-0 text-xs uppercase px-2 py-1 z-20
            ${isNew ? "bg-green-200" : "bg-yellow-200"}
            border-l border-b border-gray-300 rounded-bl-md
          `}
        >
          {isNew ? "new" : "starred"}
        </div>
      )}

      <div className="relative z-20 text-base font-semibold text-gray-900">
        {title}
      </div>
      <div className="relative z-20 text-sm text-gray-600 mt-1">
        {subtitle}
      </div>
    </motion.div>
  );
}