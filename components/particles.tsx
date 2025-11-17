"use client";
import { useEffect } from "react";

export default function Particles() {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.className = "pointer-events-none fixed inset-0 z-30";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let w, h;
    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      s: Math.random() * 1 + 0.7,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6
    }));

    function animate() {
      ctx.clearRect(0,0,w,h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x<0||p.x>w) p.vx *= -3;
        if (p.y<0||p.y>h) p.vy *= -1;

        ctx.fillStyle = "rgba(0,200,255,0.35)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI*2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();

    return () => canvas.remove();
  }, []);

  return null;
}