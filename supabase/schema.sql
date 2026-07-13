-- ============================================================
-- Yassine El Biad — Portfolio CMS schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL).
-- Creates all content tables, row-level security, and storage.
-- ============================================================

-- ---------- singleton tables (always exactly one row, id = 1) ----------

create table if not exists profile (
  id int primary key default 1 check (id = 1),
  name text not null default '',
  initials text not null default '',
  role text not null default '',
  typing_roles jsonb not null default '[]',
  location text not null default '',
  photo_url text not null default '',
  cv_url text not null default '',
  tagline text not null default '',
  availability text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists hero (
  id int primary key default 1 check (id = 1),
  headline_line1 text not null default '',
  headline_line2 text not null default '',
  show_particles boolean not null default true,
  show_scroll_hint boolean not null default true,
  stats jsonb not null default '[]', -- [{value, suffix, label}]
  updated_at timestamptz not null default now()
);

create table if not exists about (
  id int primary key default 1 check (id = 1),
  paragraphs jsonb not null default '[]',   -- string[]
  strengths jsonb not null default '[]',    -- [{title, text}]
  updated_at timestamptz not null default now()
);

create table if not exists contact_info (
  id int primary key default 1 check (id = 1),
  email text not null default '',
  phone text not null default '',
  display_phone text not null default '',
  whatsapp_url text not null default '',
  address text not null default '',
  maps_url text not null default '',
  form_enabled boolean not null default true,
  form_note text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists seo (
  id int primary key default 1 check (id = 1),
  title text not null default '',
  description text not null default '',
  keywords jsonb not null default '[]',
  og_title text not null default '',
  og_description text not null default '',
  og_image_url text not null default '',
  twitter_card text not null default 'summary_large_image',
  robots text not null default 'index, follow',
  canonical_url text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists site_settings (
  id int primary key default 1 check (id = 1),
  site_name text not null default '',
  logo_url text not null default '',
  favicon_url text not null default '',
  primary_color text not null default '#4F46E5',
  secondary_color text not null default '#7C3AED',
  accent_color text not null default '#06B6D4',
  theme text not null default 'dark',
  show_loader boolean not null default true,
  enable_animations boolean not null default true,
  enable_custom_cursor boolean not null default true,
  enable_particles boolean not null default true,
  font_display text not null default 'Sora',
  font_body text not null default 'Inter',
  updated_at timestamptz not null default now()
);

-- ---------- collection tables ----------

create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  role text not null default '',
  company text not null default '',
  period text not null default '',
  location text not null default '',
  summary text not null default '',
  bullets jsonb not null default '[]',
  tags jsonb not null default '[]',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  organization text not null default '',
  meta text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists skill_categories (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  icon text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references skill_categories(id) on delete cascade,
  name text not null default '',
  level int not null default 50 check (level between 0 and 100),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists soft_skills (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists languages (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  level_label text not null default '',
  percent int not null default 50 check (percent between 0 and 100),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  slug text not null unique,
  category text not null default '',
  short_description text not null default '',
  long_description text not null default '',
  problem text not null default '',
  solution text not null default '',
  features jsonb not null default '[]',
  technologies jsonb not null default '[]',
  cover_image_url text not null default '',
  github_url text not null default '',
  live_url text not null default '',
  video_url text not null default '',
  link_label text not null default '',
  featured boolean not null default false,
  published boolean not null default true,
  seo_title text not null default '',
  seo_description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  url text not null,
  alt text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  description text not null default '',
  icon text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  issuer text not null default '',
  date_label text not null default '',
  url text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  author text not null default '',
  role text not null default '',
  text text not null default '',
  avatar_url text not null default '',
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null default '',  -- github, linkedin, indeed, fiverr, upwork, behance, dribbble, facebook, instagram, x, tiktok, youtube, discord, telegram, whatsapp, email, website, custom
  label text not null default '',
  url text not null default '',       -- empty url = hidden on the site
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- row-level security ----------
-- Public visitors can read content; only authenticated admins can write.

do $$
declare t text;
begin
  foreach t in array array[
    'profile','hero','about','contact_info','seo','site_settings',
    'experience','education','skill_categories','skills','soft_skills',
    'languages','projects','project_images','services','certificates',
    'testimonials','social_links'
  ] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "public read %s" on %I', t, t);
    execute format('create policy "public read %s" on %I for select using (true)', t, t);
    execute format('drop policy if exists "admin write %s" on %I', t, t);
    execute format('create policy "admin write %s" on %I for all to authenticated using (true) with check (true)', t, t);
  end loop;
end $$;

-- ---------- storage ----------
-- NOTE: storage is configured separately. The `media` bucket is created by
-- `npx tsx scripts/fix-storage.ts` (or the dashboard), and upload policies are
-- added via Dashboard → Storage → Policies or supabase/storage-policies.sql.
-- Newer Supabase projects reject storage DDL from the SQL editor, and a single
-- failing statement would roll back this whole file — so it lives elsewhere.
