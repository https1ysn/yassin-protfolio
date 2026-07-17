"use client";

import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone, Send, Link2 } from "lucide-react";
import {
  FaGithub,
  FaLinkedinIn,
  FaBehance,
  FaDribbble,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaTiktok,
  FaYoutube,
  FaDiscord,
  FaTelegram,
} from "react-icons/fa6";
import { SiFiverr, SiUpwork, SiIndeed } from "react-icons/si";
import { useContent } from "@/components/ContentContext";
import { useT } from "@/components/I18nContext";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";

/* icons for admin-managed social links; unknown platforms get a generic icon */
const platformIcons: Record<string, React.ReactNode> = {
  github: <FaGithub size={18} />,
  linkedin: <FaLinkedinIn size={18} />,
  indeed: <SiIndeed size={18} />,
  fiverr: <SiFiverr size={18} />,
  upwork: <SiUpwork size={18} />,
  behance: <FaBehance size={18} />,
  dribbble: <FaDribbble size={18} />,
  facebook: <FaFacebookF size={18} />,
  instagram: <FaInstagram size={18} />,
  x: <FaXTwitter size={18} />,
  tiktok: <FaTiktok size={18} />,
  youtube: <FaYoutube size={18} />,
  discord: <FaDiscord size={18} />,
  telegram: <FaTelegram size={18} />,
  website: <Link2 size={18} />,
};

export default function Contact() {
  const { profile, socialLinks } = useContent();
  const t = useT();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // Opens the visitor's mail client with the message pre-filled — works on any
  // static host with zero backend.
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(t("contact.mailSubject", { name: form.name || "visitor" }));
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const channels: { icon: React.ReactNode; label: string; value: string; href: string; tag?: string }[] = [
    {
      icon: <Mail size={18} />,
      label: t("contact.email"),
      value: profile.email,
      href: `mailto:${profile.email}`,
      tag: t("contact.fastest"),
    },
    { icon: <MessageCircle size={18} />, label: t("contact.whatsapp"), value: profile.displayPhone, href: profile.whatsapp },
    { icon: <Phone size={18} />, label: t("contact.phone"), value: profile.displayPhone, href: `tel:${profile.phone}` },
    { icon: <MapPin size={18} />, label: t("contact.location"), value: profile.location, href: "" },
    // admin-managed social links — empty URLs are filtered out server-side
    ...socialLinks
      .filter((l) => !["whatsapp", "email"].includes(l.platform)) // already shown above
      .map((l) => ({
        icon: platformIcons[l.platform] ?? <Link2 size={18} />,
        label: l.label || l.platform.charAt(0).toUpperCase() + l.platform.slice(1),
        value: t("contact.visitProfile"),
        href: l.url,
      })),
  ];

  return (
    <section id="contact" className="relative overflow-hidden bg-surface py-28 md:py-36">
      <div aria-hidden="true" className="orb orb-violet right-[-10%] top-[10%] h-[28rem] w-[28rem]" />
      <div className="shell relative">
        <SectionHeading
          eyebrow={t("contact.eyebrow")}
          title={t("contact.title")}
          accent={t("contact.accent")}
          description={t("contact.description")}
          align="center"
        />

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.07}>
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="card-surface card-hover group flex items-center gap-4 rounded-2xl p-5"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-accent/25 to-cyan-accent/25 text-cyan-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-110">
                      {c.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wider text-muted">{c.label}</span>
                        {c.tag && (
                          <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                            {c.tag}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block break-all text-sm font-medium">{c.value}</span>
                    </span>
                  </a>
                ) : (
                  <div className="card-surface flex items-center gap-4 rounded-2xl p-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-accent/25 to-cyan-accent/25 text-cyan-accent">
                      {c.icon}
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-wider text-muted">{c.label}</span>
                      <span className="mt-0.5 block text-sm font-medium">{c.value}</span>
                    </span>
                  </div>
                )}
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <form onSubmit={submit} className="gradient-border rounded-3xl p-7 md:p-9">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("contact.yourName")}
                  </span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t("contact.namePlaceholder")}
                    className="field"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("contact.yourEmail")}
                  </span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={t("contact.emailPlaceholder")}
                    className="field"
                  />
                </label>
              </div>
              <label className="mt-5 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("contact.message")}
                </span>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={t("contact.messagePlaceholder")}
                  className="field resize-none"
                />
              </label>
              <div className="mt-7">
                <MagneticButton
                  type="submit"
                  className="btn-primary inline-flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold text-white sm:w-auto"
                >
                  <Send size={15} />
                  {t("contact.send")}
                </MagneticButton>
                <p className="mt-4 text-xs text-muted/70">{t("contact.formNote")}</p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
