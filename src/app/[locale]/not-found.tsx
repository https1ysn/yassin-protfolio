import Link from "next/link";

/** Shown for unknown locales and unmatched paths under /[locale]. */
export default function LocaleNotFound() {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-base px-4 text-center">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div aria-hidden="true" className="orb orb-indigo -top-24 right-[-8%] h-[26rem] w-[26rem]" />

      <div className="glass relative w-full max-w-md rounded-3xl p-8">
        <p className="gradient-text font-display text-5xl font-bold">404</p>
        <h1 className="mt-4 font-display text-xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          That page doesn&apos;t exist. Head back to the portfolio.
        </p>
        <Link
          href="/en"
          className="btn-primary mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
        >
          Back to portfolio
        </Link>
      </div>
    </main>
  );
}
