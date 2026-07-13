import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, isSupabaseConfigured } from "@/lib/env";

export { isSupabaseConfigured };

/** Browser-side Supabase client (auth, storage, admin mutations). */
export function supabaseBrowser() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
