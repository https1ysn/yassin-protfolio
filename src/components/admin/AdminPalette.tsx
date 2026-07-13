"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Image as ImageIcon, LayoutDashboard, Search } from "lucide-react";
import { entities } from "@/lib/admin-config";

/** Ctrl+K quick navigation across all admin modules. */
export default function AdminPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = useMemo(
    () => [
      { id: "dashboard", label: "Dashboard", hint: "Overview", icon: <LayoutDashboard size={16} />, href: "/admin" },
      { id: "media", label: "Media Library", hint: "Files", icon: <ImageIcon size={16} />, href: "/admin/media" },
      ...entities.map((e) => ({
        id: e.slug,
        label: e.title,
        hint: e.kind === "singleton" ? "Settings" : "Collection",
        icon: <Search size={16} />,
        href: `/admin/${e.slug}`,
      })),
      { id: "site", label: "View website", hint: "Opens in new tab", icon: <ExternalLink size={16} />, href: "/" },
    ],
    []
  );

  const filtered = useMemo(
    () => actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase())),
    [actions, query]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const run = (href: string) => {
    setOpen(false);
    if (href === "/") window.open("/", "_blank");
    else router.push(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[97] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Admin quick navigation"
        >
          <motion.div
            initial={{ scale: 0.96, y: -12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: -12, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="glass w-full max-w-md overflow-hidden rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.7)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <Search size={16} className="text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setIndex((i) => Math.min(i + 1, filtered.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setIndex((i) => Math.max(i - 1, 0));
                  } else if (e.key === "Enter" && filtered[index]) {
                    run(filtered[index].href);
                  }
                }}
                placeholder="Jump to…"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-muted"
                aria-label="Search admin pages"
              />
              <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-muted">ESC</kbd>
            </div>
            <ul className="max-h-72 overflow-y-auto p-2">
              {filtered.length === 0 && <li className="px-4 py-8 text-center text-sm text-muted">No matches.</li>}
              {filtered.map((a, i) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => run(a.href)}
                    onMouseEnter={() => setIndex(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                      i === index ? "bg-white/[0.08] text-white" : "text-muted"
                    }`}
                  >
                    <span className={i === index ? "gradient-text" : ""}>{a.icon}</span>
                    <span className="flex-1">{a.label}</span>
                    <span className="text-[11px] text-muted/70">{a.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
