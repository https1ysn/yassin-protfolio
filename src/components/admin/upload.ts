import { supabaseBrowser } from "@/lib/supabase/client";

/** Uploads a file to the public `media` bucket and returns its public URL. */
export async function uploadToMedia(file: File): Promise<string> {
  const db = supabaseBrowser();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${Date.now()}-${safeName}`;
  const { error } = await db.storage.from("media").upload(path, file, { upsert: false });
  if (error) throw new Error(error.message);
  return db.storage.from("media").getPublicUrl(path).data.publicUrl;
}
