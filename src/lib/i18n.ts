export const locales = ["en", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "locale";

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

export const localeMeta: Record<Locale, { name: string; native: string; flag: string; dir: "ltr" | "rtl" }> = {
  en: { name: "English", native: "English", flag: "🇬🇧", dir: "ltr" },
  fr: { name: "French", native: "Français", flag: "🇫🇷", dir: "ltr" },
  ar: { name: "Arabic", native: "العربية", flag: "🇲🇦", dir: "rtl" },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Messages = Record<string, any>;

/** Loads one locale's message bundle (server-side, per request). */
export async function getMessages(locale: Locale): Promise<Messages> {
  switch (locale) {
    case "fr":
      return (await import("../../messages/fr.json")).default;
    case "ar":
      return (await import("../../messages/ar.json")).default;
    default:
      return (await import("../../messages/en.json")).default;
  }
}
