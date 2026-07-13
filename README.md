# Yassine El Biad — Portfolio + Admin CMS

Premium personal portfolio built with **Next.js 15**, **TypeScript**, **Tailwind CSS 4**,
**Framer Motion**, **GSAP** and **Lenis** — now powered by a **Supabase CMS** with a
full admin dashboard at `/admin`.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. The site works immediately with built-in content —
connect Supabase (see [SETUP.md](SETUP.md)) to unlock the admin dashboard.

## The two halves

| | |
| --- | --- |
| **Public site** `/` | The award-style portfolio: loader, custom cursor, particles, command palette (Ctrl+K), GSAP timeline, magnetic buttons, SEO + JSON-LD. |
| **Admin** `/admin` | Supabase-auth-protected dashboard: edit every section, manage projects, upload media, control SEO, colors, and feature toggles. |

## Managing content

- **All sections** (Profile, Hero, About, Experience, Education, Skills, Projects,
  Services, Certificates, Languages, Testimonials, Contact, Social Links, SEO,
  Settings) are edited in `/admin` — no code changes needed.
- Collections support **search, pagination, drag-and-drop ordering, bulk delete,
  and confirmation dialogs**.
- **Media Library** uploads images and PDFs to Supabase Storage.
- **Social links** with empty URLs are hidden on the site automatically.
- Without Supabase configured, the site falls back to the content in
  [`src/lib/data.ts`](src/lib/data.ts).

## Documentation

- [SETUP.md](SETUP.md) — create the database, admin user, and import content
- [DEPLOYMENT.md](DEPLOYMENT.md) — deploy to Vercel + Supabase
- [`supabase/schema.sql`](supabase/schema.sql) — full database schema with RLS

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run seed` | Import the built-in content into Supabase (one-time migration) |

## Easter egg

Try the Konami code on the site: ↑ ↑ ↓ ↓ ← → ← → B A
