import { getSiteContent } from "@/lib/content";
import PortfolioClient from "@/components/PortfolioClient";

/* always render fresh so admin edits appear immediately */
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();
  return <PortfolioClient content={content} />;
}
