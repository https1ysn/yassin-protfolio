import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Field system: one definition drives the form UI, the zod schema,   */
/* and the server-side validation for every admin module.             */
/* ------------------------------------------------------------------ */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "color"
  | "select"
  | "lines" // string[] edited one-per-line
  | "objectList" // array of small objects edited as repeatable rows
  | "image" // URL with upload-to-storage button
  | "file"; // URL (pdf etc.) with upload button

export type ObjectColumn = { key: string; label: string; type: "text" | "number" };

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[]; // select
  columns?: ObjectColumn[]; // objectList
  min?: number;
  max?: number;
  /** field also has `<name>_fr` and `<name>_ar` variants (base column = English) */
  localized?: boolean;
};

export const contentLocales = ["fr", "ar"] as const;

function fieldSchema(f: FieldDef, required: boolean): z.ZodTypeAny {
  switch (f.type) {
    case "number":
      return z.coerce.number().min(f.min ?? -1e9).max(f.max ?? 1e9);
    case "boolean":
      return z.boolean();
    case "lines":
      return z.array(z.string());
    case "objectList":
      return z.array(z.record(z.string(), z.union([z.string(), z.number()])));
    default:
      return required ? z.string().min(1, `${f.label} is required`) : z.string();
  }
}

export function buildSchema(fields: FieldDef[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) {
    shape[f.name] = fieldSchema(f, !!f.required);
    if (f.localized) {
      // translations are never required — empty means "fall back to English"
      for (const lang of contentLocales) shape[`${f.name}_${lang}`] = fieldSchema(f, false);
    }
  }
  return z.object(shape);
}

/* ------------------------------------------------------------------ */
/* Entity registry                                                     */
/* ------------------------------------------------------------------ */

export type EntityConfig = {
  slug: string;
  table: string;
  title: string;
  description: string;
  kind: "singleton" | "collection";
  icon: string; // lucide icon name used by the sidebar
  fields: FieldDef[];
  listColumns?: string[]; // shown in collection tables
  searchKeys?: string[];
  /** for selects populated from another table, e.g. skills → categories */
  relation?: { field: string; table: string; valueKey: string; labelKey: string };
  /** extra list capabilities rendered by CollectionManager */
  features?: {
    duplicate?: boolean;
    /** rows can be archived (needs an `archived` bool column) */
    archive?: boolean;
    /** boolean columns that get a quick toggle in the list, e.g. ["published"] */
    toggles?: string[];
    /** projects: manage a gallery of images per row */
    gallery?: boolean;
  };
  /** auto-generate `target` from `source` while typing, e.g. slug from title */
  slugFrom?: { source: string; target: string };
};

const socialPlatforms = [
  "github", "linkedin", "indeed", "fiverr", "upwork", "behance", "dribbble",
  "facebook", "instagram", "x", "tiktok", "youtube", "discord", "telegram",
  "whatsapp", "email", "website", "custom",
].map((p) => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }));

export const entities: EntityConfig[] = [
  {
    slug: "profile",
    table: "profile",
    title: "Profile",
    description: "Your identity: name, role, photo, CV, and the hero typing roles.",
    kind: "singleton",
    icon: "User",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true, localized: true },
      { name: "initials", label: "Initials (logo)", type: "text", required: true },
      { name: "role", label: "Current role", type: "text", required: true, localized: true },
      { name: "typing_roles", label: "Typing animation roles", type: "lines", help: "One role per line — the hero cycles through them.", localized: true },
      { name: "location", label: "Location", type: "text", localized: true },
      { name: "photo_url", label: "Profile photo", type: "image" },
      { name: "cover_image_url", label: "Cover image", type: "image", help: "Stored for future use — the current design doesn't display a cover." },
      { name: "biography", label: "Biography", type: "textarea", help: "Longer bio, stored alongside the About paragraphs." },
      { name: "cv_url", label: "Resume / CV (PDF)", type: "file" },
      { name: "tagline", label: "Hero tagline", type: "textarea", localized: true },
      { name: "availability", label: "Availability badge", type: "text", localized: true },
    ],
  },
  {
    slug: "hero",
    table: "hero",
    title: "Hero",
    description: "Headline and the animated stats band under the hero.",
    kind: "singleton",
    icon: "Sparkles",
    fields: [
      { name: "headline_line1", label: "Headline line 1", type: "text", localized: true },
      { name: "headline_line2", label: "Headline line 2 (gradient)", type: "text", localized: true },
      {
        name: "stats",
        label: "Stats counters",
        type: "objectList",
        localized: true,
        columns: [
          { key: "value", label: "Value", type: "number" },
          { key: "suffix", label: "Suffix", type: "text" },
          { key: "label", label: "Label", type: "text" },
        ],
      },
    ],
  },
  {
    slug: "about",
    table: "about",
    title: "About",
    description: "Your story paragraphs and the four strength cards.",
    kind: "singleton",
    icon: "BookOpen",
    fields: [
      { name: "paragraphs", label: "Story paragraphs", type: "lines", help: "One paragraph per line.", localized: true },
      {
        name: "strengths",
        label: "Strength cards",
        type: "objectList",
        localized: true,
        columns: [
          { key: "title", label: "Title", type: "text" },
          { key: "text", label: "Text", type: "text" },
        ],
      },
    ],
  },
  {
    slug: "experience",
    table: "experience",
    title: "Experience",
    description: "Professional timeline entries.",
    kind: "collection",
    icon: "Briefcase",
    listColumns: ["role", "company", "period"],
    searchKeys: ["role", "company"],
    features: { duplicate: true, archive: true },
    fields: [
      { name: "role", label: "Role", type: "text", required: true, localized: true },
      { name: "company", label: "Company", type: "text", required: true },
      { name: "logo_url", label: "Company logo", type: "image" },
      { name: "period", label: "Period", type: "text", placeholder: "Jan 2024 — Dec 2024", localized: true },
      { name: "location", label: "Location", type: "text", localized: true },
      { name: "summary", label: "One-line summary", type: "textarea", localized: true },
      { name: "bullets", label: "Achievements / responsibilities", type: "lines", localized: true },
      { name: "tags", label: "Technologies / tags", type: "lines", localized: true },
    ],
  },
  {
    slug: "education",
    table: "education",
    title: "Education",
    description: "Diplomas and training shown in the About marquee.",
    kind: "collection",
    icon: "GraduationCap",
    listColumns: ["title", "organization"],
    searchKeys: ["title", "organization"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, localized: true },
      { name: "organization", label: "Organization", type: "text", localized: true },
      { name: "meta", label: "Date / location", type: "text", localized: true },
    ],
  },
  {
    slug: "skill-categories",
    table: "skill_categories",
    title: "Skill Categories",
    description: "Groups shown as cards in the Skills section.",
    kind: "collection",
    icon: "FolderKanban",
    listColumns: ["title"],
    searchKeys: ["title"],
    fields: [
      { name: "title", label: "Category title", type: "text", required: true, localized: true },
      { name: "icon", label: "Icon name (optional)", type: "text", help: "code / database / chart / palette" },
      { name: "color", label: "Accent color (optional)", type: "color" },
    ],
  },
  {
    slug: "skills",
    table: "skills",
    title: "Skills",
    description: "Individual skills with animated level bars.",
    kind: "collection",
    icon: "Gauge",
    listColumns: ["name", "level"],
    searchKeys: ["name"],
    relation: { field: "category_id", table: "skill_categories", valueKey: "id", labelKey: "title" },
    fields: [
      { name: "category_id", label: "Category", type: "select", required: true },
      { name: "name", label: "Skill name", type: "text", required: true, localized: true },
      { name: "level", label: "Level (0–100)", type: "number", min: 0, max: 100 },
    ],
  },
  {
    slug: "soft-skills",
    table: "soft_skills",
    title: "Soft Skills",
    description: "Tag cloud in the Skills section.",
    kind: "collection",
    icon: "HeartHandshake",
    listColumns: ["name"],
    searchKeys: ["name"],
    fields: [{ name: "name", label: "Soft skill", type: "text", required: true, localized: true }],
  },
  {
    slug: "languages",
    table: "languages",
    title: "Languages",
    description: "Spoken languages with proficiency bars.",
    kind: "collection",
    icon: "Globe2",
    listColumns: ["name", "level_label"],
    searchKeys: ["name"],
    fields: [
      { name: "name", label: "Language", type: "text", required: true, localized: true },
      { name: "level_label", label: "Level label", type: "text", placeholder: "Native / B1 / Fluent", localized: true },
      { name: "percent", label: "Bar percent (0–100)", type: "number", min: 0, max: 100 },
    ],
  },
  {
    slug: "projects",
    table: "projects",
    title: "Projects",
    description: "Case studies shown on the portfolio.",
    kind: "collection",
    icon: "Layers",
    listColumns: ["title", "category", "published"],
    searchKeys: ["title", "category", "slug"],
    features: { duplicate: true, archive: true, toggles: ["published", "featured"], gallery: true },
    slugFrom: { source: "title", target: "slug" },
    fields: [
      { name: "title", label: "Title", type: "text", required: true, localized: true },
      { name: "slug", label: "Slug", type: "text", required: true, help: "Auto-generated from the title — edit if you want a custom one." },
      { name: "category", label: "Category", type: "text", localized: true },
      { name: "tags", label: "Tags", type: "lines", localized: true },
      { name: "short_description", label: "Short description", type: "textarea" },
      { name: "long_description", label: "Why it was built (case study)", type: "textarea", localized: true },
      { name: "problem", label: "Problem", type: "textarea", localized: true },
      { name: "solution", label: "Solution / how it was built", type: "textarea", localized: true },
      { name: "challenge", label: "Biggest technical challenge (case study)", type: "textarea", localized: true },
      { name: "results", label: "Results (case study)", type: "textarea", localized: true },
      { name: "lessons", label: "Lessons learned (case study)", type: "textarea", localized: true },
      { name: "features", label: "Features", type: "lines", localized: true },
      { name: "technologies", label: "Technologies", type: "lines", localized: true },
      { name: "cover_image_url", label: "Cover image", type: "image", help: "You can also pick one from the gallery below." },
      { name: "github_url", label: "GitHub URL", type: "text" },
      { name: "live_url", label: "Live demo URL", type: "text" },
      { name: "video_url", label: "Video (YouTube URL or upload)", type: "file", help: "Paste a YouTube link or upload a video file." },
      { name: "link_label", label: "Link label (optional)", type: "text", localized: true },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "published", label: "Published", type: "boolean" },
      { name: "seo_title", label: "SEO title", type: "text" },
      { name: "seo_description", label: "SEO description", type: "textarea" },
    ],
  },
  {
    slug: "services",
    table: "services",
    title: "Services",
    description: "What you offer, shown as four cards.",
    kind: "collection",
    icon: "Wrench",
    listColumns: ["title"],
    searchKeys: ["title"],
    fields: [
      { name: "title", label: "Service", type: "text", required: true, localized: true },
      { name: "description", label: "Description", type: "textarea", localized: true },
      { name: "icon", label: "Icon name (optional)", type: "text" },
    ],
  },
  {
    slug: "certificates",
    table: "certificates",
    title: "Certificates",
    description: "Certifications and attestations.",
    kind: "collection",
    icon: "Award",
    listColumns: ["title", "issuer", "date_label"],
    searchKeys: ["title", "issuer"],
    fields: [
      { name: "title", label: "Certificate", type: "text", required: true, localized: true },
      { name: "issuer", label: "Issuer", type: "text", localized: true },
      { name: "image_url", label: "Certificate image", type: "image" },
      { name: "date_label", label: "Issue date", type: "text", placeholder: "Sep 2024", localized: true },
      { name: "expiry_label", label: "Expiry date (optional)", type: "text", placeholder: "No expiry" },
      { name: "url", label: "Credential URL", type: "text" },
    ],
  },
  {
    slug: "testimonials",
    table: "testimonials",
    title: "Testimonials",
    description: "Client and colleague quotes (ready for when you collect them).",
    kind: "collection",
    icon: "Quote",
    listColumns: ["author", "role", "published"],
    searchKeys: ["author"],
    fields: [
      { name: "author", label: "Author", type: "text", required: true },
      { name: "role", label: "Author role / company", type: "text" },
      { name: "text", label: "Quote", type: "textarea", required: true },
      { name: "avatar_url", label: "Avatar", type: "image" },
      { name: "published", label: "Published", type: "boolean" },
    ],
  },
  {
    slug: "social-links",
    table: "social_links",
    title: "Social Links",
    description: "Profiles shown in the contact section. Empty URLs are hidden automatically.",
    kind: "collection",
    icon: "Share2",
    listColumns: ["platform", "url", "enabled"],
    searchKeys: ["platform", "label", "url"],
    features: { toggles: ["enabled"] },
    fields: [
      { name: "platform", label: "Platform", type: "select", options: socialPlatforms, required: true },
      { name: "label", label: "Label (optional)", type: "text" },
      { name: "url", label: "URL — leave empty to hide", type: "text" },
      { name: "enabled", label: "Enabled", type: "boolean" },
    ],
  },
  {
    slug: "contact",
    table: "contact_info",
    title: "Contact",
    description: "Email, phone, WhatsApp, address, and contact-form settings.",
    kind: "singleton",
    icon: "Mail",
    fields: [
      { name: "email", label: "Email", type: "text", required: true },
      { name: "phone", label: "Phone (tel: format)", type: "text", placeholder: "+212600000000" },
      { name: "display_phone", label: "Phone (display format)", type: "text", placeholder: "(+212) 600 000 000" },
      { name: "whatsapp_url", label: "WhatsApp URL", type: "text", placeholder: "https://wa.me/212600000000" },
      { name: "telegram_url", label: "Telegram URL", type: "text", placeholder: "https://t.me/username" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "maps_url", label: "Google Maps URL", type: "text" },
      { name: "form_enabled", label: "Show contact form", type: "boolean" },
      { name: "form_note", label: "Note under the form", type: "text" },
    ],
  },
  {
    slug: "seo",
    table: "seo",
    title: "SEO",
    description: "Metadata, Open Graph, Twitter cards, robots, and canonical URL.",
    kind: "singleton",
    icon: "Search",
    fields: [
      { name: "title", label: "Site title", type: "text", localized: true },
      { name: "description", label: "Meta description", type: "textarea", localized: true },
      { name: "keywords", label: "Keywords", type: "lines", localized: true },
      { name: "og_title", label: "Open Graph title", type: "text", localized: true },
      { name: "og_description", label: "Open Graph description", type: "textarea", localized: true },
      { name: "og_image_url", label: "Open Graph image", type: "image" },
      {
        name: "twitter_card", label: "Twitter card", type: "select",
        options: [
          { value: "summary_large_image", label: "Summary — large image" },
          { value: "summary", label: "Summary" },
        ],
      },
      { name: "robots", label: "Robots", type: "text", placeholder: "index, follow" },
      { name: "canonical_url", label: "Canonical URL", type: "text" },
    ],
  },
  {
    slug: "settings",
    table: "site_settings",
    title: "Website Settings",
    description: "Branding, colors, and feature toggles for the public site.",
    kind: "singleton",
    icon: "Settings",
    fields: [
      { name: "site_name", label: "Site name", type: "text" },
      { name: "logo_url", label: "Logo", type: "image" },
      { name: "favicon_url", label: "Favicon", type: "image" },
      { name: "primary_color", label: "Primary color", type: "color" },
      { name: "secondary_color", label: "Secondary color", type: "color" },
      { name: "accent_color", label: "Accent color", type: "color" },
      { name: "show_loader", label: "Loading screen", type: "boolean" },
      { name: "enable_animations", label: "Animations", type: "boolean" },
      { name: "enable_custom_cursor", label: "Custom cursor", type: "boolean" },
      { name: "enable_particles", label: "Hero particles", type: "boolean" },
      { name: "font_display", label: "Display font", type: "text", help: "Informational for now — fonts load via next/font." },
      { name: "font_body", label: "Body font", type: "text" },
    ],
  },
];

export const entityBySlug = (slug: string) => entities.find((e) => e.slug === slug);
export const writableTables = new Set(entities.map((e) => e.table).concat(["project_images"]));
