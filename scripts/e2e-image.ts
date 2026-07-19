/** Proves the upload→storage→DB→resolver→component pipeline end to end, then reverts. */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const secret = (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)!;
const db = createClient(url, secret, { auth: { persistSession: false } });

const MARKER = `e2e-cert-${Date.now()}.png`;
const CERT = "Course Certificate — Front-End Development";

async function main() {
  // 1. upload (same call the admin Upload button makes)
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    "base64"
  );
  const { error: upErr } = await db.storage.from("media").upload(MARKER, new Blob([png], { type: "image/png" }));
  if (upErr) throw new Error(`upload: ${upErr.message}`);
  const publicUrl = db.storage.from("media").getPublicUrl(MARKER).data.publicUrl;
  console.log("✓ uploaded to storage");

  // 2. store on a certificate (same as saving the admin form)
  const { error: dbErr } = await db.from("certificates").update({ image_url: publicUrl }).eq("title", CERT);
  if (dbErr) throw new Error(`db: ${dbErr.message}`);
  console.log("✓ image_url saved on certificate");

  // 3. does the public page render it?
  try {
    const html = await (await fetch("http://localhost:3000/en", { cache: "no-store" })).text();
    console.log(
      html.includes(MARKER)
        ? "✅ certificate image RENDERS on the public page"
        : "❌ image not found in page HTML"
    );
  } finally {
    // 4. revert
    await db.from("certificates").update({ image_url: "" }).eq("title", CERT);
    await db.storage.from("media").remove([MARKER]);
    console.log("✓ test image reverted & removed");
  }
}

main().catch((e) => {
  console.error(`❌ ${e.message}`);
  process.exit(1);
});
