"use client";

import { ReactNode, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
};

/** 3D perspective tilt card with a moving glare highlight. */
export default function TiltCard({ children, className = "", maxTilt = 7 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, visible: false });

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), { stiffness: 180, damping: 20 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    px.set(nx);
    py.set(ny);
    setGlare({ x: nx * 100, y: ny * 100, visible: true });
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
    setGlare((g) => ({ ...g, visible: false }));
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900 }}
      className={`relative ${className}`}
    >
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: glare.visible ? 1 : 0,
          background: `radial-gradient(420px circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.08), transparent 45%)`,
        }}
      />
    </motion.div>
  );
}
