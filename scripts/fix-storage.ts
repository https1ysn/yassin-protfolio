/** Creates the public `media` bucket if missing (idempotent). */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const secret = (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)!;
const admin = createClient(url, secret, { auth: { persistSession: false } });

const BUCKET_CONFIG = {
  public: true,
  fileSizeLimit: "50MB",
  allowedMimeTypes: ["image/*", "application/pdf", "video/*"],
};

async function main() {
  const { data: buckets } = await admin.storage.listBuckets();
  if (buckets?.some((b) => b.name === "media")) {
    const { error } = await admin.storage.updateBucket("media", BUCKET_CONFIG);
    if (error) throw new Error(error.message);
    console.log("✓ media bucket updated (public, 50MB limit, images + PDF + video)");
    return;
  }
  const { error } = await admin.storage.createBucket("media", BUCKET_CONFIG);
  if (error) throw new Error(error.message);
  console.log("✓ media bucket created (public, 50MB limit, images + PDF + video)");
}

main().catch((e) => {
  console.error(`❌ ${e.message}`);
  process.exit(1);
});
