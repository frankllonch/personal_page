"use client";

import React from "react";

interface DecorativeBackgroundProps {
  /** Optional override for number of shapes */
  count?: number;
}

/**
 * Random geometric shapes used as background decoration.
 * - No images, just divs with Tailwind bg colors.
 * - Adapts well to dark / blue theme.
 */
export default function DecorativeBackground({
  count = 3,
}: DecorativeBackgroundProps) {
  // Tailwind color classes for shapes (soft pastel-ish on dark blue)
  const colorClasses = [
    "bg-sky-400/20",
    "bg-indigo-400/25",
    "bg-blue-500/20",
    "bg-cyan-300/20",
    "bg-violet-400/20",
  ];

  return (
    <>
      {[...Array(count)].map((_, i) => {
        const isCircle = Math.random() > 0.5;
        const size = Math.random() * 80 + 40;
        const color = colorClasses[i % colorClasses.length];

        return (
          <div
            key={i}
            className={`
              absolute ${color} opacity-70
              transform transition duration-500
              group-hover:rotate-6 group-hover:scale-110
              pointer-events-none
            `}
            style={{
              width: isCircle ? `${size}px` : `${Math.random() * 80 + 40}px`,
              height: isCircle ? `${size}px` : `${Math.random() * 80 + 40}px`,
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 80}%`,
              borderRadius: isCircle ? "99999px" : "12px",
              transform: `rotate(${Math.random() * 360}deg)`,
              mixBlendMode: "screen",
            }}
          />
        );
      })}
    </>
  );
}