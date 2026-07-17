import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LOCALE_COOKIE, isLocale } from "@/lib/i18n";
import LanguageSelect from "@/components/LanguageSelect";

export const dynamic = "force-dynamic";

/** First visit: full-screen language choice. Return visits: straight to the saved locale. */
export default async function Root() {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (saved && isLocale(saved)) redirect(`/${saved}`);
  return <LanguageSelect />;
}
