"use client";

import { useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import type { FieldDef } from "@/lib/admin-config";
import { uploadToMedia } from "./upload";

const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-wider text-muted";

function UploadButton({ onDone, accept }: { onDone: (url: string) => void; accept: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="btn-ghost inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-50"
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        Upload
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          setError("");
          try {
            onDone(await uploadToMedia(file));
          } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
          } finally {
            setBusy(false);
            e.target.value = "";
          }
        }}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </>
  );
}

/** Renders one admin form field from its config definition.
 *  With `suffix`, binds the localized variant column (e.g. title_fr). */
export default function Field({
  field: baseField,
  suffix,
  rtl,
}: {
  field: FieldDef;
  suffix?: string;
  rtl?: boolean;
}) {
  // shadow the field so every existing `field.name` reference targets the variant
  const field = suffix ? { ...baseField, name: `${baseField.name}_${suffix}` } : baseField;
  const dir = rtl ? ("rtl" as const) : undefined;
  const { register, control, formState } = useFormContext();
  const error = formState.errors[field.name]?.message as string | undefined;

  const wrap = (children: React.ReactNode) => (
    <div>
      <label className={labelClass}>{field.label}</label>
      {children}
      {field.help && <p className="mt-1.5 text-xs text-muted/70">{field.help}</p>}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );

  switch (field.type) {
    case "textarea":
      return wrap(
        <textarea {...register(field.name)} rows={4} dir={dir} placeholder={field.placeholder} className="field resize-y" />
      );

    case "number":
      return wrap(
        <input
          type="number"
          {...register(field.name)}
          min={field.min}
          max={field.max}
          className="field"
        />
      );

    case "boolean":
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: f }) => (
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
              <span className="text-sm text-white/90">{field.label}</span>
              <button
                type="button"
                role="switch"
                aria-checked={!!f.value}
                onClick={() => f.onChange(!f.value)}
                className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
                  f.value ? "bg-gradient-to-r from-indigo-accent to-cyan-accent" : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
                    f.value ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </label>
          )}
        />
      );

    case "color":
      return wrap(
        <Controller
          name={field.name}
          control={control}
          render={({ field: f }) => (
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={f.value || "#4F46E5"}
                onChange={(e) => f.onChange(e.target.value)}
                className="h-11 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1"
                aria-label={`${field.label} picker`}
              />
              <input value={f.value ?? ""} onChange={(e) => f.onChange(e.target.value)} className="field" />
            </div>
          )}
        />
      );

    case "select":
      return wrap(
        <select {...register(field.name)} className="field appearance-none">
          <option value="">— select —</option>
          {(field.options ?? []).map((o) => (
            <option key={o.value} value={o.value} className="bg-card">
              {o.label}
            </option>
          ))}
        </select>
      );

    case "lines":
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: f }) =>
            wrap(
              <textarea
                rows={5}
                dir={dir}
                className="field resize-y"
                placeholder={field.placeholder ?? "One item per line"}
                value={((f.value as string[]) ?? []).join("\n")}
                onChange={(e) => f.onChange(e.target.value.split("\n"))}
                onBlur={() => f.onChange(((f.value as string[]) ?? []).filter((l) => l.trim() !== ""))}
              />
            )
          }
        />
      );

    case "objectList":
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: f }) => {
            const items = (f.value as Record<string, string | number>[]) ?? [];
            const cols = field.columns ?? [];
            const update = (i: number, key: string, value: string | number) => {
              const next = items.map((it, idx) => (idx === i ? { ...it, [key]: value } : it));
              f.onChange(next);
            };
            return wrap(
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {cols.map((c) => (
                      <input
                        key={c.key}
                        type={c.type === "number" ? "number" : "text"}
                        dir={c.type === "number" ? undefined : dir}
                        placeholder={c.label}
                        value={item[c.key] ?? ""}
                        onChange={(e) =>
                          update(i, c.key, c.type === "number" ? Number(e.target.value) : e.target.value)
                        }
                        className={`field ${c.type === "number" ? "max-w-24" : ""}`}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => f.onChange(items.filter((_, idx) => idx !== i))}
                      className="icon-chip mt-1 h-9 w-9 shrink-0 rounded-lg hover:!border-red-400/50 hover:!text-red-400"
                      aria-label="Remove row"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => f.onChange([...items, Object.fromEntries(cols.map((c) => [c.key, c.type === "number" ? 0 : ""]))])}
                  className="btn-ghost inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white"
                >
                  <Plus size={14} /> Add row
                </button>
              </div>
            );
          }}
        />
      );

    case "image":
    case "file":
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: f }) =>
            wrap(
              <div>
                <div className="flex gap-2">
                  <input
                    value={f.value ?? ""}
                    onChange={(e) => f.onChange(e.target.value)}
                    placeholder={field.type === "image" ? "https://… or upload →" : "URL or upload →"}
                    className="field"
                  />
                  <UploadButton
                    accept={field.type === "image" ? "image/*" : "application/pdf,image/*,video/*"}
                    onDone={(url) => f.onChange(url)}
                  />
                </div>
                {field.type === "image" && f.value ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.value}
                    alt="Preview"
                    className="mt-3 h-24 w-24 rounded-xl border border-white/10 object-cover"
                  />
                ) : null}
              </div>
            )
          }
        />
      );

    default:
      return wrap(<input {...register(field.name)} dir={dir} placeholder={field.placeholder} className="field" />);
  }
}
