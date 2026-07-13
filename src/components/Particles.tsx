"use client";

import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; vx: number; vy: number; r: number; hue: number };

/** Lightweight canvas particle field with mouse repulsion and linking lines. */
export default function Particles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    const mouse = { x: -9999, y: -9999 };
    const hues = [243, 262, 189]; // indigo, violet, cyan

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = canvas.width = rect?.width ?? window.innerWidth;
      height = canvas.height = rect?.height ?? window.innerHeight;
      const count = Math.min(90, Math.floor((width * height) / 22000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
        hue: hues[Math.floor(Math.random() * hues.length)],
      }));
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    let rafId = 0;
    let running = false;

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 0.01) {
          const force = (120 - dist) / 120;
          d.vx += (dx / dist) * force * 0.12;
          d.vy += (dy / dist) * force * 0.12;
        }
        d.vx *= 0.985;
        d.vy *= 0.985;
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > width) d.vx *= -1;
        if (d.y < 0 || d.y > height) d.vy *= -1;
        d.x = Math.max(0, Math.min(width, d.x));
        d.y = Math.max(0, Math.min(height, d.y));

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${d.hue}, 80%, 70%, 0.55)`;
        ctx.fill();
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(250, 70%, 70%, ${0.1 * (1 - dist / 110)})`;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    // only burn frames while the canvas is actually on screen and the tab is visible
    const start = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && document.visibilityState === "visible") start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    window.addEventListener("resize", resize);
    canvas.parentElement?.addEventListener("mousemove", onMove, { passive: true });
    canvas.parentElement?.addEventListener("mouseleave", onLeave);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("mousemove", onMove);
      canvas.parentElement?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true" />;
}
