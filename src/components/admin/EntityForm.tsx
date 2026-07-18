"use client";

import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { buildSchema, contentLocales, type FieldDef } from "@/lib/admin-config";
import Field from "./Field";

type ContentLang = "en" | (typeof contentLocales)[number];

const langTabs: { id: ContentLang; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "fr", label: "Français", flag: "🇫🇷" },
  { id: "ar", label: "العربية", flag: "🇲🇦" },
];

type Props = {
  fields: FieldDef[];
  defaultValues: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => Promise<{ ok: boolean; error?: string }>;
  submitLabel?: string;
  /** auto-generate `target` from `source` while the target is untouched */
  slugFrom?: { source: string; target: string };
  /** save automatically ~1.5s after the last valid change (singleton pages) */
  autosave?: boolean;
};

/** Builds initial values so every field is controlled from the first render. */
export function emptyValues(fields: FieldDef[], row?: Record<string, unknown> | null) {
  const values: Record<string, unknown> = {};
  const init = (f: FieldDef, key: string) => {
    const existing = row?.[key];
    if (existing !== undefined && existing !== null) values[key] = existing;
    else if (f.type === "boolean") values[key] = false;
    else if (f.type === "number") values[key] = f.min ?? 0;
    else if (f.type === "lines" || f.type === "objectList") values[key] = [];
    else values[key] = "";
  };
  for (const f of fields) {
    init(f, f.name);
    if (f.localized) for (const lang of contentLocales) init(f, `${f.name}_${lang}`);
  }
  return values;
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function EntityForm({
  fields,
  defaultValues,
  onSubmit,
  submitLabel = "Save changes",
  slugFrom,
  autosave = false,
}: Props) {
  const methods = useForm({
    resolver: zodResolver(buildSchema(fields)),
    defaultValues: defaultValues as never,
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [lang, setLang] = useState<ContentLang>("en");
  const slugTouched = useRef(!!(defaultValues[slugFrom?.target ?? ""] as string));
  const hasLocalized = fields.some((f) => f.localized);
  const visibleFields = lang === "en" ? fields : fields.filter((f) => f.localized);

  const submit = methods.handleSubmit(async (values) => {
    setStatus("saving");
    setError("");
    const result = await onSubmit(values as Record<string, unknown>);
    if (result.ok) {
      setStatus("saved");
      methods.reset(values as never, { keepValues: true }); // clears dirty state
      setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 2200);
    } else {
      setStatus("error");
      setError(result.error ?? "Save failed");
    }
  });

  /* slug generation: follow the source until the user edits the slug manually */
  useEffect(() => {
    if (!slugFrom) return;
    const sub = methods.watch((values, { name }) => {
      if (name === slugFrom.target) slugTouched.current = true;
      if (name === slugFrom.source && !slugTouched.current) {
        methods.setValue(slugFrom.target as never, slugify(String(values[slugFrom.source] ?? "")) as never);
      }
    });
    return () => sub.unsubscribe();
  }, [methods, slugFrom]);

  /* Ctrl+S / Cmd+S saves */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        submit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* autosave: debounce after the last change, only when dirty */
  useEffect(() => {
    if (!autosave) return;
    let timer: ReturnType<typeof setTimeout>;
    const sub = methods.watch(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (methods.formState.isDirty) submit();
      }, 1500);
    });
    return () => {
      clearTimeout(timer);
      sub.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autosave]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={submit} className="space-y-5">
        {hasLocalized && (
          <div className="flex items-center gap-3">
            <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1" role="tablist" aria-label="Content language">
              {langTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={lang === tab.id}
                  onClick={() => setLang(tab.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    lang === tab.id ? "bg-white/10 text-white" : "text-muted hover:text-white"
                  }`}
                >
                  <span aria-hidden="true">{tab.flag}</span> {tab.label}
                </button>
              ))}
            </div>
            {lang !== "en" && (
              <span className="text-[11px] text-muted/70">
                Empty fields fall back to English on the site.
              </span>
            )}
          </div>
        )}

        {visibleFields.map((f) => (
          <Field
            key={lang === "en" ? f.name : `${f.name}_${lang}`}
            field={f}
            suffix={lang === "en" ? undefined : lang}
            rtl={lang === "ar"}
          />
        ))}

        {lang !== "en" && visibleFields.length === 0 && (
          <p className="rounded-xl border border-dashed border-white/15 px-4 py-8 text-center text-xs text-muted">
            This module has no translatable fields.
          </p>
        )}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={status === "saving"}
            className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {status === "saving" ? <Loader2 size={15} className="animate-spin" /> : null}
            {submitLabel}
          </button>
          <AnimatePresence>
            {status === "saved" && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400"
              >
                <Check size={15} /> Saved
              </motion.span>
            )}
          </AnimatePresence>
          {status === "error" && <span className="text-sm text-red-400">{error}</span>}
          <span className="ml-auto hidden text-[11px] text-muted/60 sm:block">
            {autosave ? "Autosaves as you edit · " : ""}Ctrl+S to save
          </span>
        </div>
      </form>
    </FormProvider>
  );
}
