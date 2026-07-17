import type { MetadataRoute } from "next";
import { getSeo } from "@/lib/content";
import { locales } from "@/lib/i18n";

export const dynamic = "force-dynamic";

/** /sitemap.xml — one entry per locale, using the canonical URL from Admin → SEO. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSeo();
  const base = (seo.canonicalUrl || "http://localhost:3000").replace(/\/(en|fr|ar)?\/?$/, "");
  const lastModified = new Date();

  return locales.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: locale === "en" ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}`])),
    },
  }));
}
