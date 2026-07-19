"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Download, Mail, MessageCircle, Phone } from "lucide-react";
import { useContent } from "@/components/ContentContext";
import { useT } from "@/components/I18nContext";
import Particles from "@/components/Particles";
import MagneticButton from "@/components/ui/MagneticButton";

/** Cycles through role strings with a type / hold / delete rhythm. */
function useTyping(words: string[]) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;
    const word = words[wordIndex % words.length];
    const delay = deleting ? 38 : text === word ? 1800 : 70;
    const t = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, wordIndex, words]);

  return text;
}

/* entrances start as the preloader wipes away (~1.1s) */
const BASE = 1.15;
const EASE = [0.16, 1, 0.3, 1] as const;

const entrance = (delay: number) => ({
  initial: { opacity: 0, y: 28, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.9, delay: BASE + delay, ease: EASE },
});

/** Headline words rise in one after another from behind a clipping mask. */
function StaggeredWord({ word, delay, className = "" }: { word: string; delay: number; className?: string }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <motion.span
        className={`inline-block ${className}`}
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, delay: BASE + delay, ease: EASE }}
      >
        {word}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const { profile, settings, heroLine1, heroLine2 } = useContent();
  const t = useT();
  const typed = useTyping(profile.typingRoles);
  const sectionRef = useRef<HTMLElement>(null);

  /* cinematic exit: content drifts up and fades as you scroll past the hero */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 md:pt-24"
    >
      {/* backdrop layers */}
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div aria-hidden="true" className="orb orb-indigo -top-32 right-[-10%] h-[36rem] w-[36rem]" />
      <div
        aria-hidden="true"
        className="orb orb-cyan bottom-[-15%] left-[-12%] h-[32rem] w-[32rem]"
        style={{ animationDelay: "-9s" }}
      />
      <div
        aria-hidden="true"
        className="orb orb-violet left-[35%] top-[45%] h-[24rem] w-[24rem]"
        style={{ animationDelay: "-4.5s" }}
      />
      {settings.enableParticles && <Particles />}

      <div className="shell relative grid items-center gap-14 pb-24 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div style={{ y: copyY, opacity: fade }}>
          <motion.span
            {...entrance(0.5)}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {profile.availability}
          </motion.span>

          <h1 className="mt-7 font-display text-[clamp(3.2rem,9vw,5.6rem)] font-bold leading-[1.02] tracking-[-0.03em]">
            <StaggeredWord word={heroLine1} delay={0.55} />
            <br />
            <StaggeredWord word={heroLine2} delay={0.68} className="gradient-text animate-gradient" />
          </h1>

          <motion.p
            {...entrance(0.85)}
            className="mt-6 font-display text-lg font-medium text-white/90 md:text-2xl"
            aria-label={profile.typingRoles.join(", ")}
          >
            <span aria-hidden="true">
              {typed}
              <span className="typing-caret gradient-text">|</span>
            </span>
          </motion.p>

          <motion.p
            {...entrance(0.95)}
            className="mt-5 max-w-xl text-base leading-[1.8] text-muted md:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div {...entrance(1.05)} className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton
              href={profile.cvFile}
              download
              className="btn-primary group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold text-white"
            >
              <Download size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
              {t("hero.downloadCV")}
            </MagneticButton>
            <MagneticButton
              href={`mailto:${profile.email}`}
              className="btn-ghost inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold text-white"
            >
              <Mail size={16} />
              {t("hero.hireMe")}
            </MagneticButton>
            <MagneticButton
              href="#projects"
              className="link-underline group inline-flex items-center gap-2 px-1 py-3.5 text-sm font-semibold text-muted hover:text-white"
            >
              {t("hero.viewProjects")}
              <ArrowRight
                size={15}
                className="transition-transform duration-300 ease-out group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
              />
            </MagneticButton>
          </motion.div>

          <motion.div {...entrance(1.2)} className="mt-10 flex items-center gap-3">
            {[
              { icon: <Mail size={16} />, href: `mailto:${profile.email}`, label: "Email" },
              { icon: <MessageCircle size={16} />, href: profile.whatsapp, label: "WhatsApp" },
              { icon: <Phone size={16} />, href: `tel:${profile.phone}`, label: "Phone" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="icon-chip h-10 w-10 rounded-full"
              >
                {s.icon}
              </a>
            ))}
            <span className="ms-2 hidden text-xs text-muted/80 sm:block">
              {t("hero.basedIn")} {profile.location}
            </span>
          </motion.div>
        </motion.div>

        {/* portrait — outer div owns scroll parallax, inner owns the entrance */}
        <motion.div style={{ y: portraitY, opacity: fade }} className="relative mx-auto w-[min(340px,80vw)] lg:w-[380px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: BASE + 0.8, ease: EASE }}
          className="relative"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-accent/30 via-violet-accent/20 to-cyan-accent/30 opacity-70 blur-2xl"
          />
          <div className="gradient-border animate-float group relative overflow-hidden rounded-[2rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.photo}
              alt={`Portrait of ${profile.name}`}
              width={430}
              height={538}
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
              loading="eager"
              fetchPriority="high"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/85 via-transparent to-transparent" />
            <div className="glass absolute bottom-4 left-4 right-4 rounded-2xl px-4 py-3">
              <p className="text-xs text-muted">{t("hero.currently")}</p>
              <p className="text-sm font-semibold">{profile.role}</p>
            </div>
          </div>

          <div
            className="glass animate-float absolute -left-8 top-10 hidden rounded-2xl px-4 py-3 md:block"
            style={{ animationDelay: "-2s" }}
          >
            <p className="gradient-text font-display text-xl font-bold">2+</p>
            <p className="text-[11px] text-muted">{t("hero.yearsExperience")}</p>
          </div>
          <div
            className="glass animate-float absolute -right-6 bottom-24 hidden rounded-2xl px-4 py-3 md:block"
            style={{ animationDelay: "-4s" }}
          >
            <p className="gradient-text font-display text-xl font-bold">5</p>
            <p className="text-[11px] text-muted">{t("hero.certifications")}</p>
          </div>
        </motion.div>
        </motion.div>
      </div>

      {/* scroll hint — fades away as soon as scrolling starts */}
      <motion.a
        href="#about"
        aria-label={t("hero.scrollToAbout")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: BASE + 1.6, duration: 0.8 }}
        style={{ opacity: fade }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5 transition-colors hover:border-white/45">
          <motion.span
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-1 rounded-full bg-white/70"
          />
        </div>
      </motion.a>
    </section>
  );
}
