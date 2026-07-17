import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Sora, Tajawal } from "next/font/google";
import { getSeo } from "@/lib/content";
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
});

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

/* rendered dynamically so CMS edits appear immediately in every locale */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const [seo, messages] = await Promise.all([getSeo(), getMessages(locale)]);

  // The database drives SEO for English; fr/ar use the localized bundle.
  const title = seo.title;
  const description = locale === "en" ? seo.description : (messages.meta?.description ?? seo.description);
  const base = seo.canonicalUrl ? seo.canonicalUrl.replace(/\/(en|fr|ar)?\/?$/, "") : "";

  return {
    title,
    description,
    keywords: seo.keywords,
    authors: [{ name: "Yassine El Biad" }],
    robots: seo.robots,
    alternates: {
      canonical: base ? `${base}/${locale}` : `/${locale}`,
      languages: {
        en: base ? `${base}/en` : "/en",
        fr: base ? `${base}/fr` : "/fr",
        ar: base ? `${base}/ar` : "/ar",
        "x-default": base ? `${base}/` : "/",
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

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${sora.variable} ${tajawal.variable}`}>
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
