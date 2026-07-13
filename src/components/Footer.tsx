"use client";

import { ArrowUp } from "lucide-react";
import { navLinks } from "@/lib/data";
import { useContent } from "@/components/ContentContext";

export default function Footer() {
  const { profile } = useContent();
  return (
    <footer className="border-t border-white/[0.06] py-12">
      <div className="shell flex flex-col items-center gap-8 md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <span className="gradient-border flex h-9 w-9 items-center justify-center rounded-xl font-display text-sm font-bold">
            <span className="gradient-text">{profile.initials}</span>
          </span>
          <div>
            <p className="text-sm font-semibold">{profile.name}</p>
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} · Designed & built with Next.js in {profile.location}
            </p>
          </div>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-underline text-xs text-muted transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="icon-chip group h-10 w-10 rounded-full"
        >
          <ArrowUp size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  );
}
