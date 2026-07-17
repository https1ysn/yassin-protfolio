"use client";

import { useRouter } from "next/navigation";
import { locales, localeMeta, LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { useLocale, useT } from "@/components/I18nContext";

const shortLabel: Record<Locale, string> = { en: "EN", fr: "FR", ar: "ع" };

/** Compact pill switcher in the navbar; persists the choice in the cookie. */
export default function LanguageSwitcher() {
  const router = useRouter();
  const current = useLocale();
  const t = useT();

  const switchTo = (locale: Locale) => {
    if (locale === current) return;
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
    router.push(`/${locale}`);
  };

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.04] p-1"
      role="group"
      aria-label={t("nav.changeLanguage")}
    >
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          aria-pressed={locale === current}
          aria-label={localeMeta[locale].name}
          lang={locale}
          className={`h-7 min-w-8 rounded-full px-1.5 text-[11px] font-bold transition-all duration-300 ${
            locale === current
              ? "bg-gradient-to-r from-indigo-accent to-violet-accent text-white shadow-[0_0_16px_rgba(124,58,237,0.4)]"
              : "text-muted hover:text-white"
          }`}
        >
          {shortLabel[locale]}
        </button>
      ))}
    </div>
  );
}
