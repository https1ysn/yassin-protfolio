"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BookOpen, ChevronDown, Lightbulb, Lock, Sparkles, Target } from "lucide-react";
import { useContent } from "@/components/ContentContext";
import { useT } from "@/components/I18nContext";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";

type Project = ReturnType<typeof useContent>["projects"][number];

/** Expandable Why / Challenge / Results / Lessons — the recruiter view. */
function CaseStudy({ project, id }: { project: Project; id: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const rows = [
    { label: t("projects.why"), text: project.why },
    { label: t("projects.challenge"), text: project.challenge },
    { label: t("projects.results"), text: project.results },
    { label: t("projects.lessons"), text: project.lessons },
  ].filter((r) => r.text?.trim());

  if (rows.length === 0) return null;

  return (
    <div className="mt-4 border-t border-white/[0.07] pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center gap-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-muted transition-colors hover:text-white"
      >
        <BookOpen size={13} className="text-violet-300" />
        {t("projects.caseStudy")}
        <ChevronDown
          size={14}
          className={`ml-auto transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <dl className="space-y-3.5 pt-4">
              {rows.map((r) => (
                <div key={r.label}>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-accent/80">
                    {r.label}
                  </dt>
                  <dd className="mt-1 text-[13px] leading-relaxed text-muted">{r.text}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Abstract generative cover: unique gradient + concentric rings per project. */
function ProjectCover({
  index,
  title,
  featured,
  featuredLabel,
}: {
  index: number;
  title: string;
  featured?: boolean;
  featuredLabel?: string;
}) {
  const hueShifts = [
    "from-indigo-accent/50 via-violet-accent/30 to-cyan-accent/40",
    "from-cyan-accent/40 via-indigo-accent/30 to-violet-accent/50",
    "from-violet-accent/50 via-cyan-accent/25 to-indigo-accent/45",
  ];
  return (
    <div className="relative h-48 overflow-hidden" role="img" aria-label={`${title} cover artwork`}>
      {/* inner layer scales like an image zoom while the frame stays fixed */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${hueShifts[index % 3]} transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]`}
      >
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 transition-transform duration-700 group-hover:scale-125"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-64 w-24 -translate-x-1/2 -translate-y-1/2 rotate-[24deg] rounded-full border border-white/15 transition-transform duration-700 group-hover:rotate-[40deg]"
        />
      </div>
      <span className="absolute bottom-4 left-4 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-semibold tabular-nums text-white/90 backdrop-blur">
        {String(index + 1).padStart(2, "0")}
      </span>
      {featured && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-black/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur">
          <Sparkles size={11} /> {featuredLabel}
        </span>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
    </div>
  );
}

export default function Projects() {
  const { projects } = useContent();
  const t = useT();
  if (projects.length === 0) return null;
  return (
    <section id="projects" className="relative bg-surface py-28 md:py-36">
      <div className="shell">
        <SectionHeading
          eyebrow={t("projects.eyebrow")}
          title={t("projects.title")}
          accent={t("projects.accent")}
          description={t("projects.description")}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1} className="h-full">
              <TiltCard
                className={`card-hover group h-full overflow-hidden rounded-3xl ${
                  p.featured
                    ? "gradient-border shadow-[0_0_55px_-20px_rgba(124,58,237,0.45)]"
                    : "card-surface"
                }`}
              >
                <ProjectCover index={i} title={p.title} featured={p.featured} featuredLabel={t("projects.featured")} />
                <div className="flex h-full flex-col p-6 md:p-7">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-accent/80">
                    {p.category}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-semibold">{p.title}</h3>

                  <div className="mt-4 space-y-3 text-sm leading-relaxed">
                    <p className="flex gap-2.5 text-muted">
                      <Target size={15} className="mt-0.5 shrink-0 text-violet-300" />
                      <span>{p.problem}</span>
                    </p>
                    <p className="flex gap-2.5 text-white/80">
                      <Lightbulb size={15} className="mt-0.5 shrink-0 text-cyan-accent" />
                      <span>{p.solution}</span>
                    </p>
                  </div>

                  <ul className="mt-4 space-y-1.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted">
                        <span className="h-1 w-1 rounded-full bg-cyan-accent" /> {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <CaseStudy project={p} id={`case-study-${i}`} />

                  <div className="mt-auto pt-6">
                    {p.link ? (
                      <a
                        href={p.link}
                        target={p.link.startsWith("http") ? "_blank" : undefined}
                        rel={p.link.startsWith("http") ? "noreferrer" : undefined}
                        className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white ${
                          p.link.startsWith("http") ? "btn-primary" : "btn-ghost"
                        }`}
                      >
                        {p.linkLabel}
                        <ArrowUpRight
                          size={15}
                          className="text-cyan-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.02] px-5 py-2.5 text-sm text-muted">
                        <Lock size={13} /> {p.linkLabel}
                      </span>
                    )}
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
