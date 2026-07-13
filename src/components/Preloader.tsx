"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/components/ContentContext";

export default function Preloader() {
  const { profile } = useContent();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1050);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-base"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.75, ease: [0.83, 0, 0.17, 1] }}
          aria-hidden="true"
        >
          <motion.div
            className="flex flex-col items-center gap-6"
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.83, 0, 0.17, 1] }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="gradient-border glow-indigo flex h-20 w-20 items-center justify-center rounded-2xl font-display text-2xl font-bold"
            >
              <span className="gradient-text">{profile.initials}</span>
            </motion.div>
            <div className="h-px w-40 overflow-hidden rounded bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-accent via-violet-accent to-cyan-accent"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-xs uppercase tracking-[0.35em] text-muted"
            >
              {profile.name}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
