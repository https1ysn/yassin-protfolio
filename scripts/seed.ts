/**
 * One-time content migration: imports the built-in portfolio content into
 * Supabase so the CMS starts fully populated.
 *
 *   npm run seed
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 * Collections are only seeded when empty, so it is safe to run again.
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import {
  profile,
  stats,
  aboutParagraphs,
  strengths,
  experience,
  skillGroups,
  softSkills,
  languages,
  projects,
  services,
  education,
} from "../src/lib/data";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// New naming (sb_secret_...) preferred; legacy service_role key still accepted.
const serviceKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY.\n" +
      "   Copy .env.example to .env.local and fill in both values (Project Settings → API Keys)."
  );
  process.exit(1);
}

const db = createClient(url, serviceKey, { auth: { persistSession: false } });

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function upsertSingleton(table: string, values: Record<string, unknown>) {
  const { error } = await db.from(table).upsert({ id: 1, ...values });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`✓ ${table}`);
}

async function seedCollection(table: string, rows: Record<string, unknown>[]) {
  const { count, error: countError } = await db.from(table).select("*", { count: "exact", head: true });
  if (countError) throw new Error(`${table}: ${countError.message}`);
  if ((count ?? 0) > 0) {
    console.log(`- ${table} already has ${count} rows — skipped`);
    return;
  }
  const { error } = await db.from(table).insert(rows.map((r, i) => ({ ...r, sort_order: i })));
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`✓ ${table} (${rows.length} rows)`);
}

async function main() {
  console.log("Seeding portfolio content…\n");

  await upsertSingleton("profile", {
    name: profile.name,
    initials: profile.initials,
    role: profile.role,
    typing_roles: profile.typingRoles,
    location: profile.location,
    photo_url: profile.photo,
    cv_url: profile.cvFile,
    tagline: profile.tagline,
    availability: profile.availability,
  });

  await upsertSingleton("hero", {
    headline_line1: "Yassine",
    headline_line2: "El Biad",
    stats,
  });

  await upsertSingleton("about", { paragraphs: aboutParagraphs, strengths });

  await upsertSingleton("contact_info", {
    email: profile.email,
    phone: profile.phone,
    display_phone: profile.displayPhone,
    whatsapp_url: profile.whatsapp,
    address: "Sidi Bernoussi, Casablanca, Morocco",
    maps_url: "https://www.google.com/maps/search/?api=1&query=Sidi+Bernoussi+Casablanca+Morocco",
    form_enabled: true,
    form_note: "Opens your email app with the message ready to send — no data is stored.",
  });

  await upsertSingleton("seo", {
    title: "Yassine El Biad — Junior Web Developer & Data Specialist",
    description:
      "Junior web developer and data specialist in Casablanca, Morocco. HTML, CSS, JavaScript, PHP, MySQL, WordPress, Excel dashboards, and industrial-grade quality control.",
    keywords: [
      "Yassine El Biad",
      "web developer Casablanca",
      "junior web developer Morocco",
      "data entry specialist",
      "WordPress developer",
    ],
    robots: "index, follow",
    twitter_card: "summary_large_image",
  });

  await upsertSingleton("site_settings", {
    site_name: "Yassine El Biad",
    primary_color: "#4F46E5",
    secondary_color: "#7C3AED",
    accent_color: "#06B6D4",
    show_loader: true,
    enable_animations: true,
    enable_custom_cursor: true,
    enable_particles: true,
    font_display: "Sora",
    font_body: "Inter",
  });

  await seedCollection("experience", experience.map((e) => ({
    role: e.role,
    company: e.company,
    period: e.period,
    location: e.location,
    summary: e.summary,
    bullets: e.bullets,
    tags: e.tags,
  })));

  await seedCollection("education", education.map((e) => ({
    title: e.title,
    organization: e.org,
    meta: e.meta,
  })));

  // skill categories + skills (relational)
  const { count: catCount } = await db.from("skill_categories").select("*", { count: "exact", head: true });
  if ((catCount ?? 0) > 0) {
    console.log("- skill_categories already seeded — skipped");
  } else {
    for (let i = 0; i < skillGroups.length; i++) {
      const group = skillGroups[i];
      const { data: cat, error } = await db
        .from("skill_categories")
        .insert({ title: group.title, sort_order: i })
        .select()
        .single();
      if (error) throw new Error(`skill_categories: ${error.message}`);
      const { error: skillError } = await db.from("skills").insert(
        group.skills.map((s, j) => ({ category_id: cat.id, name: s.name, level: s.level, sort_order: j }))
      );
      if (skillError) throw new Error(`skills: ${skillError.message}`);
    }
    console.log(`✓ skill_categories + skills (${skillGroups.length} groups)`);
  }

  await seedCollection("soft_skills", softSkills.map((name) => ({ name })));

  await seedCollection("languages", languages.map((l) => ({
    name: l.name,
    level_label: l.level,
    percent: l.pct,
  })));

  await seedCollection("projects", projects.map((p) => ({
    title: p.title,
    slug: slugify(p.title),
    category: p.category,
    short_description: p.problem,
    problem: p.problem,
    solution: p.solution,
    features: p.features,
    technologies: p.tech,
    link_label: p.linkLabel,
    live_url: p.link && p.link.startsWith("http") ? p.link : "",
    published: true,
  })));

  await seedCollection("services", services.map((s) => ({ title: s.title, description: s.text })));

  await seedCollection("certificates", [
    { title: "International Diploma — Web Development & Programming", issuer: "Centre Atlantique de Formation × Smart International Academy, London", date_label: "" },
    { title: "International Diploma — Applied Accounting", issuer: "Centre Atlantique de Formation × Smart International Academy, London", date_label: "" },
    { title: "Training Attestation — Web Development & Programming", issuer: "Centre Atlantique de Formation", date_label: "Dec 2024" },
    { title: "Training Attestation — Practical Accounting with SAGE", issuer: "Centre Atlantique de Formation", date_label: "Jul 2024" },
    { title: "Course Certificate — Front-End Development", issuer: "Sololearn", date_label: "Sep 2024" },
  ]);

  await seedCollection(
    "social_links",
    [
      "github", "linkedin", "indeed", "fiverr", "upwork", "behance", "dribbble",
      "facebook", "instagram", "x", "tiktok", "youtube", "discord", "telegram", "website",
    ].map((platform) => ({ platform, label: "", url: "" }))
  );

  console.log("\n✅ Done. Open /admin to manage everything.");
}

main().catch((e) => {
  console.error(`\n❌ ${e.message}`);
  process.exit(1);
});
