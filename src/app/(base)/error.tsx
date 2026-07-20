"use client";

import { useEffect } from "react";

/** Error boundary for the language selector and the admin dashboard. */
export default function BaseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin/base render error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-base px-4 text-center">
      <div className="glass w-full max-w-md rounded-3xl p-8">
        <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="btn-primary mt-7 rounded-full px-6 py-3 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
