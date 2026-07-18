import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import PortfolioClient from "@/components/PortfolioClient";

/* always render fresh so admin edits appear immediately */
export const dynamic = "force-dynamic";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = await getSiteContent(locale);
  return <PortfolioClient content={content} />;
}
