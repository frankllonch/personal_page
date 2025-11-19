"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Shape {
  size: number;
  top: number;
  left: number;
  rot: number;
  color: string;
  blur: number;
  opacity: number;
}

export default function DecorativeBackground({ count = 4 }) {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const palette = [
      "rgba(255, 0, 60, 0.6)",     // neon red-pink
      "rgba(255, 255, 255, 0.6)",  // soft white glow
      "rgba(255, 30, 80, 0.6)",    // neon hot red
    ];

    setShapes(
      Array.from({ length: count }).map(() => {
        return {
          size: Math.random() * 90 + 40,
          top: Math.random() * 80,
          left: Math.random() * 80,
          rot: Math.random() * 360,
          color: palette[Math.floor(Math.random() * palette.length)],
          blur: Math.random() * 6 + 9,
          opacity: Math.random() * 0.1 + 0.3,
        };
      })
    );
  }, [count]);

  return (
    <>
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="
            absolute pointer-events-none
            transition-all duration-700
            group-hover:scale-[1.15] group-hover:rotate-12
          "
          style={{
            width: s.size,
            height: s.size * (Math.random() > 0.5 ? 1 : 0.6),
            top: `${s.top}%`,
            left: `${s.left}%`,
            borderRadius: "16px",
            background: s.color,
            opacity: s.opacity,
            filter: `blur(${s.blur}px)`,
            mixBlendMode: "screen",
            transform: `rotate(${s.rot}deg)`,
          }}
        >
          {/* subtle float */}
          <motion.div
            className="w-full h-full"
            animate={{
              x: [0, 6, -6, 0],
              y: [0, -6, 6, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 8 + Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}
    </>
  );
}