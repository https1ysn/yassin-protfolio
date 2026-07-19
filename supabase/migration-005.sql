-- ============================================================
-- Migration 005 — complete multilingual coverage
-- Run once in the Supabase SQL Editor (after migration-004).
-- Adds *_fr / *_ar variants for every remaining visitor-visible
-- field. Purely additive — no data is touched.
-- ============================================================

-- profile: name (Arabic script) + location
alter table profile add column if not exists name_fr text not null default '';
alter table profile add column if not exists name_ar text not null default '';
alter table profile add column if not exists location_fr text not null default '';
alter table profile add column if not exists location_ar text not null default '';

-- hero headline lines (previously hardcoded in the component — now CMS-driven)
alter table hero add column if not exists headline_line1_fr text not null default '';
alter table hero add column if not exists headline_line1_ar text not null default '';
alter table hero add column if not exists headline_line2_fr text not null default '';
alter table hero add column if not exists headline_line2_ar text not null default '';

-- experience: location, period (month names differ), technology tags
alter table experience add column if not exists location_fr text not null default '';
alter table experience add column if not exists location_ar text not null default '';
alter table experience add column if not exists period_fr text not null default '';
alter table experience add column if not exists period_ar text not null default '';
alter table experience add column if not exists tags_fr jsonb not null default '[]';
alter table experience add column if not exists tags_ar jsonb not null default '[]';

-- education: organization
alter table education add column if not exists organization_fr text not null default '';
alter table education add column if not exists organization_ar text not null default '';

-- individual skills (e.g. "Responsive layout", "Excel — formulas & pivot tables")
alter table skills add column if not exists name_fr text not null default '';
alter table skills add column if not exists name_ar text not null default '';

-- projects: technologies + tags
alter table projects add column if not exists technologies_fr jsonb not null default '[]';
alter table projects add column if not exists technologies_ar jsonb not null default '[]';
alter table projects add column if not exists tags_fr jsonb not null default '[]';
alter table projects add column if not exists tags_ar jsonb not null default '[]';

-- certificates: issue date label
alter table certificates add column if not exists date_label_fr text not null default '';
alter table certificates add column if not exists date_label_ar text not null default '';

-- SEO: localized metadata
alter table seo add column if not exists title_fr text not null default '';
alter table seo add column if not exists title_ar text not null default '';
alter table seo add column if not exists description_fr text not null default '';
alter table seo add column if not exists description_ar text not null default '';
alter table seo add column if not exists og_title_fr text not null default '';
alter table seo add column if not exists og_title_ar text not null default '';
alter table seo add column if not exists og_description_fr text not null default '';
alter table seo add column if not exists og_description_ar text not null default '';
alter table seo add column if not exists keywords_fr jsonb not null default '[]';
alter table seo add column if not exists keywords_ar jsonb not null default '[]';
