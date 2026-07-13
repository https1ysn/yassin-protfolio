import type { MetadataRoute } from "next";
import { getSeo } from "@/lib/content";

export const dynamic = "force-dynamic";

/** /sitemap.xml — uses the canonical URL from Admin → SEO once it's set. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSeo();
  const base = (seo.canonicalUrl || "http://localhost:3000").replace(/\/$/, "");
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
