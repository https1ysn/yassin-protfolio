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
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // Opens the visitor's mail client with the message pre-filled — works on any
  // static host with zero backend.
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${form.name || "a visitor"}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const channels = [
    { icon: <Mail size={18} />, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: <MessageCircle size={18} />, label: "WhatsApp", value: profile.displayPhone, href: profile.whatsapp },
    { icon: <Phone size={18} />, label: "Phone", value: profile.displayPhone, href: `tel:${profile.phone}` },
    { icon: <MapPin size={18} />, label: "Location", value: profile.location, href: "" },
    // admin-managed social links — empty URLs are filtered out server-side
    ...socialLinks
      .filter((l) => !["whatsapp", "email"].includes(l.platform)) // already shown above
      .map((l) => ({
        icon: platformIcons[l.platform] ?? <Link2 size={18} />,
        label: l.label || l.platform.charAt(0).toUpperCase() + l.platform.slice(1),
        value: "Visit profile",
        href: l.url,
      })),
  ];

  return (
    <section id="contact" className="relative overflow-hidden bg-surface py-28 md:py-36">
      <div aria-hidden="true" className="orb orb-violet right-[-10%] top-[10%] h-[28rem] w-[28rem]" />
      <div className="shell relative">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something"
          accent="together."
          description="Have a project, a role, or just a question? My inbox is always open — I reply fast."
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
                    <span>
                      <span className="block text-xs uppercase tracking-wider text-muted">{c.label}</span>
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
                    Your name
                  </span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="field"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                    Your email
                  </span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="field"
                  />
                </label>
              </div>
              <label className="mt-5 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
                  Message
                </span>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about your project…"
                  className="field resize-none"
                />
              </label>
              <div className="mt-7">
                <MagneticButton
                  type="submit"
                  className="btn-primary inline-flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold text-white sm:w-auto"
                >
                  <Send size={15} />
                  Send Message
                </MagneticButton>
                <p className="mt-4 text-xs text-muted/70">
                  Opens your email app with the message ready to send — no data is stored.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
