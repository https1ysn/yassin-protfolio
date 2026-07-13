-- ============================================================
-- Storage policies for the `media` bucket (run AFTER schema.sql).
--
-- Try running this in the SQL Editor. If you get
-- "must be owner of table objects", your project requires creating
-- these via the dashboard instead:
--
--   Storage → media bucket → Policies → New policy
--   1. "Allow public read"        — SELECT — for anon, authenticated
--   2. "Allow authenticated write" — INSERT, UPDATE, DELETE — for authenticated
--   (both with bucket_id = 'media')
-- ============================================================

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "admin insert media" on storage.objects;
create policy "admin insert media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
