/**
 * Single source of truth for Supabase environment variables.
 *
 * Preferred (new Supabase API-key naming):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY   (sb_publishable_...)
 *   SUPABASE_SECRET_KEY                    (sb_secret_..., seed script only)
 *
 * Legacy names (NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY)
 * are still read as fallbacks.
 *
 * Note: the expressions below must stay as literal `process.env.X` property
 * accesses — Next.js inlines NEXT_PUBLIC_* values into client bundles by
 * textual replacement at build time.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

export const isSupabaseConfigured = () => SUPABASE_URL !== "" && SUPABASE_PUBLISHABLE_KEY !== "";
