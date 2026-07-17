"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Command, Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data";
import { useContent } from "@/components/ContentContext";
import { useT } from "@/components/I18nContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { profile } = useContent();
  const t = useT();
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = navLinks
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed left-1/2 top-4 z-[70] w-[min(1100px,calc(100%-24px))] -translate-x-1/2 rounded-2xl px-4 py-2.5 transition-all duration-300 md:top-5 ${
        scrolled ? "glass shadow-[0_16px_50px_rgba(0,0,0,0.5)]" : "border border-transparent"
      }`}
    >
      <nav className="flex items-center justify-between gap-3" aria-label="Primary">
        <a href="#home" className="group flex items-center gap-2.5" aria-label="Home">
          <span className="gradient-border flex h-9 w-9 items-center justify-center rounded-xl font-display text-sm font-bold transition-shadow group-hover:glow-indigo">
            <span className="gradient-text">{profile.initials}</span>
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-tight sm:block">
            {profile.name}
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={active === link.href ? "location" : undefined}
                className={`relative rounded-full px-3.5 py-2 text-sm transition-colors duration-300 ${
                  active === link.href ? "text-white" : "text-muted hover:text-white"
                }`}
              >
                {active === link.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative">{t(`nav.${link.href.slice(1)}`)}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={onOpenPalette}
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-muted transition-colors hover:border-white/25 hover:text-white md:flex"
            aria-label={t("nav.openPalette")}
          >
            <Command size={13} />
            <span>Ctrl K</span>
          </button>
          <a href="#contact" className="btn-primary hidden rounded-full px-4 py-2 text-sm font-semibold text-white sm:block">
            {t("nav.hireMe")}
          </a>
          <button
            type="button"
            className="icon-chip h-9 w-9 rounded-full text-white lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={t("nav.toggleMenu")}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden lg:hidden"
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm ${
                    active === link.href ? "bg-white/[0.07] text-white" : "text-muted"
                  }`}
                >
                  {t(`nav.${link.href.slice(1)}`)}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
