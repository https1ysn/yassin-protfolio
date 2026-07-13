"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, CalendarDays } from "lucide-react";
import { useContent } from "@/components/ContentContext";
import SectionHeading from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const { experience } = useContent();
  const listRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        }
      );
      gsap.utils.toArray<HTMLElement>(".xp-card").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 44, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 82%" },
          }
        );
      });
    }, listRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="relative overflow-hidden bg-surface py-28 md:py-36">
      <div className="shell">
        <SectionHeading
          eyebrow="Experience"
          title="A track record of"
          accent="reliability."
          description="Four roles across automotive quality control and production data — each one sharpened the same core promise: what I deliver is correct, on time, and documented."
        />

        <ol ref={listRef} className="relative ml-3 space-y-10 md:ml-6">
          <div
            ref={lineRef}
            aria-hidden="true"
            className="absolute -left-px bottom-4 top-2 w-[2px] bg-gradient-to-b from-indigo-accent via-violet-accent to-cyan-accent"
          />
          {experience.map((job) => (
            <li key={`${job.company}-${job.role}`} className="relative pl-10 md:pl-14">
              <span
                aria-hidden="true"
                className="dot-pulse absolute -left-[9px] top-2 h-[18px] w-[18px] rounded-full border-4 border-base bg-gradient-to-br from-indigo-accent to-cyan-accent"
              />
              <div className="xp-card card-surface card-hover group rounded-2xl p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-semibold md:text-2xl">{job.role}</h3>
                    <p className="mt-1.5 inline-flex items-center gap-2 text-sm font-medium text-cyan-accent/90">
                      <Building2 size={14} /> {job.company}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs tabular-nums text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <CalendarDays size={12} className="text-violet-300" /> {job.period}
                  </span>
                </div>
                <p className="mt-4 text-sm italic text-white/70">{job.summary}</p>
                <ul className="mt-4 space-y-2.5">
                  {job.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span
                        aria-hidden="true"
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-indigo-accent to-cyan-accent"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  {job.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-violet-accent/10 px-3 py-1 text-[11px] font-medium text-violet-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
