/**
 * Read-only Supabase health check: connection, schema, storage, auth, RLS.
 *
 *   npm run verify
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const pub = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !pub || !secret) {
  console.error("❌ Missing Supabase env vars in .env.local");
  process.exit(1);
}

const anon = createClient(url, pub, { auth: { persistSession: false } });
const admin = createClient(url, secret, { auth: { persistSession: false } });

const tables = [
  "profile", "hero", "about", "contact_info", "seo", "site_settings",
  "experience", "education", "skill_categories", "skills", "soft_skills",
  "languages", "projects", "project_images", "services", "certificates",
  "testimonials", "social_links",
];

async function main() {
  let failed = false;

  // 1. connection + schema via publishable key (also proves RLS select policies).
  // Real GETs — supabase-js swallows errors on HEAD requests.
  const missing: string[] = [];
  for (const t of tables) {
    const { error } = await anon.from(t).select("*").limit(1);
    if (error) missing.push(`${t}: ${error.message}`);
  }
  if (missing.length) {
    failed = true;
    console.log(`❌ Schema: ${missing.length}/18 tables unreachable — run supabase/schema.sql in the SQL Editor`);
    missing.slice(0, 3).forEach((m) => console.log(`   ${m}`));
  } else {
    console.log("✅ Schema: all 18 tables reachable (public read OK)");
  }

  // 2. storage bucket
  const { data: buckets, error: bErr } = await admin.storage.listBuckets();
  if (bErr || !buckets?.some((b) => b.name === "media")) {
    failed = true;
    console.log(`❌ Storage: media bucket ${bErr ? `error — ${bErr.message}` : "not found"}`);
  } else {
    console.log("✅ Storage: media bucket exists");
  }

  // 3. auth users (count only — no personal data printed)
  const { data: users, error: uErr } = await admin.auth.admin.listUsers({ perPage: 10 });
  if (uErr) {
    failed = true;
    console.log(`❌ Auth: ${uErr.message}`);
  } else if (users.users.length === 0) {
    failed = true;
    console.log("❌ Auth: no users — create your admin in Authentication → Users (Auto Confirm)");
  } else {
    console.log(`✅ Auth: ${users.users.length} admin user(s) exist`);
  }

  // 4. RLS write protection — an anonymous write MUST fail
  const { error: wErr } = await anon.from("services").insert({ title: "rls-probe" });
  if (wErr) {
    console.log("✅ RLS: anonymous writes are blocked");
  } else {
    failed = true;
    console.log("❌ RLS: anonymous write succeeded — policies are not active!");
    await admin.from("services").delete().eq("title", "rls-probe");
  }

  // 5. content seeded?
  const { data: prof } = await anon.from("profile").select("id").eq("id", 1).maybeSingle();
  console.log(prof ? "✅ Content: database is seeded" : "ℹ️ Content: not seeded yet — run npm run seed");

  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(`❌ Connection failed: ${e.message}`);
  process.exit(1);
});
