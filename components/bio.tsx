"use client";

import React from "react";
import { motion } from "framer-motion";

interface BioProps {
  title: string;
  paragraphs: readonly string[];
}

export default function Bio({ title, paragraphs }: BioProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="
      w-full 
      bg-white
      border border-gray-200 
      rounded-xl 
      p-4 
      shadow-sm 
      cursor-pointer 
      hover:shadow-lg 
      transition-all 
      duration-300 
      select-none 
      relative
      "
    >
      <p className="font-semibold text-lg mb-2 text-gray-900">{title}</p>

      {paragraphs.map((p, i) => (
        <p key={i} className="text-sm text-gray-700 mt-2 leading-relaxed">
          {p}
        </p>
      ))}
    </motion.div>
  );
}

