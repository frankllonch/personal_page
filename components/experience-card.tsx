import React from "react";
import Image from "next/image";
import DecorativeBackground from "./DecorativeBackground";

interface ExperienceCardProps {
  name: string;
  degree: string;
  country: string;
  year: number;
  color: string;
  href: string;
  image: string;
}

export default function ExperienceCard({
  name,
  degree,
  country,
  year,
  color,
  href,
  image,
}: ExperienceCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        w-48 bg-white
        rounded-xl p-3 flex flex-col items-start
        shadow-sm hover:shadow-md
        border border-gray-200
        transition duration-500
        relative group overflow-hidden
        hover:-translate-y-1 hover:scale-[1.02]
      "
    >
      {/* GEOMETRIC SHAPES (NEW) */}
      <DecorativeBackground svg="/shapes/wave.svg" count={3} />

      <div className="flex justify-start items-center space-x-2 relative z-20">
        <div className="w-8 h-8 relative rounded-full overflow-hidden flex-none">
          <Image src={image} alt={name} fill className="object-contain" />
        </div>
        <div className="text-xs text-gray-500 uppercase">{name}</div>
      </div>

      <div className="text-sm mt-2 text-left relative z-20 text-gray-900">
        {degree}
      </div>
      <div className="text-sm text-blue-600 mt-1 relative z-20 font-medium">
        {country}, {year}
      </div>
    </a>
  );
}