"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ExperienceCardProps {
  name: string;
  degree: string;
  country: string;
  year: number;
  href: string;
  image: string;
}

export default function ExperienceCard({
  name,
  degree,
  country,
  year,
  href,
  image,
}: ExperienceCardProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        w-44 min-h-[7.5rem]
        bg-white/60 hover:bg-white/85
        rounded-xl p-3 flex flex-col
        shadow-lg
        border border-[#4d7c0f]/10
        relative group overflow-hidden
        will-change-transform
        transition-colors duration-300
      "
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      style={{ transitionProperty: "box-shadow, background-color" }}
    >

      {/* top row */}
      <div className="flex items-center space-x-2 relative z-20">
        <div className="w-8 h-8 relative rounded-full overflow-hidden flex-none border border-black/10">
          <Image src={image} alt={name} fill className="object-cover" sizes="32px" />
        </div>
        <div className="text-xs text-neutral-600 uppercase">{name}</div>
      </div>

      {/* degree */}
      <div className="text-sm mt-3 relative z-20 text-neutral-900">
        {degree}
      </div>

      {/* location */}
      <div className="text-xs text-[#4d7c0f] mt-1 relative z-20 font-medium">
        {country}, {year}
      </div>
    </motion.a>
  );
}