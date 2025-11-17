import React from "react";
import Image from "next/image";
import DecorativeBackground from "./DecorativeBackground";

interface ExperienceCardProps {
  name: string;
  degree: string;
  country: string;
  year: number;
  color?: string;  // kept optional for compatibility
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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        w-44 h-30
        bg-[#0A0A0A]
        rounded-xl p-3 flex flex-col
        shadow-lg hover:shadow-xl
        border border-[#F4D35E]/10
        transition duration-500
        relative group overflow-hidden
        hover:-translate-y-1 hover:scale-[1.02]
      "
    >
      {/* decorative shapes */}
      <DecorativeBackground count={4} />

      {/* top row */}
      <div className="flex items-center space-x-2 relative z-20">
        <div className="w-8 h-8 relative rounded-full overflow-hidden flex-none border border-white/20">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
        <div className="text-xs text-gray-300 uppercase">{name}</div>
      </div>

      {/* degree */}
      <div className="text-sm mt-3 relative z-20 text-white">
        {degree}
      </div>

      {/* location */}
      <div className="text-xs text-blue-300 mt-1 relative z-20 font-medium">
        {country}, {year}
      </div>
    </a>
  );
}