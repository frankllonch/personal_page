"use client";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CurvedGrid() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0,1], ["0px","-200px"]);
  const opacity = useTransform(scrollYProgress, [0,1], [0.18,0.1]);

  return (
    <motion.div 
      style={{ y, opacity }}
      className="
        pointer-events-none fixed inset-0 z-0
        [mask-image:radial-gradient(circle_at_center,white_20%,transparent_80%)]
      "
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1600 1200"
        className="opacity-50"
      >
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#1e90ff15" strokeWidth="2"/>
          </pattern>
        </defs>

        <motion.rect
          x="0" y="0" width="1600" height="1200"
          fill="url(#grid)"
          style={{
            transformOrigin: "center",
            rotateX: "-45deg",
            scale: 1.4
          }}
        />
      </svg>
    </motion.div>
  );
}