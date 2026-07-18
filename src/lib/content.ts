import "server-only";
import {
  fallbackContent,
  defaultSettings,
  defaultSeo,
  type SiteContent,
  type SeoData,
  type SocialLink,
} from "@/lib/content-fallback";
import { isSupabaseConfigured, supabaseServer } from "@/lib/supabase/server";
import type { Locale } from "@/lib/i18n";

export type { SiteContent, SeoData, SocialLink };
export { fallbackContent, defaultSettings, defaultSeo };

/* eslint-disable @typescript-eslint/no-explicit-any */
const rows = (r: { data: any }) => (r.data ?? []) as any[];
const one = (r: { data: any }) => r.data as any | null;

/**
 * Centralized localized-field resolver.
 * Chain: requested locale variant (`field_fr` / `field_ar`) → English/original column.
 * Empty translations always fall back, so partially translated content never breaks.
 */
const loc = (row: any, field: string, locale: Locale): string => {
  if (locale !== "en") {
    const v = row?.[`${field}_${locale}`];
    if (typeof v === "string" && v.trim() !== "") return v;
  }
  return row?.[field] ?? "";
};

const locArr = <T,>(row: any, field: string, locale: Locale): T[] => {
  if (locale !== "en") {
    const v = row?.[`${field}_${locale}`];
    if (Array.isArray(v) && v.length > 0) return v as T[];
  }
  return (row?.[field] as T[]) ?? [];
};

/**
 * Loads all public content from Supabase in the requested locale, mapped to
 * the exact shapes the components render. Any failure (no env vars, empty DB,
 * network) falls back to the built-in content so the site never breaks.
 */
export async function getSiteContent(locale: Locale = "en"): Promise<SiteContent> {
  if (!isSupabaseConfigured()) return fallbackContent;

  try {
    const db = await supabaseServer();
    const order = { ascending: true };

    const [
      profileQ, heroQ, aboutQ, contactQ, settingsQ,
      xpQ, eduQ, catQ, skillQ, softQ, langQ, projQ, svcQ, socialQ, certQ,
    ] = await Promise.all([
      db.from("profile").select("*").eq("id", 1).maybeSingle(),
      db.from("hero").select("*").eq("id", 1).maybeSingle(),
      db.from("about").select("*").eq("id", 1).maybeSingle(),
      db.from("contact_info").select("*").eq("id", 1).maybeSingle(),
      db.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      db.from("experience").select("*").order("sort_order", order),
      db.from("education").select("*").order("sort_order", order),
      db.from("skill_categories").select("*").order("sort_order", order),
      db.from("skills").select("*").order("sort_order", order),
      db.from("soft_skills").select("*").order("sort_order", order),
      db.from("languages").select("*").order("sort_order", order),
      db.from("projects").select("*").eq("published", true).order("sort_order", order),
      db.from("services").select("*").order("sort_order", order),
      db.from("social_links").select("*").order("sort_order", order),
      db.from("certificates").select("*").order("sort_order", order),
    ]);

    const p = one(profileQ);
    if (!p) return fallbackContent; // DB reachable but not seeded yet

    const hero = one(heroQ);
    const about = one(aboutQ);
    const contact = one(contactQ);
    const s = one(settingsQ);
    const socials: SocialLink[] = rows(socialQ)
      .filter((l) => l.enabled !== false) // disabled links are hidden even with a URL
      .map((l) => ({ platform: l.platform, label: l.label, url: l.url }))
      .filter((l) => l.url.trim() !== "");
    const byPlatform = (platform: string) => socials.find((l) => l.platform === platform)?.url ?? "";

    const skillsByCat = rows(skillQ);
    const fp = fallbackContent.profile;

    return {
      profile: {
        name: p.name,
        initials: p.initials,
        role: loc(p, "role", locale),
        typingRoles: locArr<string>(p, "typing_roles", locale),
        location: p.location,
        email: contact?.email ?? fp.email,
        phone: contact?.phone ?? fp.phone,
        displayPhone: contact?.display_phone ?? fp.displayPhone,
        whatsapp: contact?.whatsapp_url ?? fp.whatsapp,
        linkedin: byPlatform("linkedin"),
        github: byPlatform("github"),
        photo: p.photo_url,
        cvFile: p.cv_url,
        tagline: loc(p, "tagline", locale),
        availability: loc(p, "availability", locale),
      },
      stats: hero ? locArr(hero, "stats", locale) as SiteContent["stats"] : fallbackContent.stats,
      aboutParagraphs: about ? locArr<string>(about, "paragraphs", locale) : fallbackContent.aboutParagraphs,
      strengths: about
        ? (locArr(about, "strengths", locale) as SiteContent["strengths"])
        : fallbackContent.strengths,
      experience: rows(xpQ)
        .filter((e) => e.archived !== true)
        .map((e) => ({
          role: loc(e, "role", locale),
          company: e.company,
          logo: e.logo_url ?? "",
          period: e.period,
          location: e.location,
          summary: loc(e, "summary", locale),
          bullets: locArr<string>(e, "bullets", locale),
          tags: (e.tags as string[]) ?? [],
        })),
      skillGroups: rows(catQ).map((c) => ({
        title: loc(c, "title", locale),
        skills: skillsByCat
          .filter((sk) => sk.category_id === c.id)
          .map((sk) => ({ name: sk.name, level: sk.level })),
      })),
      softSkills: rows(softQ).map((x) => loc(x, "name", locale)),
      languages: rows(langQ).map((l) => ({
        name: loc(l, "name", locale),
        level: loc(l, "level_label", locale),
        pct: l.percent,
      })),
      projects: rows(projQ)
        .filter((pr) => pr.archived !== true)
        .map((pr) => ({
        title: loc(pr, "title", locale),
        category: loc(pr, "category", locale),
        problem: loc(pr, "problem", locale),
        solution: loc(pr, "solution", locale),
        features: locArr<string>(pr, "features", locale),
        tech: (pr.technologies as string[]) ?? [],
        linkLabel:
          loc(pr, "link_label", locale) ||
          (pr.live_url ? "View live" : pr.github_url ? "View code" : "Details on request"),
        link: pr.live_url || pr.github_url || "",
        featured: pr.featured === true,
        why: loc(pr, "long_description", locale),
        challenge: loc(pr, "challenge", locale),
        results: loc(pr, "results", locale),
        lessons: loc(pr, "lessons", locale),
      })),
      services: rows(svcQ).map((sv) => ({
        title: loc(sv, "title", locale),
        text: loc(sv, "description", locale),
      })),
      education: rows(eduQ).map((ed) => ({
        title: loc(ed, "title", locale),
        org: ed.organization,
        meta: loc(ed, "meta", locale),
      })),
      certificates: rows(certQ).map((c) => ({
        title: loc(c, "title", locale),
        issuer: loc(c, "issuer", locale),
        date: c.date_label ?? "",
        url: c.url ?? "",
      })),
      socialLinks: socials,
      settings: s
        ? {
            siteName: s.site_name,
            logoUrl: s.logo_url,
            faviconUrl: s.favicon_url,
            primaryColor: s.primary_color,
            secondaryColor: s.secondary_color,
            accentColor: s.accent_color,
            showLoader: s.show_loader,
            enableAnimations: s.enable_animations,
            enableCustomCursor: s.enable_custom_cursor,
            enableParticles: s.enable_particles,
          }
        : defaultSettings,
    };
  } catch {
    return fallbackContent;
  }
}

/** SEO row for generateMetadata, with fallback. */
export async function getSeo(): Promise<SeoData> {
  if (!isSupabaseConfigured()) return defaultSeo;
  try {
    const db = await supabaseServer();
    const { data } = await db.from("seo").select("*").eq("id", 1).maybeSingle();
    if (!data) return defaultSeo;
    return {
      title: data.title || defaultSeo.title,
      description: data.description || defaultSeo.description,
      keywords: (data.keywords as string[])?.length ? (data.keywords as string[]) : defaultSeo.keywords,
      ogTitle: data.og_title,
      ogDescription: data.og_description,
      ogImageUrl: data.og_image_url,
      twitterCard: data.twitter_card || "summary_large_image",
      robots: data.robots || "index, follow",
      canonicalUrl: data.canonical_url,
    };
  } catch {
    return defaultSeo;
  }
}
