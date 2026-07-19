"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Award, ArrowUpRight, Eye, GraduationCap, MapPin, X } from "lucide-react";
import { useContent } from "@/components/ContentContext";
import { useT } from "@/components/I18nContext";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";

const PREVIEW_W = 440;
const GAP = 18;

/**
 * "Show certificate" affordance.
 *
 * Desktop: hovering the button opens a floating preview anchored *beside* the
 * card (portalled to <body>, so it is never clipped and never covers the card
 * text). Touch devices get a responsive modal instead. Clicking either opens
 * the full-size file. Renders nothing when there is no image, or if the URL is
 * dead — so a broken link can never leave a dangling control.
 */
type CertMeta = { title: string; issuer?: string; date?: string };

/** Title / issuer / date strip shown under the artwork in both surfaces. */
function CertificateMeta({ title, issuer, date, className = "" }: CertMeta & { className?: string }) {
  return (
    <div className={className}>
      <p className="font-display text-sm font-semibold leading-snug tracking-tight text-white/95">{title}</p>
      {(issuer || date) && (
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted">
          {issuer && <span>{issuer}</span>}
          {issuer && date && <span className="text-muted/40">·</span>}
          {date && <span className="tabular-nums">{date}</span>}
        </p>
      )}
    </div>
  );
}

/** Skeleton → image cross-fade; keeps a stable box so the preview never jumps. */
function PreviewImage({
  src,
  title,
  onFail,
  className,
}: {
  src: string;
  title: string;
  onFail: () => void;
  className: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-xl bg-white/[0.04]">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-white/[0.06]" aria-hidden="true" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/*
        No loading="lazy" here on purpose: the browser's lazy heuristics do not
        fire for images inserted into a portalled fixed overlay, which left the
        skeleton spinning forever. These surfaces already mount on demand, so
        the fetch is deferred until the user actually asks for the preview.
      */}
      <img
        src={src}
        alt={`${title} certificate`}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={onFail}
        className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

function CertificatePreview({
  src,
  credentialUrl,
  title,
  issuer,
  date,
}: CertMeta & { src?: string; credentialUrl?: string }) {
  const t = useT();
  const [failed, setFailed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(null);
  const [modal, setModal] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const preloaded = useRef(false);

  useEffect(() => {
    setMounted(true);
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  /**
   * Where the floating preview should sit: beside the card, never over it.
   * Returns "modal" when there is no lateral room, null when the card is off
   * screen. Kept in a callback so scroll can re-anchor with the same rules.
   */
  const computeAnchor = useCallback((): { top: number; left: number } | "modal" | null => {
    const card = btnRef.current?.closest("[data-cert-card]") ?? btnRef.current;
    const rect = card?.getBoundingClientRect();
    if (!rect) return null;
    if (rect.bottom < 0 || rect.top > window.innerHeight) return null; // scrolled away

    let left: number;
    if (window.innerWidth - rect.right - GAP >= PREVIEW_W) left = rect.right + GAP;
    else if (rect.left - GAP >= PREVIEW_W) left = rect.left - GAP - PREVIEW_W;
    else return "modal";

    const maxH = Math.min(window.innerHeight * 0.66, 470);
    const top = Math.min(Math.max(GAP, rect.top), Math.max(GAP, window.innerHeight - maxH - GAP));
    return { top, left };
  }, []);

  /* the preview is position-fixed: re-anchor on scroll/resize rather than
     closing, so it stays glued to the card (and survives the browser
     scrolling the button into view when it receives keyboard focus) */
  const isOpen = anchor !== null;
  useEffect(() => {
    if (!isOpen) return;
    const update = () => {
      const next = computeAnchor();
      if (!next || next === "modal") return setAnchor(null);
      setAnchor((prev) =>
        prev && prev.top === next.top && prev.left === next.left ? prev : next
      );
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isOpen, computeAnchor]);

  /* modal: escape to close, focus trap, body scroll lock, focus restore */
  useEffect(() => {
    if (!modal) return;
    const opener = btnRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setModal(false);
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, [modal]);

  const hasImage = !!src && !failed;
  const target = hasImage ? src! : credentialUrl;
  if (!target) return null; // neither an image nor a PDF — no control at all

  const openFull = () => window.open(target, "_blank", "noopener,noreferrer");

  /** Warm the browser cache on intent so the preview never opens empty. */
  const preload = () => {
    if (!src || preloaded.current) return;
    preloaded.current = true;
    const img = new Image();
    img.src = src;
  };

  const showPreview = () => {
    if (!hasImage) return; // PDF-only: the button is a plain link, no hover card
    preload();
    const next = computeAnchor();
    if (next === "modal") return setModal(true); // no lateral room
    if (next) setAnchor(next);
  };

  const activate = () => {
    if (!hasImage || canHover) return openFull(); // PDF, or desktop click → full size
    setModal(true);
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onPointerEnter={preload}
        onMouseEnter={() => canHover && showPreview()}
        onMouseLeave={() => setAnchor(null)}
        onFocus={() => canHover && showPreview()}
        onBlur={() => setAnchor(null)}
        onClick={activate}
        aria-label={`${t("education.showCertificate")} — ${title}`}
        aria-haspopup={hasImage && !canHover ? "dialog" : undefined}
        className="btn-ghost group/btn inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white"
      >
        <Eye
          size={14}
          className="text-amber-300 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover/btn:scale-110"
        />
        {t("education.showCertificate")}
      </button>

      {mounted &&
        createPortal(
          <>
            {/* Desktop: floating preview beside the card.
                Rendered conditionally (no AnimatePresence) so it always unmounts
                cleanly — a lingering invisible layer would swallow clicks. */}
            {anchor && hasImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={{ top: anchor.top, left: anchor.left, width: PREVIEW_W }}
                className="glass pointer-events-none fixed z-[92] rounded-3xl p-3 shadow-[0_40px_90px_-25px_rgba(0,0,0,0.85)]"
                role="presentation"
              >
                <PreviewImage
                  src={src!}
                  title={title}
                  onFail={() => {
                    setFailed(true);
                    setAnchor(null);
                  }}
                  className="max-h-[52vh] w-full object-contain"
                />
                <CertificateMeta
                  title={title}
                  issuer={issuer}
                  date={date}
                  className="px-1 pb-0.5 pt-3"
                />
                <p className="px-1 pt-1.5 text-[10px] text-muted/70">{t("education.openFullSize")}</p>
              </motion.div>
            )}

            {/* Touch / narrow screens: responsive modal, swipe down to dismiss */}
            {modal && hasImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                onClick={() => setModal(false)}
                className="fixed inset-0 z-[97] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
                role="dialog"
                aria-modal="true"
                aria-label={title}
              >
                <motion.div
                  ref={panelRef}
                  initial={{ opacity: 0, scale: 0.95, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.5 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 110 || info.velocity.y > 600) setModal(false);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="glass relative w-full max-w-lg rounded-3xl p-4 sm:p-5"
                >
                  {/* grab handle doubles as the swipe affordance */}
                  <span
                    aria-hidden="true"
                    className="mx-auto mb-3 block h-1 w-10 rounded-full bg-white/20 sm:hidden"
                  />
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setModal(false)}
                    aria-label={t("education.closePreview")}
                    className="icon-chip absolute end-6 top-6 z-10 h-11 w-11 rounded-full bg-black/60 backdrop-blur"
                  >
                    <X size={18} />
                  </button>
                  {/* a real button so "open full size" is keyboard reachable */}
                  <button
                    type="button"
                    onClick={openFull}
                    aria-label={`${t("education.openFullSize")} — ${title}`}
                    className="block w-full rounded-xl"
                  >
                    <PreviewImage
                      src={src!}
                      title={title}
                      onFail={() => {
                        setFailed(true);
                        setModal(false);
                      }}
                      className="max-h-[62vh] w-full cursor-zoom-in object-contain"
                    />
                  </button>
                  <CertificateMeta title={title} issuer={issuer} date={date} className="px-1 pt-4" />
                </motion.div>
              </motion.div>
            )}
          </>,
          document.body
        )}
    </>
  );
}

export default function Education() {
  const { education, certificates } = useContent();
  const t = useT();

  if (education.length === 0 && certificates.length === 0) return null;

  return (
    <section id="education" className="relative bg-surface py-28 md:py-36">
      <div className="shell">
        <SectionHeading
          eyebrow={t("education.eyebrow")}
          title={t("education.title")}
          accent={t("education.accent")}
          description={t("education.description")}
        />

        {/* diplomas & training — presented like numbered case studies */}
        {education.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {education.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.08} className="h-full">
                <TiltCard className="card-surface card-hover group relative flex h-full gap-5 overflow-hidden rounded-2xl p-6 md:p-7">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -top-5 font-display text-[64px] font-bold leading-none text-white/[0.04] transition-colors duration-500 group-hover:text-white/[0.07]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-accent/25 to-violet-accent/25 text-violet-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-110">
                    <GraduationCap size={20} />
                  </span>
                  <div className="relative min-w-0">
                    <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">{e.title}</h3>
                    <p className="mt-2 text-[13px] uppercase tracking-[0.08em] text-muted">{e.org}</p>
                    {e.meta && (
                      <p className="meta-chip mt-4">
                        <MapPin size={11} /> {e.meta}
                      </p>
                    )}
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        )}

        {/* certificates */}
        {certificates.length > 0 && (
          <>
            <Reveal className="mb-6 mt-14" delay={0.05}>
              <h3 className="inline-flex items-center gap-2.5 font-display text-lg font-semibold">
                <Award size={18} className="text-amber-300" />
                {t("education.certificates")}
              </h3>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((c, i) => (
                <Reveal key={c.title} delay={0.08 + i * 0.06} className="h-full">
                  <div
                    data-cert-card
                    className="card-surface card-hover group relative flex h-full flex-col rounded-2xl p-5 hover:!border-amber-300/30 hover:!shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_1px_2px_rgba(0,0,0,0.5),0_24px_55px_-18px_rgba(0,0,0,0.7),0_16px_50px_-20px_rgba(251,191,36,0.25)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[360deg]">
                        <Award size={16} />
                      </span>
                      {c.date && (
                        <span className="rounded-full border border-amber-300/20 bg-amber-500/[0.07] px-2.5 py-1 text-[10px] font-semibold tabular-nums text-amber-200/90">
                          {c.date}
                        </span>
                      )}
                    </div>
                    <p className="mt-4 font-display text-sm font-semibold leading-snug tracking-tight">
                      {c.title}
                    </p>
                    <p className="mt-1.5 text-xs text-muted">{c.issuer}</p>
                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                      <CertificatePreview
                        src={c.image}
                        credentialUrl={c.url}
                        title={c.title}
                        issuer={c.issuer}
                        date={c.date}
                      />
                      {/* the credential link is redundant when the button already
                          opens that same URL (PDF-only certificates) */}
                      {c.url && c.image ? (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-ghost inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
                        >
                          {t("education.verify")}
                          <ArrowUpRight
                            size={12}
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100"
                          />
                        </a>
                      ) : (
                        !c.url && !c.image && (
                          <p className="text-[11px] text-muted/70">{t("education.onRequest")}</p>
                        )
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
