"use client";

import React from "react";

export default function DecorativeBackground({ count = 4 }) {
  const colors = [
    "bg-[rgba(244,211,94,0.25)]",   // gold (soft)
    "bg-[rgba(232,185,35,0.15)]",   // darker yellow
    "bg-[rgba(255,255,255,0.18)]",  // soft white
    "bg-[rgba(200,170,80,0.15)]",   // washed sand
    "bg-[rgba(255,230,150,0.12)]",  // pale butter yellow
    // 🧱 NEW – Browns (earthy, subtle)
    "bg-[rgba(110,72,36,0.70)]",     // warm brown
    "bg-[rgba(150,100,50,0.70)]",    // light brown

    // ❤️ NEW – Reds (soft, muted, non-aggressive)
    "bg-[rgba(180,60,60,0.70)]",     // muted red
    "bg-[rgba(140,50,50,0.70)]",     // deep soft red
  ];

  return (
    <>
      {[...Array(count)].map((_, i) => {
        const isCircle = Math.random() > 0.5;
        const size = Math.random() * 70 + 40;

        return (
          <div
            key={i}
            className={`
              absolute ${colors[i % colors.length]} opacity-60
              transform transition duration-500
              group-hover:scale-110 group-hover:rotate-6
              pointer-events-none
            `}
            style={{
              width: `${size}px`,
              height: `${isCircle ? size : size * 0.7}px`,
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 80}%`,
              borderRadius: isCircle ? "9999px" : "10px",
              transform: `rotate(${Math.random() * 360}deg)`,
              mixBlendMode: "screen",
            }}
          />
        );
      })}
    </>
  );
}