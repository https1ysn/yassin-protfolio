"use client";

import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  href?: string;
  download?: boolean;
  onClick?: () => void;
  strength?: number;
  ariaLabel?: string;
  type?: "button" | "submit";
};

/** Wraps a link/button so it gently follows the cursor while hovered. */
export default function MagneticButton({
  children,
  className = "",
  href,
  download,
  onClick,
  strength = 0.35,
  ariaLabel,
  type = "button",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 16 });
  const sy = useSpring(y, { stiffness: 200, damping: 16 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = href ? (
    <a href={href} download={download} onClick={onClick} aria-label={ariaLabel} className={className}>
      {children}
    </a>
  ) : (
    <button type={type} onClick={onClick} aria-label={ariaLabel} className={className}>
      {children}
    </button>
  );

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="inline-block"
    >
      {inner}
    </motion.div>
  );
}
