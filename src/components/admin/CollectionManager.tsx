"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import {
  Archive, ArchiveRestore, CheckSquare, Copy, GripVertical, Pencil, Plus,
  Search, Square, Trash2, X,
} from "lucide-react";
import type { EntityConfig } from "@/lib/admin-config";
import { deleteRows, duplicateRow, reorderRows, restoreRows, saveRow, setRowFlags } from "@/app/(base)/admin/actions";
import EntityForm, { emptyValues } from "./EntityForm";
import ConfirmDialog from "./ConfirmDialog";
import GalleryEditor from "./GalleryEditor";
import { useToast } from "./Toast";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

const PAGE_SIZE = 10;

function cellValue(row: Row, key: string, relationLabels?: Map<string, string>) {
  const v = row[key];
  if (typeof v === "boolean") return v ? "✓" : "—";
  if (key === "category_id" && relationLabels) return relationLabels.get(v) ?? "—";
  const s = String(v ?? "");
  return s.length > 60 ? `${s.slice(0, 57)}…` : s || "—";
}

export default function CollectionManager({
  entity,
  initialRows,
  relationRows = [],
}: {
  entity: EntityConfig;
  initialRows: Row[];
  relationRows?: Row[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Row | null | "new">(null);
  const [confirmIds, setConfirmIds] = useState<string[]>([]);

  const features = entity.features ?? {};

  const relationLabels = useMemo(() => {
    if (!entity.relation) return undefined;
    return new Map<string, string>(
      relationRows.map((r) => [r[entity.relation!.valueKey], r[entity.relation!.labelKey]])
    );
  }, [entity.relation, relationRows]);

  /* inject relation options into the select field */
  const fields = useMemo(() => {
    if (!entity.relation) return entity.fields;
    return entity.fields.map((f) =>
      f.name === entity.relation!.field
        ? {
            ...f,
            options: relationRows.map((r) => ({
              value: r[entity.relation!.valueKey],
              label: r[entity.relation!.labelKey],
            })),
          }
        : f
    );
  }, [entity, relationRows]);

  const filtered = useMemo(() => {
    let list = rows;
    if (features.archive) list = list.filter((r) => !!r.archived === (tab === "archived"));
    if (query.trim()) {
      const q = query.toLowerCase();
      const keys = entity.searchKeys ?? entity.listColumns ?? [];
      list = list.filter((r) => keys.some((k) => String(r[k] ?? "").toLowerCase().includes(q)));
    }
    return list;
  }, [rows, query, entity, features.archive, tab]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const dragDisabled = query.trim() !== "" || tab === "archived";
  const archivedCount = features.archive ? rows.filter((r) => r.archived).length : 0;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const runDelete = async () => {
    const ids = confirmIds;
    setConfirmIds([]);
    const result = await deleteRows(entity.table, ids);
    if (!result.ok) return toast.error(result.error);
    const removed = result.rows;
    setRows((prev) => prev.filter((r) => !ids.includes(r.id)));
    setSelected(new Set());
    router.refresh();
    toast.success(`Deleted ${ids.length > 1 ? `${ids.length} items` : "item"}`, async () => {
      const restore = await restoreRows(entity.table, removed);
      if (restore.ok) {
        setRows((prev) => [...prev, ...removed]);
        router.refresh();
        toast.success("Restored");
      } else toast.error(restore.error);
    });
  };

  const runDuplicate = async (row: Row) => {
    const result = await duplicateRow(entity.table, row.id);
    if (!result.ok) return toast.error(result.error);
    toast.success("Duplicated as draft");
    router.refresh();
    // refresh local list from server data on next render; optimistic append:
    setRows((prev) => [...prev, { ...row, id: `tmp-${Date.now()}`, title: row.title ? `${row.title} (copy)` : row.title, published: false }]);
  };

  const runFlag = async (row: Row, flag: string, value: boolean) => {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, [flag]: value } : r)));
    const result = await setRowFlags(entity.table, row.id, { [flag]: value });
    if (!result.ok) {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, [flag]: !value } : r)));
      return toast.error(result.error);
    }
    toast.success(`${flag[0].toUpperCase()}${flag.slice(1)} ${value ? "on" : "off"}`);
    router.refresh();
  };

  const onReorder = (newPageOrder: Row[]) => {
    const start = page * PAGE_SIZE;
    const next = [...filtered];
    next.splice(start, newPageOrder.length, ...newPageOrder);
    // merge back into the full row set, preserving rows hidden by the current tab
    const hidden = rows.filter((r) => !filtered.includes(r));
    setRows([...next, ...hidden]);
  };

  const persistOrder = async () => {
    if (dragDisabled) return;
    const result = await reorderRows(entity.table, rows.map((r) => r.id));
    if (!result.ok) toast.error(result.error);
  };

  const submitForm = async (values: Record<string, unknown>) => {
    const id = editing !== "new" && editing ? (editing.id as string) : undefined;
    const result = await saveRow(entity.table, values, id);
    if (result.ok) {
      setEditing(null);
      router.refresh();
      if (id) setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...values } : r)));
      else setRows((prev) => [...prev, { id: `tmp-${Date.now()}`, ...values }]);
      toast.success(id ? "Saved" : "Created");
    }
    return result;
  };

  return (
    <div>
      {/* stats + tabs */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder={`Search ${entity.title.toLowerCase()}…`}
            className="field !pl-10"
            aria-label={`Search ${entity.title}`}
          />
        </div>

        {features.archive && (
          <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs font-semibold">
            {(["active", "archived"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t);
                  setPage(0);
                }}
                className={`rounded-full px-3.5 py-1.5 capitalize transition-colors ${
                  tab === t ? "bg-white/10 text-white" : "text-muted hover:text-white"
                }`}
              >
                {t}
                {t === "archived" && archivedCount > 0 ? ` (${archivedCount})` : ""}
              </button>
            ))}
          </div>
        )}

        {selected.size > 0 && (
          <button
            type="button"
            onClick={() => setConfirmIds([...selected])}
            className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-4 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/25"
          >
            <Trash2 size={14} /> Delete {selected.size}
          </button>
        )}
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={15} /> Add
        </button>
      </div>

      {/* list */}
      {pageRows.length === 0 ? (
        <div className="card-surface rounded-2xl px-6 py-14 text-center text-sm text-muted">
          {query.trim()
            ? "No results for this search."
            : tab === "archived"
              ? "Nothing archived."
              : `No ${entity.title.toLowerCase()} yet — add the first one.`}
        </div>
      ) : (
        <Reorder.Group axis="y" values={pageRows} onReorder={onReorder} className="space-y-2">
          {pageRows.map((row) => (
            <Reorder.Item
              key={row.id}
              value={row}
              onDragEnd={persistOrder}
              dragListener={!dragDisabled}
              className="card-surface card-hover flex items-center gap-3 rounded-xl px-4 py-3.5"
            >
              {!dragDisabled && (
                <span className="cursor-grab text-muted/50 active:cursor-grabbing" aria-hidden="true">
                  <GripVertical size={15} />
                </span>
              )}
              <button
                type="button"
                onClick={() => toggle(row.id)}
                className="text-muted transition-colors hover:text-white"
                aria-label={selected.has(row.id) ? "Deselect row" : "Select row"}
              >
                {selected.has(row.id) ? <CheckSquare size={16} className="text-violet-300" /> : <Square size={16} />}
              </button>

              <div className="grid min-w-0 flex-1 gap-x-6 gap-y-0.5 sm:grid-cols-[2fr_1.5fr_1fr]">
                {(entity.listColumns ?? []).map((col, i) => (
                  <span key={col} className={`truncate text-sm ${i === 0 ? "font-medium text-white" : "text-muted"}`}>
                    {cellValue(row, col, relationLabels)}
                  </span>
                ))}
              </div>

              {/* quick toggles */}
              {(features.toggles ?? []).map((flag) => (
                <button
                  key={flag}
                  type="button"
                  onClick={() => runFlag(row, flag, !row[flag])}
                  className={`hidden rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors sm:block ${
                    row[flag]
                      ? "bg-emerald-400/15 text-emerald-300"
                      : "bg-white/[0.05] text-muted hover:text-white"
                  }`}
                  title={`Toggle ${flag}`}
                >
                  {flag}
                </button>
              ))}

              {features.duplicate && (
                <button
                  type="button"
                  onClick={() => runDuplicate(row)}
                  className="icon-chip h-8 w-8 rounded-lg"
                  aria-label="Duplicate"
                  title="Duplicate"
                >
                  <Copy size={13} />
                </button>
              )}
              {features.archive && (
                <button
                  type="button"
                  onClick={() => runFlag(row, "archived", !row.archived)}
                  className="icon-chip h-8 w-8 rounded-lg"
                  aria-label={row.archived ? "Unarchive" : "Archive"}
                  title={row.archived ? "Unarchive" : "Archive"}
                >
                  {row.archived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
                </button>
              )}
              <button
                type="button"
                onClick={() => setEditing(row)}
                className="icon-chip h-8 w-8 rounded-lg"
                aria-label="Edit"
                title="Edit"
              >
                <Pencil size={13} />
              </button>
              <button
                type="button"
                onClick={() => setConfirmIds([row.id])}
                className="icon-chip h-8 w-8 rounded-lg hover:!border-red-400/50 hover:!text-red-400"
                aria-label="Delete"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* pagination */}
      {pageCount > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold transition-colors ${
                i === page ? "bg-white/10 text-white" : "text-muted hover:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-muted/60">
        {dragDisabled
          ? "Drag-reorder is available in the Active tab without a search filter."
          : "Drag rows to reorder — the site updates instantly."}
      </p>

      {/* slide-over editor */}
      <AnimatePresence>
        {editing !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex justify-end bg-black/55 backdrop-blur-sm"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 60, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full max-w-lg overflow-y-auto border-l border-white/10 bg-surface p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={editing === "new" ? `Add ${entity.title}` : `Edit ${entity.title}`}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">
                  {editing === "new" ? `Add ${entity.title}` : `Edit ${entity.title}`}
                </h2>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="icon-chip h-9 w-9 rounded-full"
                  aria-label="Close editor"
                >
                  <X size={16} />
                </button>
              </div>
              <EntityForm
                fields={fields}
                defaultValues={emptyValues(fields, editing === "new" ? null : editing)}
                onSubmit={submitForm}
                submitLabel={editing === "new" ? "Create" : "Save changes"}
                slugFrom={entity.slugFrom}
              />
              {features.gallery && editing !== "new" && editing && !String(editing.id).startsWith("tmp-") && (
                <GalleryEditor
                  projectId={editing.id}
                  coverUrl={editing.cover_image_url ?? ""}
                  onCoverChange={(url) => {
                    setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...r, cover_image_url: url } : r)));
                    setEditing((e) => (e && e !== "new" ? { ...e, cover_image_url: url } : e));
                    router.refresh();
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmIds.length > 0}
        title={`Delete ${confirmIds.length > 1 ? `${confirmIds.length} items` : "this item"}?`}
        message="This removes the content from your website. You can undo from the notification right after."
        onConfirm={runDelete}
        onCancel={() => setConfirmIds([])}
      />
    </div>
  );
}
