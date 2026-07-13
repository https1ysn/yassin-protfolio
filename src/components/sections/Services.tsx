"use client";

import { Globe, KeyboardMusic, LineChart, Calculator, ArrowRight } from "lucide-react";
import { useContent } from "@/components/ContentContext";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";

const icons = [
  <Globe key="web" size={22} />,
  <KeyboardMusic key="data" size={22} />,
  <LineChart key="dash" size={22} />,
  <Calculator key="acct" size={22} />,
];

export default function Services() {
  const { services, profile } = useContent();
  return (
    <section id="services" className="relative py-28 md:py-36">
      <div className="shell">
        <SectionHeading
          eyebrow="Services"
          title="What I can"
          accent="do for you."
          description="Available for freelance projects and junior positions — remote or in Casablanca."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.09} className="h-full">
              <TiltCard className="card-surface card-hover group flex h-full flex-col rounded-2xl p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-accent/25 to-cyan-accent/25 text-cyan-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-110">
                  {icons[i]}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{s.text}</p>
                <a
                  href={`mailto:${profile.email}?subject=${encodeURIComponent(`Inquiry: ${s.title}`)}`}
                  className="link-underline mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-white/60 transition-colors group-hover:text-white"
                >
                  Get a quote
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
