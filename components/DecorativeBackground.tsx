import React from "react";

interface DecorativeBackgroundProps {
  count?: number;
}

/**
 * Random geometric shapes as background decoration.
 * - No SVGs, just colored divs.
 * - Works great on dark blue background.
 */
export default function DecorativeBackground({
  count = 3,
}: DecorativeBackgroundProps) {
  const colors = [
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
        const color = colors[i % colors.length];

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