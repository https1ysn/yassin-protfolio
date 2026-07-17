"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Download,
  FolderKanban,
  GraduationCap,
  Home,
  Mail,
  MessageCircle,
  Search,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";
import { useContent } from "@/components/ContentContext";
import { useT } from "@/components/I18nContext";

type Action = {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  run: () => void;
};

type Props = { open: boolean; setOpen: (v: boolean) => void };

export default function CommandPalette({ open, setOpen }: Props) {
  const { profile } = useContent();
  const t = useT();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const goTo = (hash: string) => {
    setOpen(false);
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  };

  const actions = useMemo<Action[]>(
    () => [
      { id: "home", label: t("palette.goHome"), hint: t("palette.section"), icon: <Home size={16} />, run: () => goTo("#home") },
      { id: "about", label: t("palette.goAbout"), hint: t("palette.section"), icon: <User size={16} />, run: () => goTo("#about") },
      { id: "education", label: t("palette.goEducation"), hint: t("palette.section"), icon: <GraduationCap size={16} />, run: () => goTo("#education") },
      { id: "experience", label: t("palette.goExperience"), hint: t("palette.section"), icon: <Briefcase size={16} />, run: () => goTo("#experience") },
      { id: "skills", label: t("palette.goSkills"), hint: t("palette.section"), icon: <Sparkles size={16} />, run: () => goTo("#skills") },
      { id: "projects", label: t("palette.goProjects"), hint: t("palette.section"), icon: <FolderKanban size={16} />, run: () => goTo("#projects") },
      { id: "services", label: t("palette.goServices"), hint: t("palette.section"), icon: <Wrench size={16} />, run: () => goTo("#services") },
      { id: "contact", label: t("palette.goContact"), hint: t("palette.section"), icon: <Mail size={16} />, run: () => goTo("#contact") },
      {
        id: "cv",
        label: t("palette.downloadCV"),
        hint: t("palette.pdf"),
        icon: <Download size={16} />,
        run: () => {
          setOpen(false);
          window.open(profile.cvFile, "_blank");
        },
      },
      {
        id: "email",
        label: t("palette.sendEmail"),
        hint: profile.email,
        icon: <Mail size={16} />,
        run: () => {
          setOpen(false);
          window.location.href = `mailto:${profile.email}`;
        },
      },
      {
        id: "whatsapp",
        label: t("palette.chatWhatsApp"),
        hint: profile.displayPhone,
        icon: <MessageCircle size={16} />,
        run: () => {
          setOpen(false);
          window.open(profile.whatsapp, "_blank");
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, t]
  );

  const filtered = useMemo(
    () => actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase())),
    [actions, query]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      filtered[index]?.run();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[96] flex items-start justify-center bg-black/60 px-4 pt-[16vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ scale: 0.96, y: -12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: -12, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="glass w-full max-w-lg overflow-hidden rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.7)]"
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
                onKeyDown={onInputKey}
                placeholder={t("palette.placeholder")}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-muted"
                aria-label="Search commands"
              />
              <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-muted">ESC</kbd>
            </div>
            <ul className="max-h-72 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-muted">{t("palette.noResults")}</li>
              )}
              {filtered.map((action, i) => (
                <li key={action.id}>
                  <button
                    type="button"
                    onClick={action.run}
                    onMouseEnter={() => setIndex(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                      i === index ? "bg-white/[0.08] text-white" : "text-muted"
                    }`}
                  >
                    <span className={i === index ? "gradient-text" : ""}>{action.icon}</span>
                    <span className="flex-1">{action.label}</span>
                    <span className="text-[11px] text-muted/70">{action.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-white/10 px-4 py-2.5 text-[11px] text-muted/70">
              {t("palette.hint")}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
