"use client";

import { CheckCircle2, MapPin, GraduationCap, Languages } from "lucide-react";
import { useContent } from "@/components/ContentContext";
import { useT } from "@/components/I18nContext";
import MarqueeShowcase from "@/components/MarqueeShowcase";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";
import TiltCard from "@/components/ui/TiltCard";

export default function About() {
  const { aboutParagraphs, profile, stats, strengths, education } = useContent();
  const t = useT();
  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="shell">
        {/* stats band */}
        <div className="mb-24 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <TiltCard className="card-surface card-hover rounded-2xl p-6 text-center md:p-8">
                <Counter
                  value={s.value}
                  suffix={s.suffix}
                  className="font-display text-4xl font-bold gradient-text md:text-5xl"
                />
                <p className="mt-3 text-xs leading-snug text-muted md:text-sm">{s.label}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <SectionHeading eyebrow={t("about.eyebrow")} title={t("about.title")} accent={t("about.accent")} />

        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            {aboutParagraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="text-base leading-[1.85] text-muted md:text-lg">{p}</p>
              </Reveal>
            ))}

            <Reveal delay={0.2} className="flex flex-wrap gap-x-8 gap-y-3 pt-2 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <MapPin size={15} className="text-cyan-accent" /> {profile.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <Languages size={15} className="text-violet-accent" /> {t("about.languagesLine")}
              </span>
              <span className="inline-flex items-center gap-2">
                <GraduationCap size={15} className="text-indigo-accent" /> {education.length} {t("about.diplomas")}
              </span>
            </Reveal>
          </div>

          <div className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {strengths.map((s, i) => (
              <Reveal key={s.title} delay={0.1 + i * 0.08}>
                <TiltCard className="card-surface card-hover group h-full rounded-2xl p-6">
                  <CheckCircle2
                    size={20}
                    className="text-cyan-accent transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[360deg]"
                  />
                  <h3 className="mt-4 font-display text-base font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>

        {/* career highlights marquee — the whole profile at a glance */}
        <Reveal className="mt-24" delay={0.1}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-accent to-cyan-accent shadow-[0_0_12px_rgba(124,58,237,0.9)]" />
              {t("about.highlights")}
            </span>
            <span className="text-xs text-muted/80">{t("about.hoverToPause")}</span>
          </div>
          <MarqueeShowcase />
        </Reveal>
      </div>
    </section>
  );
}
