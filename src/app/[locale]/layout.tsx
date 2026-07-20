import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Sora, Tajawal } from "next/font/google";
import { getSeo } from "@/lib/content";
import { isSupabaseConfigured, supabaseServer } from "@/lib/supabase/server";
import { getMessages, isLocale, localeMeta, type Locale } from "@/lib/i18n";
import { I18nProvider } from "@/components/I18nContext";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
  // Only the Arabic locale renders in Tajawal — don't make en/fr visitors
  // preload four Arabic weights they will never paint.
  preload: false,
});

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

/* rendered dynamically so CMS edits appear immediately in every locale */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const [seo, messages] = await Promise.all([getSeo(locale), getMessages(locale)]);

  // Localized SEO from the CMS (locale → English fallback); the static bundle
  // is the last resort when the database has no description at all.
  const title = seo.title;
  const description = seo.description || (messages.meta?.description ?? "");
  const base = seo.canonicalUrl ? seo.canonicalUrl.replace(/\/(en|fr|ar)?\/?$/, "") : "";

  /**
   * hreflang/canonical/OG must be absolute or search engines ignore them.
   * Resolution order: canonical URL from the CMS → NEXT_PUBLIC_SITE_URL →
   * Vercel's deployment URL → localhost for development.
   */
  const origin =
    base ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");

  // custom favicon uploaded in Admin → Settings (falls back to the bundled icon)
  let faviconUrl = "";
  if (isSupabaseConfigured()) {
    try {
      const db = await supabaseServer();
      const { data } = await db.from("site_settings").select("favicon_url").eq("id", 1).maybeSingle();
      faviconUrl = data?.favicon_url ?? "";
    } catch {
      /* bundled icon.svg remains the fallback */
    }
  }

  return {
    metadataBase: new URL(origin),
    title,
    description,
    keywords: seo.keywords,
    authors: [{ name: "Yassine El Biad" }],
    robots: seo.robots,
    icons: faviconUrl ? { icon: faviconUrl } : undefined,
    alternates: {
      canonical: `${origin}/${locale}`,
      languages: {
        en: `${origin}/en`,
        fr: `${origin}/fr`,
        ar: `${origin}/ar`,
        // x-default must point at an indexable page — "/" is the noindex
        // language chooser, so English is the canonical default.
        "x-default": `${origin}/en`,
      },
    },
    openGraph: {
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      type: "website",
      locale: locale === "en" ? "en_US" : locale === "fr" ? "fr_FR" : "ar_MA",
      siteName: "Yassine El Biad",
      images: seo.ogImageUrl ? [{ url: seo.ogImageUrl }] : undefined,
    },
    twitter: {
      card: (seo.twitterCard as "summary_large_image") || "summary_large_image",
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      images: seo.ogImageUrl ? [seo.ogImageUrl] : undefined,
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Yassine El Biad",
  jobTitle: "Junior Web Developer & Data Specialist",
  email: "mailto:elbiadyassin25@gmail.com",
  telephone: "+212769145643",
  address: { "@type": "PostalAddress", addressLocality: "Casablanca", addressCountry: "MA" },
  knowsAbout: [
    "Web Development", "HTML", "CSS", "JavaScript", "PHP", "MySQL",
    "WordPress", "Data Entry", "Quality Control", "Excel", "Accounting",
  ],
  knowsLanguage: ["Arabic", "French", "English"],
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = await getMessages(locale as Locale);
  const dir = localeMeta[locale as Locale].dir;

  const fontVars = `${inter.variable} ${sora.variable}${locale === "ar" ? ` ${tajawal.variable}` : ""}`;

  return (
    <html lang={locale} dir={dir} className={fontVars}>
      <body className="noise">
        <a href="#home" className="skip-link">
          {locale === "fr" ? "Aller au contenu" : locale === "ar" ? "تخطّي إلى المحتوى" : "Skip to content"}
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <I18nProvider locale={locale as Locale} messages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
