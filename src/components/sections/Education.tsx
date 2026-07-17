"use client";

import { Award, ArrowUpRight, GraduationCap, MapPin } from "lucide-react";
import { useContent } from "@/components/ContentContext";
import { useT } from "@/components/I18nContext";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";

export default function Education() {
  const { education, certificates } = useContent();
  const t = useT();

  if (education.length === 0 && certificates.length === 0) return null;

  return (
    <section id="education" className="relative bg-surface py-28 md:py-36">
      <div className="shell">
        <SectionHeading
          eyebrow={t("education.eyebrow")}
          title={t("education.title")}
          accent={t("education.accent")}
          description={t("education.description")}
        />

        {/* diplomas & training — presented like numbered case studies */}
        {education.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {education.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.08} className="h-full">
                <TiltCard className="card-surface card-hover group relative flex h-full gap-5 overflow-hidden rounded-2xl p-6 md:p-7">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -top-5 font-display text-[64px] font-bold leading-none text-white/[0.04] transition-colors duration-500 group-hover:text-white/[0.07]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-accent/25 to-violet-accent/25 text-violet-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-110">
                    <GraduationCap size={20} />
                  </span>
                  <div className="relative min-w-0">
                    <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">{e.title}</h3>
                    <p className="mt-2 text-[13px] uppercase tracking-[0.08em] text-muted">{e.org}</p>
                    {e.meta && (
                      <p className="meta-chip mt-4">
                        <MapPin size={11} /> {e.meta}
                      </p>
                    )}
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        )}

        {/* certificates */}
        {certificates.length > 0 && (
          <>
            <Reveal className="mb-6 mt-14" delay={0.05}>
              <h3 className="inline-flex items-center gap-2.5 font-display text-lg font-semibold">
                <Award size={18} className="text-amber-300" />
                {t("education.certificates")}
              </h3>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((c, i) => (
                <Reveal key={c.title} delay={0.08 + i * 0.06} className="h-full">
                  <div className="card-surface card-hover group flex h-full flex-col rounded-2xl p-5 hover:!border-amber-300/30 hover:!shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_1px_2px_rgba(0,0,0,0.5),0_24px_55px_-18px_rgba(0,0,0,0.7),0_16px_50px_-20px_rgba(251,191,36,0.25)]">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[360deg]">
                        <Award size={16} />
                      </span>
                      {c.date && (
                        <span className="rounded-full border border-amber-300/20 bg-amber-500/[0.07] px-2.5 py-1 text-[10px] font-semibold tabular-nums text-amber-200/90">
                          {c.date}
                        </span>
                      )}
                    </div>
                    <p className="mt-4 font-display text-sm font-semibold leading-snug tracking-tight">{c.title}</p>
                    <p className="mt-1.5 text-xs text-muted">{c.issuer}</p>
                    <div className="mt-auto pt-4">
                      {c.url ? (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-ghost inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
                        >
                          {t("education.verify")}
                          <ArrowUpRight
                            size={12}
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100"
                          />
                        </a>
                      ) : (
                        <p className="text-[11px] text-muted/70">{t("education.onRequest")}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
