-- ============================================================
-- Migration 004 — multilingual CMS fields (French + Arabic)
-- Run once in the Supabase SQL Editor.
--
-- Design: the existing column IS the English/original text.
-- This migration only ADDS *_fr and *_ar variants, so it is
-- purely additive and preserves every row untouched.
-- Frontend fallback: requested locale → English/original.
-- ============================================================

-- profile
alter table profile add column if not exists role_fr text not null default '';
alter table profile add column if not exists role_ar text not null default '';
alter table profile add column if not exists tagline_fr text not null default '';
alter table profile add column if not exists tagline_ar text not null default '';
alter table profile add column if not exists availability_fr text not null default '';
alter table profile add column if not exists availability_ar text not null default '';
alter table profile add column if not exists typing_roles_fr jsonb not null default '[]';
alter table profile add column if not exists typing_roles_ar jsonb not null default '[]';

-- hero stats (labels live inside the jsonb array)
alter table hero add column if not exists stats_fr jsonb not null default '[]';
alter table hero add column if not exists stats_ar jsonb not null default '[]';

-- about
alter table about add column if not exists paragraphs_fr jsonb not null default '[]';
alter table about add column if not exists paragraphs_ar jsonb not null default '[]';
alter table about add column if not exists strengths_fr jsonb not null default '[]';
alter table about add column if not exists strengths_ar jsonb not null default '[]';

-- experience
alter table experience add column if not exists role_fr text not null default '';
alter table experience add column if not exists role_ar text not null default '';
alter table experience add column if not exists summary_fr text not null default '';
alter table experience add column if not exists summary_ar text not null default '';
alter table experience add column if not exists bullets_fr jsonb not null default '[]';
alter table experience add column if not exists bullets_ar jsonb not null default '[]';

-- education
alter table education add column if not exists title_fr text not null default '';
alter table education add column if not exists title_ar text not null default '';
alter table education add column if not exists meta_fr text not null default '';
alter table education add column if not exists meta_ar text not null default '';

-- skill categories
alter table skill_categories add column if not exists title_fr text not null default '';
alter table skill_categories add column if not exists title_ar text not null default '';

-- soft skills
alter table soft_skills add column if not exists name_fr text not null default '';
alter table soft_skills add column if not exists name_ar text not null default '';

-- languages
alter table languages add column if not exists name_fr text not null default '';
alter table languages add column if not exists name_ar text not null default '';
alter table languages add column if not exists level_label_fr text not null default '';
alter table languages add column if not exists level_label_ar text not null default '';

-- projects
alter table projects add column if not exists title_fr text not null default '';
alter table projects add column if not exists title_ar text not null default '';
alter table projects add column if not exists category_fr text not null default '';
alter table projects add column if not exists category_ar text not null default '';
alter table projects add column if not exists problem_fr text not null default '';
alter table projects add column if not exists problem_ar text not null default '';
alter table projects add column if not exists solution_fr text not null default '';
alter table projects add column if not exists solution_ar text not null default '';
alter table projects add column if not exists long_description_fr text not null default '';
alter table projects add column if not exists long_description_ar text not null default '';
alter table projects add column if not exists features_fr jsonb not null default '[]';
alter table projects add column if not exists features_ar jsonb not null default '[]';
alter table projects add column if not exists challenge_fr text not null default '';
alter table projects add column if not exists challenge_ar text not null default '';
alter table projects add column if not exists results_fr text not null default '';
alter table projects add column if not exists results_ar text not null default '';
alter table projects add column if not exists lessons_fr text not null default '';
alter table projects add column if not exists lessons_ar text not null default '';
alter table projects add column if not exists link_label_fr text not null default '';
alter table projects add column if not exists link_label_ar text not null default '';

-- services
alter table services add column if not exists title_fr text not null default '';
alter table services add column if not exists title_ar text not null default '';
alter table services add column if not exists description_fr text not null default '';
alter table services add column if not exists description_ar text not null default '';

-- certificates
alter table certificates add column if not exists title_fr text not null default '';
alter table certificates add column if not exists title_ar text not null default '';
alter table certificates add column if not exists issuer_fr text not null default '';
alter table certificates add column if not exists issuer_ar text not null default '';
