/**
 * Finds image URLs stored in the CMS that no longer resolve and clears them so
 * the site never renders a broken image.
 *
 *   npx tsx scripts/clean-dead-images.ts          # report only
 *   npx tsx scripts/clean-dead-images.ts --fix    # clear the dead ones
 *
 * Only URLs pointing at this project's Supabase Storage are ever cleared, and
 * existence is confirmed through the storage API (authoritative) rather than a
 * single HTTP request — a transient network blip must never delete good data.
 * External URLs are reported but never modified.
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const db = createClient(
  SUPABASE_URL,
  (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)!,
  { auth: { persistSession: false } }
);

const FIX = process.argv.includes("--fix");
const PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/media/`;

/* table, url column, id column, label column */
const TARGETS: [string, string, string, string][] = [
  ["certificates", "image_url", "id", "title"],
  ["projects", "cover_image_url", "id", "slug"],
  ["experience", "logo_url", "id", "company"],
  ["profile", "photo_url", "id", "name"],
  ["profile", "cover_image_url", "id", "name"],
  ["site_settings", "logo_url", "id", "site_name"],
  ["site_settings", "favicon_url", "id", "site_name"],
  ["testimonials", "avatar_url", "id", "author"],
  ["seo", "og_image_url", "id", "title"],
];

/** Authoritative existence check via the storage API. */
async function objectExists(objectPath: string): Promise<boolean> {
  const slash = objectPath.lastIndexOf("/");
  const dir = slash > 0 ? objectPath.slice(0, slash) : "";
  const name = slash > 0 ? objectPath.slice(slash + 1) : objectPath;
  const { data, error } = await db.storage.from("media").list(dir, { search: name, limit: 100 });
  if (error) throw new Error(`storage list failed: ${error.message}`);
  return (data ?? []).some((o) => o.name === name);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function main() {
  let dead = 0;
  let external = 0;

  for (const [table, col, idCol, labelCol] of TARGETS) {
    const { data, error } = await db.from(table).select(`${idCol}, ${col}, ${labelCol}`);
    if (error) continue; // column/table not in this schema version
    for (const row of (data as any[]) ?? []) {
      const value: string = row[col];
      if (!value || !value.startsWith("http")) continue;

      if (!value.startsWith(PUBLIC_PREFIX)) {
        external++;
        continue; // never touch URLs we cannot authoritatively verify
      }

      const objectPath = decodeURIComponent(value.slice(PUBLIC_PREFIX.length).split("?")[0]);
      if (await objectExists(objectPath)) continue;

      dead++;
      console.log(`DEAD  ${table}.${col}  "${String(row[labelCol]).slice(0, 40)}"`);
      console.log(`      missing object: ${objectPath}`);
      if (FIX) {
        const { error: upErr } = await db.from(table).update({ [col]: "" }).eq(idCol, row[idCol]);
        console.log(upErr ? `      ❌ ${upErr.message}` : "      ✓ cleared");
      }
    }
  }

  if (external) console.log(`(${external} external image URL(s) left untouched)`);
  console.log(
    dead === 0
      ? "\n✅ Every Supabase-hosted image URL points at a real object."
      : FIX
        ? `\n✅ Cleared ${dead} dead image URL(s). Re-upload those images in the admin.`
        : `\n⚠ Found ${dead} dead image URL(s). Re-run with --fix to clear them.`
  );
}

main().catch((e) => {
  console.error(`❌ ${e.message}`);
  process.exit(1);
});
