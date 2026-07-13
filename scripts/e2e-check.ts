/**
 * End-to-end proof (temporary diagnostic):
 * 1. storage: public read works, anonymous write is blocked
 * 2. public site: serves live DB content (edit a value, fetch /, revert)
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const pub = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;
const secret = (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)!;
const anon = createClient(url, pub, { auth: { persistSession: false } });
const admin = createClient(url, secret, { auth: { persistSession: false } });

const MARKER = "E2E-VERIFY-" + Date.now();

async function main() {
  // --- storage --- (1×1 transparent PNG; bucket only allows images + PDF)
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    "base64"
  );
  const blob = new Blob([png], { type: "image/png" });
  const { error: upErr } = await admin.storage.from("media").upload(`${MARKER}.png`, blob);
  if (upErr) console.log(`❌ Storage service upload: ${upErr.message}`);
  else {
    const publicUrl = admin.storage.from("media").getPublicUrl(`${MARKER}.png`).data.publicUrl;
    const res = await fetch(publicUrl);
    console.log(res.ok ? "✅ Storage: upload + public read work" : `❌ Storage public read: HTTP ${res.status}`);
    await admin.storage.from("media").remove([`${MARKER}.png`]);
  }

  const { error: anonUpErr } = await anon.storage.from("media").upload(`${MARKER}-anon.png`, blob);
  if (anonUpErr) console.log("✅ Storage: anonymous uploads are blocked");
  else {
    console.log("❌ Storage: anonymous upload SUCCEEDED — policies too permissive!");
    await admin.storage.from("media").remove([`${MARKER}-anon.png`]);
  }

  // --- live DB → site pipeline ---
  const { data: before } = await admin.from("profile").select("availability").eq("id", 1).single();
  const original = before!.availability as string;

  await admin.from("profile").update({ availability: MARKER }).eq("id", 1);
  try {
    const html = await (await fetch("http://localhost:3000/", { cache: "no-store" })).text();
    console.log(
      html.includes(MARKER)
        ? "✅ Public site: serving live database content"
        : "❌ Public site: marker not found — page may be serving fallback content"
    );
  } finally {
    await admin.from("profile").update({ availability: original }).eq("id", 1);
  }

  // confirm revert
  const { data: after } = await admin.from("profile").select("availability").eq("id", 1).single();
  console.log(after!.availability === original ? "✅ Test value reverted cleanly" : "❌ REVERT FAILED — check profile availability text!");
}

main().catch((e) => {
  console.error(`❌ ${e.message}`);
  process.exit(1);
});
