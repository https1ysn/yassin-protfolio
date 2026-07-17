"use client";

import { createContext, useCallback, useContext, ReactNode } from "react";
import type { Locale, Messages } from "@/lib/i18n";

type I18n = { locale: Locale; messages: Messages };

const I18nContext = createContext<I18n>({ locale: "en", messages: {} });

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  return <I18nContext.Provider value={{ locale, messages }}>{children}</I18nContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(I18nContext).locale;
}

/**
 * Translation hook: t("contact.send"), with optional {param} interpolation:
 * t("footer.line", { year: 2026 }). Falls back to the key path if missing.
 */
export function useT() {
  const { messages } = useContext(I18nContext);
  return useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let value: unknown = messages;
      for (const part of key.split(".")) {
        if (value && typeof value === "object" && part in (value as object)) {
          value = (value as Record<string, unknown>)[part];
        } else {
          return key;
        }
      }
      let text = typeof value === "string" ? value : key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replaceAll(`{${k}}`, String(v));
        }
      }
      return text;
    },
    [messages]
  );
}
