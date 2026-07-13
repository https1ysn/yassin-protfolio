"use client";

import { motion } from "framer-motion";
import { Code2, Database, BarChart3, Palette, Globe2, HeartHandshake } from "lucide-react";
import { useContent } from "@/components/ContentContext";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const groupIcons = [
  <Code2 key="fe" size={18} />,
  <Database key="be" size={18} />,
  <BarChart3 key="data" size={18} />,
  <Palette key="design" size={18} />,
];

function Bar({ level, delay }: { level: number; delay: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]">
      <motion.div
        className="relative h-full rounded-full bg-gradient-to-r from-indigo-accent via-violet-accent to-cyan-accent"
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* glowing tip that rides the end of the bar */}
        <span
          aria-hidden="true"
          className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-cyan-accent blur-[3px]"
        />
      </motion.div>
    </div>
  );
}

export default function Skills() {
  const { languages, skillGroups, softSkills } = useContent();
  return (
    <section id="skills" className="relative py-28 md:py-36">
      <div className="bg-grid absolute inset-0 rotate-180" aria-hidden="true" />
      <div className="shell relative">
        <SectionHeading
          eyebrow="Skills"
          title="A stack built on"
          accent="fundamentals."
          description="Honest levels, no inflation — strong foundations in web development and data work, and I level up every single week."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {skillGroups.map((group, gi) => (
            <Reveal key={group.title} delay={gi * 0.08}>
              <div className="card-surface card-hover h-full rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-accent/20 to-cyan-accent/20 text-cyan-accent">
                    {groupIcons[gi]}
                  </span>
                  <h3 className="font-display text-lg font-semibold">{group.title}</h3>
                </div>
                <div className="mt-6 space-y-5">
                  {group.skills.map((skill, si) => (
                    <div key={skill.name}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-white/85">{skill.name}</span>
                        <span className="text-xs text-muted">{skill.level}%</span>
                      </div>
                      <Bar level={skill.level} delay={0.15 + si * 0.07} />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Reveal delay={0.1}>
            <div className="card-surface card-hover h-full rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-accent/20 to-cyan-accent/20 text-violet-300">
                  <HeartHandshake size={18} />
                </span>
                <h3 className="font-display text-lg font-semibold">Soft Skills</h3>
              </div>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {softSkills.map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-accent/50 hover:bg-cyan-accent/[0.06] hover:text-white"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="card-surface card-hover h-full rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-accent/20 to-cyan-accent/20 text-cyan-accent">
                  <Globe2 size={18} />
                </span>
                <h3 className="font-display text-lg font-semibold">Languages</h3>
              </div>
              <div className="mt-6 space-y-5">
                {languages.map((lang, i) => (
                  <div key={lang.name}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-white/85">{lang.name}</span>
                      <span className="text-xs text-muted">{lang.level}</span>
                    </div>
                    <Bar level={lang.pct} delay={0.15 + i * 0.1} />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
