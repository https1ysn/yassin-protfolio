# Deployment Guide

The project deploys as a server-rendered Next.js app. Supabase hosts the database,
auth, and file storage (its free tier is enough for a portfolio).

## Deploy to Vercel (recommended)

1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Portfolio with admin CMS"
   git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. In **Environment Variables**, add (same values as `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

   Do **not** add the secret key to Vercel — it is only for local seeding.
4. Click **Deploy**. Vercel auto-detects Next.js; no other configuration is needed.

Your site is live at `https://your-project.vercel.app` and the dashboard at `/admin`.

## After deploying

- **Custom domain**: Vercel → Project → Settings → Domains.
- **SEO**: set the canonical URL in Admin → SEO once you know your final domain.
- **Auth redirect**: in Supabase → Authentication → URL Configuration, set your
  production URL as the Site URL.

## Environment variables reference

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | local + Vercel | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | local + Vercel | Publishable key (safe to expose; RLS protects data) |
| `SUPABASE_SECRET_KEY` | local only | Seed script bypasses RLS to import content |

Legacy naming (`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) is also
accepted as a fallback.

## Security model

- Content tables are world-readable (it's a public portfolio) and writable only by
  authenticated users — enforced by Postgres row-level security, not just the UI.
- `/admin` routes are additionally gated by middleware that redirects anonymous
  visitors to the login page.
- The `media` bucket is public-read; only authenticated admins can upload/delete.
