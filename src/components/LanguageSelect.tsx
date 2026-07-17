"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { locales, localeMeta, LOCALE_COOKIE, type Locale } from "@/lib/i18n";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Full-screen first-visit language choice, in the site's design language. */
export default function LanguageSelect() {
  const router = useRouter();
  const [leaving, setLeaving] = useState<Locale | null>(null);

  const choose = (locale: Locale) => {
    if (leaving) return;
    setLeaving(locale);
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
    setTimeout(() => router.push(`/${locale}`), 450);
  };

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-base px-4">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div aria-hidden="true" className="orb orb-indigo -top-32 right-[-10%] h-[34rem] w-[34rem]" />
      <div aria-hidden="true" className="orb orb-cyan bottom-[-15%] left-[-12%] h-[30rem] w-[30rem]" style={{ animationDelay: "-8s" }} />
      <div aria-hidden="true" className="orb orb-violet left-[38%] top-[52%] h-[22rem] w-[22rem]" style={{ animationDelay: "-4s" }} />

      <motion.div
        initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
        animate={leaving ? { opacity: 0, scale: 0.96, filter: "blur(8px)" } : { opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: leaving ? 0.45 : 0.9, ease: EASE }}
        className="relative w-full max-w-2xl text-center"
      >
        <div className="gradient-border glow-indigo mx-auto flex h-16 w-16 items-center justify-center rounded-2xl font-display text-xl font-bold">
          <span className="gradient-text">YE</span>
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
          Welcome · Bienvenue · مرحباً
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-5xl">
          Choose your <span className="gradient-text">language</span>
        </h1>
        <p className="mt-3 text-sm text-muted">You can change it anytime · Modifiable à tout moment · يمكنك تغييرها في أي وقت</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {locales.map((locale, i) => {
            const meta = localeMeta[locale];
            return (
              <motion.button
                key={locale}
                type="button"
                onClick={() => choose(locale)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.1, duration: 0.7, ease: EASE }}
                whileHover={{ scale: 1.045, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className={`glass card-hover group rounded-3xl p-7 text-center outline-offset-4 ${
                  leaving === locale ? "!border-violet-accent/60" : ""
                }`}
                lang={locale}
                aria-label={`${meta.name} — ${meta.native}`}
              >
                <span className="block text-4xl transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" aria-hidden="true">
                  {meta.flag}
                </span>
                <span className="mt-4 block font-display text-lg font-semibold" dir={meta.dir}>
                  {meta.native}
                </span>
                <span className="mt-1 block text-xs text-muted">{meta.name}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </main>
  );
}
