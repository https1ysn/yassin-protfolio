"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/components/I18nContext";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** Konami code (↑↑↓↓←→←→BA) triggers 10 seconds of party mode. */
export default function EasterEgg() {
  const t = useT();
  const [party, setParty] = useState(false);

  useEffect(() => {
    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === KONAMI[progress]) {
        progress += 1;
        if (progress === KONAMI.length) {
          progress = 0;
          setParty(true);
          document.body.classList.add("party-mode");
          setTimeout(() => {
            document.body.classList.remove("party-mode");
            setParty(false);
          }, 10000);
        }
      } else {
        progress = e.key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {party && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="glass fixed bottom-6 left-1/2 z-[97] -translate-x-1/2 rounded-full px-6 py-3 text-sm font-semibold"
        >
          🎉 {t("easterEgg")}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
