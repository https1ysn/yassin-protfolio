import { supabaseBrowser } from "@/lib/supabase/client";

export const MEDIA_BUCKET = "media";

/** Collision-proof, URL-safe object key. Keeps the extension for MIME sniffing. */
export function buildObjectPath(fileName: string, folder = ""): string {
  const clean = fileName.normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
  const dot = clean.lastIndexOf(".");
  const base = (dot > 0 ? clean.slice(0, dot) : clean).slice(0, 60) || "file";
  const ext = dot > 0 ? clean.slice(dot).toLowerCase() : "";
  const unique =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  const name = `${Date.now()}-${unique}-${base}${ext}`;
  return folder ? `${folder.replace(/^\/+|\/+$/g, "")}/${name}` : name;
}

/**
 * Uploads to the public `media` bucket and returns a **verified** public URL.
 *
 * `getPublicUrl()` only builds a string — it never checks that the object
 * exists. Returning it blindly is what let dead URLs get saved into the
 * database while the CMS reported success. We therefore confirm the object is
 * actually retrievable before handing the URL back; if it isn't, we surface a
 * real error instead of persisting a broken link.
 */
export async function uploadToMedia(file: File, folder = ""): Promise<string> {
  const db = supabaseBrowser();
  const path = buildObjectPath(file.name, folder);

  const { error } = await db.storage.from(MEDIA_BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
    cacheControl: "3600",
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  const publicUrl = db.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;

  // Verify the object is genuinely served before we let it reach the database.
  const reachable = await isReachable(publicUrl);
  if (!reachable) {
    await db.storage.from(MEDIA_BUCKET).remove([path]); // don't leave an orphan
    throw new Error(
      "Upload did not persist in storage. Check that the 'media' bucket is public and has a public-read policy."
    );
  }
  return publicUrl;
}

/** True when the URL responds successfully (storage returns 400/404 for missing objects). */
export async function isReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}
