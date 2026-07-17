-- ============================================================
-- Migration 003 — project case-study fields
-- Run once in the Supabase SQL Editor.
-- The "why it was built" story lives in the existing
-- long_description column; these add the rest of the case study.
-- ============================================================

alter table projects add column if not exists challenge text not null default '';
alter table projects add column if not exists results text not null default '';
alter table projects add column if not exists lessons text not null default '';
