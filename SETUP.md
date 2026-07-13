# Setup Guide — Portfolio + Admin CMS

Follow these steps once. After that, you manage the whole website from `/admin`.

## 1. Create a Supabase project (free)

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Pick any name (e.g. `portfolio`) and a strong database password.
3. Wait ~2 minutes for the project to be provisioned.

## 2. Create the database

1. In the Supabase dashboard, open **SQL Editor**.
2. Copy the entire contents of [`supabase/schema.sql`](supabase/schema.sql) into the editor.
3. Click **Run** — you should see "Success. No rows returned." This creates every
   table and all row-level security policies.
4. Do the same with [`supabase/migration-002.sql`](supabase/migration-002.sql) —
   it adds the newer CMS columns (galleries, archive, activity log, …).

Then set up storage:

4. Run `npx tsx scripts/fix-storage.ts` locally — it creates the public `media` bucket.
5. Add upload policies: try running [`supabase/storage-policies.sql`](supabase/storage-policies.sql)
   in the SQL Editor. If it fails with *"must be owner of table objects"*, add them via
   **Storage → media → Policies → New policy** instead: public read (SELECT for anon +
   authenticated) and authenticated write (INSERT/UPDATE/DELETE), both on `bucket_id = 'media'`.

## 3. Create your admin account

1. In the dashboard, open **Authentication → Users → Add user → Create new user**.
2. Enter your email and a strong password.
3. Check **Auto confirm user**, then create it. This is your `/admin` login.

## 4. Connect the project

1. In the dashboard, open **Project Settings → API Keys**.
2. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` — the Project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — the publishable key (`sb_publishable_...`)
   - `SUPABASE_SECRET_KEY` — the secret key (`sb_secret_...`, used only by the seed script)

   Older projects with legacy JWT keys can use `NEXT_PUBLIC_SUPABASE_ANON_KEY` and
   `SUPABASE_SERVICE_ROLE_KEY` instead — both namings work.

## 5. Import your content

```bash
npm install
npm run seed
```

This migrates every existing portfolio section (profile, hero, about, experience,
education, skills, languages, projects, services, certificates, social links) into
the database. It never overwrites collections that already have rows.

## 6. Run it

```bash
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin (sign in with the user from step 3)

## Notes

- **No Supabase yet?** The website still works — it automatically falls back to the
  built-in content until the database is connected and seeded.
- **Social links**: fill in a URL in Admin → Social Links to show it on the site;
  clear the URL to hide it. Empty links never appear.
- **Media**: upload images/PDFs in Admin → Media Library, copy the URL, and paste it
  into any image/file field (or use the Upload button directly on those fields).
