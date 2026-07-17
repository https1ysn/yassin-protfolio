"use client";

import { useMemo } from "react";
import {
  Award, Briefcase, Code2, Globe2, GraduationCap, HeartHandshake, Rocket, Wrench,
} from "lucide-react";
import { useContent } from "@/components/ContentContext";
import { useT } from "@/components/I18nContext";

type Item = {
  key: string;
  category: string;
  title: string;
  subtitle?: string;
  date?: string;
  icon: React.ReactNode;
  accent: string; // tailwind text color for the icon chip
  chipBg: string; // chip background tint
  glow: string; // css color for the hover glow
  large?: boolean; // milestone cards get more presence
};

/**
 * One marquee, the whole profile: education, certificates, skills, languages,
 * experience, featured projects, soft skills, and services — as glass cards
 * split across two counter-scrolling rows.
 */
export default function MarqueeShowcase() {
  const { education, certificates, skillGroups, softSkills, languages, experience, projects, services } =
    useContent();
  const t = useT();

  const items = useMemo<Item[]>(() => {
    const list: Item[] = [];

    education.forEach((e) =>
      list.push({
        key: `edu-${e.title}`,
        category: t("marquee.education"),
        title: e.title,
        subtitle: e.org,
        date: e.meta,
        icon: <GraduationCap size={18} />,
        accent: "text-violet-300",
        chipBg: "bg-violet-500/15",
        glow: "rgba(139, 92, 246, 0.4)",
        large: true,
      })
    );

    certificates.forEach((c) =>
      list.push({
        key: `cert-${c.title}`,
        category: t("marquee.certificate"),
        title: c.title,
        subtitle: c.issuer,
        date: c.date,
        icon: <Award size={16} />,
        accent: "text-amber-300",
        chipBg: "bg-amber-500/15",
        glow: "rgba(251, 191, 36, 0.3)",
      })
    );

    skillGroups.forEach((g) =>
      g.skills.forEach((s) =>
        list.push({
          key: `skill-${g.title}-${s.name}`,
          category: g.title,
          title: s.name,
          icon: <Code2 size={16} />,
          accent: "text-cyan-300",
          chipBg: "bg-cyan-500/15",
          glow: "rgba(34, 211, 238, 0.3)",
        })
      )
    );

    languages.forEach((l) =>
      list.push({
        key: `lang-${l.name}`,
        category: t("marquee.language"),
        title: l.name,
        subtitle: l.level,
        icon: <Globe2 size={16} />,
        accent: "text-emerald-300",
        chipBg: "bg-emerald-500/15",
        glow: "rgba(52, 211, 153, 0.3)",
      })
    );

    experience.forEach((x) =>
      list.push({
        key: `xp-${x.company}-${x.role}`,
        category: t("marquee.experience"),
        title: x.role,
        subtitle: x.company,
        date: x.period,
        icon: <Briefcase size={18} />,
        accent: "text-indigo-300",
        chipBg: "bg-indigo-500/15",
        glow: "rgba(99, 102, 241, 0.4)",
        large: true,
      })
    );

    projects
      .filter((p) => p.featured)
      .forEach((p) =>
        list.push({
          key: `proj-${p.title}`,
          category: t("marquee.project"),
          title: p.title,
          subtitle: p.category,
          icon: <Rocket size={18} />,
          accent: "text-fuchsia-300",
          chipBg: "bg-fuchsia-500/15",
          glow: "rgba(232, 121, 249, 0.35)",
          large: true,
        })
      );

    softSkills.forEach((s) =>
      list.push({
        key: `soft-${s}`,
        category: t("marquee.strength"),
        title: s,
        icon: <HeartHandshake size={16} />,
        accent: "text-rose-300",
        chipBg: "bg-rose-500/15",
        glow: "rgba(251, 113, 133, 0.3)",
      })
    );

    services.forEach((s) =>
      list.push({
        key: `svc-${s.title}`,
        category: t("marquee.service"),
        title: s.title,
        icon: <Wrench size={16} />,
        accent: "text-sky-300",
        chipBg: "bg-sky-500/15",
        glow: "rgba(56, 189, 248, 0.3)",
      })
    );

    return list;
  }, [education, certificates, skillGroups, softSkills, languages, experience, projects, services, t]);

  if (items.length === 0) return null;

  /* interleave categories so neighbours differ, then split across two rows */
  const rowA = items.filter((_, i) => i % 2 === 0);
  const rowB = items.filter((_, i) => i % 2 === 1);

  const Card = ({ item, index, decorative }: { item: Item; index: number; decorative?: boolean }) => (
    <div
      className={`marquee-card ${item.large ? "marquee-card-lg" : ""}`}
      aria-hidden={decorative || undefined}
      style={{
        "--mc-glow": item.glow,
        // desynchronised drift so cards never bob in unison
        animationDelay: `${(index % 7) * -1.1}s`,
      } as React.CSSProperties}
    >
      <span
        className={`mc-icon flex shrink-0 items-center justify-center rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] ${
          item.large ? "h-11 w-11" : "h-9 w-9"
        } ${item.chipBg} ${item.accent}`}
      >
        {item.icon}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="flex items-baseline gap-2.5">
          <span className={`font-semibold text-white/90 ${item.large ? "font-display text-[15px]" : "text-sm"}`}>
            {item.title}
          </span>
          {item.date && <span className="text-[10px] text-muted/60 tabular-nums">{item.date}</span>}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-muted">
          <span className={`font-semibold uppercase tracking-[0.14em] ${item.accent}`}>{item.category}</span>
          {item.subtitle && (
            <>
              <span className="text-muted/40">·</span>
              <span className="max-w-56 truncate">{item.subtitle}</span>
            </>
          )}
        </span>
      </span>
    </div>
  );

  const Row = ({ row, reverse }: { row: Item[]; reverse?: boolean }) =>
    row.length === 0 ? null : (
      <div className={`flex w-max items-center gap-4 ${reverse ? "animate-marquee-reverse" : "animate-marquee-slow"}`}>
        {[...row, ...row].map((item, i) => (
          // the second copy exists only to make the loop seamless — hide it from screen readers
          <Card key={`${item.key}-${i}`} item={item} index={i} decorative={i >= row.length} />
        ))}
      </div>
    );

  return (
    <div className="marquee-mask space-y-4 overflow-hidden py-1" aria-label="Career highlights">
      <Row row={rowA} />
      <Row row={rowB} reverse />
    </div>
  );
}
