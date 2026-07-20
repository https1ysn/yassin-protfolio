"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

/** Catches render errors in the portfolio so visitors never see a raw stack trace. */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Portfolio render error:", error);
  }, [error]);

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-base px-4 text-center">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div aria-hidden="true" className="orb orb-violet -top-24 right-[-8%] h-[26rem] w-[26rem]" />

      <div className="glass relative w-full max-w-md rounded-3xl p-8">
        <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          This page failed to load. Please try again — if it keeps happening, the content service may be
          temporarily unavailable.
        </p>
        <button
          type="button"
          onClick={reset}
          className="btn-primary mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
        >
          <RefreshCw size={15} />
          Try again
        </button>
      </div>
    </main>
  );
}
