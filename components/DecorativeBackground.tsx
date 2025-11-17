"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Shape {
  w: number;
  h: number;
  top: number;
  left: number;
  rot: number;
  circle: boolean;
  color: string;
}

export default function DecorativeBackground({ count = 4 }) {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const palette = [
      "rgba(244,211,94,0.25)",
      "rgba(232,185,35,0.15)",
      "rgba(255,255,255,0.18)",
      "rgba(200,170,80,0.15)",
      "rgba(255,230,150,0.12)",
      "rgba(110,72,36,0.70)",
      "rgba(150,100,50,0.70)",
      "rgba(180,60,60,0.70)",
      "rgba(140,50,50,0.70)",
    ];

    setShapes(
      Array.from({ length: count }).map(() => {
        const size = Math.random() * 65 + 45;

        return {
          w: size,
          h: Math.random() > 0.5 ? size : size * 0.7,
          top: Math.random() * 80,
          left: Math.random() * 80,
          rot: Math.random() * 360,
          circle: Math.random() > 0.5,
          color: palette[Math.floor(Math.random() * palette.length)],
        };
      })
    );
  }, [count]);

  return (
    <>
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute pointer-events-none transition-all duration-500 
                     group-hover:scale-110 group-hover:rotate-6"
          style={{
            width: s.w,
            height: s.h,
            top: `${s.top}%`,
            left: `${s.left}%`,
            borderRadius: s.circle ? "9999px" : "12px",
            background: s.color,
            mixBlendMode: "screen",
            transform: `rotate(${s.rot}deg)`,
          }}
        >
          {/* Soft floating movement */}
          <motion.div
            className="w-full h-full"
            animate={{
              x: [0, 6, -6, 0],
              y: [0, -4, 4, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 18,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}
    </>
  );
}