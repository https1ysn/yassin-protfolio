-- ============================================================
-- Migration 002 — production CMS upgrade
-- Run once in the Supabase SQL Editor (after schema.sql).
-- Adds columns for new admin features + the activity log.
-- ============================================================

-- projects: tags, archive, video already had video_url
alter table projects add column if not exists tags jsonb not null default '[]';
alter table projects add column if not exists archived boolean not null default false;

-- experience: company logo, technologies (tags column already exists), archive, duplicate support
alter table experience add column if not exists logo_url text not null default '';
alter table experience add column if not exists archived boolean not null default false;

-- skill categories: color accent
alter table skill_categories add column if not exists color text not null default '';

-- certificates: image, issue/expiry dates (date_label = issue date)
alter table certificates add column if not exists image_url text not null default '';
alter table certificates add column if not exists expiry_label text not null default '';

-- social links: enable/disable without deleting the URL
alter table social_links add column if not exists enabled boolean not null default true;

-- profile: cover image + biography
alter table profile add column if not exists cover_image_url text not null default '';
alter table profile add column if not exists biography text not null default '';

-- contact: telegram
alter table contact_info add column if not exists telegram_url text not null default '';

-- ---------- activity log ----------
create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  action text not null,          -- created / updated / deleted / reordered / duplicated / restored
  table_name text not null,
  item_label text not null default '',
  created_at timestamptz not null default now()
);

alter table activity_log enable row level security;

-- admin-only: the activity log is NOT publicly readable
drop policy if exists "admin read activity_log" on activity_log;
create policy "admin read activity_log" on activity_log
  for select to authenticated using (true);

drop policy if exists "admin write activity_log" on activity_log;
create policy "admin write activity_log" on activity_log
  for insert to authenticated with check (true);

drop policy if exists "admin delete activity_log" on activity_log;
create policy "admin delete activity_log" on activity_log
  for delete to authenticated using (true);
