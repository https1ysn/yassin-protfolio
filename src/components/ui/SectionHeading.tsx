import Reveal from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({ eyebrow, title, accent, description, align = "left" }: Props) {
  const centered = align === "center";
  return (
    <Reveal className={`mb-14 max-w-3xl md:mb-20 ${centered ? "mx-auto text-center" : ""}`}>
      <span
        className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-accent to-cyan-accent shadow-[0_0_12px_rgba(124,58,237,0.9)]" />
        {eyebrow}
      </span>
      <h2 className="mt-6 font-display text-[clamp(2.1rem,5vw,3.8rem)] font-bold leading-[1.06] tracking-[-0.025em]">
        {title} {accent && <span className="gradient-text">{accent}</span>}
      </h2>
      {description && (
        <p className="mt-5 max-w-2xl text-base leading-[1.8] text-muted md:text-lg">{description}</p>
      )}
    </Reveal>
  );
}
