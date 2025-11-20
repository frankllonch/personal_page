"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function PageReveal() {
  const [done, setDone] = useState(false);
  const bars = 16;

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 1600);
    return () => clearTimeout(timer);
  }, []);

  if (done) return null;

  // The bar that will carry the "f"
  const fIndex = Math.floor(bars / 2);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none bg-transparent flex items-center justify-center">

      {/* ============================= */}
      {/*        BLACK BARS COVER       */}
      {/* ============================= */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: bars }).map((_, i) => {
          const isFBar = i+1 === fIndex;

          return (
            <motion.div
              key={i}
              initial={{ y: 0 }}
              animate={{ y: "-100%" }}
              transition={{
                duration: 0.85,
                delay: 0.15 + i * 0.06,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="flex-1 bg-transparent relative overflow-visible"
            >
              {/* PLACE THE F INSIDE THE MOVING BAR */}
              {isFBar && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{
                    opacity: [1, 0.4, 1, 0.2, 1],
                  }}
                  transition={{
                    duration: 1.0,
                    repeat: 0,
                  }}
                  className="absolute inset-0 flex items-center justify-center text-white font-inter font-black text-7xl"
                >
                  f
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}