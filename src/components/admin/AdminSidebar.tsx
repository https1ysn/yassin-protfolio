"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, User, Sparkles, BookOpen, Briefcase, GraduationCap,
  FolderKanban, Gauge, HeartHandshake, Globe2, Layers, Wrench, Award,
  Quote, Share2, Mail, Search, Settings, Image as ImageIcon, LogOut,
  ExternalLink,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

const icons: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={16} />,
  User: <User size={16} />,
  Sparkles: <Sparkles size={16} />,
  BookOpen: <BookOpen size={16} />,
  Briefcase: <Briefcase size={16} />,
  GraduationCap: <GraduationCap size={16} />,
  FolderKanban: <FolderKanban size={16} />,
  Gauge: <Gauge size={16} />,
  HeartHandshake: <HeartHandshake size={16} />,
  Globe2: <Globe2 size={16} />,
  Layers: <Layers size={16} />,
  Wrench: <Wrench size={16} />,
  Award: <Award size={16} />,
  Quote: <Quote size={16} />,
  Share2: <Share2 size={16} />,
  Mail: <Mail size={16} />,
  Search: <Search size={16} />,
  Settings: <Settings size={16} />,
  Image: <ImageIcon size={16} />,
};

const groups: { label: string; items: { href: string; title: string; icon: string }[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", title: "Dashboard", icon: "LayoutDashboard" },
      { href: "/admin/media", title: "Media Library", icon: "Image" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/profile", title: "Profile", icon: "User" },
      { href: "/admin/hero", title: "Hero", icon: "Sparkles" },
      { href: "/admin/about", title: "About", icon: "BookOpen" },
      { href: "/admin/experience", title: "Experience", icon: "Briefcase" },
      { href: "/admin/education", title: "Education", icon: "GraduationCap" },
      { href: "/admin/skill-categories", title: "Skill Categories", icon: "FolderKanban" },
      { href: "/admin/skills", title: "Skills", icon: "Gauge" },
      { href: "/admin/soft-skills", title: "Soft Skills", icon: "HeartHandshake" },
      { href: "/admin/languages", title: "Languages", icon: "Globe2" },
      { href: "/admin/projects", title: "Projects", icon: "Layers" },
      { href: "/admin/services", title: "Services", icon: "Wrench" },
      { href: "/admin/certificates", title: "Certificates", icon: "Award" },
      { href: "/admin/testimonials", title: "Testimonials", icon: "Quote" },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/contact", title: "Contact", icon: "Mail" },
      { href: "/admin/social-links", title: "Social Links", icon: "Share2" },
      { href: "/admin/seo", title: "SEO", icon: "Search" },
      { href: "/admin/settings", title: "Settings", icon: "Settings" },
    ],
  },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await supabaseBrowser().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="flex h-dvh w-60 shrink-0 flex-col border-r border-white/[0.07] bg-surface max-lg:hidden">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="gradient-border flex h-8 w-8 items-center justify-center rounded-lg font-display text-xs font-bold">
          <span className="gradient-text">YE</span>
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Portfolio CMS</p>
          <p className="truncate text-[11px] text-muted">{userEmail}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Admin">
        {groups.map((g) => (
          <div key={g.label} className="mb-4">
            <p className="px-2.5 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted/60">
              {g.label}
            </p>
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors duration-200 ${
                        active
                          ? "bg-white/[0.07] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                          : "text-muted hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <span className={active ? "gradient-text" : ""}>{icons[item.icon]}</span>
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/[0.07] p-3">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-muted transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <ExternalLink size={16} /> View website
        </a>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
}
