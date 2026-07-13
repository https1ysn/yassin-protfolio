"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock } from "lucide-react";
import { isSupabaseConfigured, supabaseBrowser } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const configured = isSupabaseConfigured();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-base px-4">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div aria-hidden="true" className="orb orb-violet -top-24 right-[-8%] h-[28rem] w-[28rem]" />
      <div aria-hidden="true" className="orb orb-cyan bottom-[-12%] left-[-10%] h-[24rem] w-[24rem]" />

      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass relative w-full max-w-sm rounded-3xl p-8"
      >
        <div className="gradient-border glow-indigo mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
          <Lock size={20} className="text-violet-300" />
        </div>
        <h1 className="mt-5 text-center font-display text-2xl font-bold">Admin Access</h1>
        <p className="mt-2 text-center text-sm text-muted">Sign in to manage your portfolio.</p>

        {!configured ? (
          <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-relaxed text-amber-200">
            <strong>Supabase is not configured yet.</strong>
            <p className="mt-1 text-amber-200/80">
              Copy <code>.env.example</code> to <code>.env.local</code>, fill in your Supabase URL and anon
              key, then restart the server. Full steps are in <code>SETUP.md</code>.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>
            {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="btn-primary flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy && <Loader2 size={15} className="animate-spin" />}
              Sign in
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
