/**
 * One-time content sync: pushes the improved (recruiter-focused) copy from
 * src/lib/data.ts into the database. Matches experience by company and
 * projects by slug — custom rows you created yourself are never touched.
 *
 *   npx tsx scripts/sync-content.ts
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { aboutParagraphs, experience, projects } from "../src/lib/data";

config({ path: ".env.local", quiet: true });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const secret = (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)!;
const db = createClient(url, secret, { auth: { persistSession: false } });

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  console.log("Syncing improved copy into the database…\n");

  // about story
  const { error: aboutErr } = await db.from("about").update({ paragraphs: aboutParagraphs }).eq("id", 1);
  console.log(aboutErr ? `❌ about: ${aboutErr.message}` : "✓ about story updated");

  // experience impact framing (matched by company)
  for (const xp of experience) {
    const { data, error } = await db
      .from("experience")
      .update({ role: xp.role, summary: xp.summary, bullets: xp.bullets, tags: xp.tags })
      .eq("company", xp.company)
      .select("id");
    if (error) console.log(`❌ experience ${xp.company}: ${error.message}`);
    else console.log(data?.length ? `✓ experience: ${xp.company}` : `- experience: ${xp.company} not found, skipped`);
  }

  // project case studies (matched by slug)
  for (const p of projects) {
    const slug = slugify(p.title);
    const base = {
      problem: p.problem,
      solution: p.solution,
      long_description: p.why ?? "",
      features: p.features,
      technologies: p.tech,
    };
    const caseStudy = { challenge: p.challenge ?? "", results: p.results ?? "", lessons: p.lessons ?? "" };

    let { data, error } = await db.from("projects").update({ ...base, ...caseStudy }).eq("slug", slug).select("id");
    if (error && /challenge|results|lessons/.test(error.message)) {
      // migration-003 not run yet — sync what we can and say so
      ({ data, error } = await db.from("projects").update(base).eq("slug", slug).select("id"));
      if (!error) console.log(`⚠ project ${slug}: synced without case-study fields — run supabase/migration-003.sql`);
    } else if (error) {
      console.log(`❌ project ${slug}: ${error.message}`);
    } else {
      console.log(data?.length ? `✓ project: ${slug}` : `- project: ${slug} not found, skipped`);
    }
  }

  console.log("\n✅ Sync complete.");
}

main().catch((e) => {
  console.error(`❌ ${e.message}`);
  process.exit(1);
});
