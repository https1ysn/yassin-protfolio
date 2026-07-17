"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { buildSchema, entities, writableTables } from "@/lib/admin-config";

type ActionResult = { ok: true } | { ok: false; error: string };
export type DeleteResult = { ok: true; rows: Record<string, unknown>[] } | { ok: false; error: string };

async function requireAdmin() {
  const db = await supabaseServer();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return db;
}

function assertTable(table: string) {
  if (!writableTables.has(table)) throw new Error(`Unknown table: ${table}`);
}

/** Validates values against the entity's field config; strips unknown keys. */
function validate(table: string, values: Record<string, unknown>) {
  const entity = entities.find((e) => e.table === table);
  if (!entity) return values; // project_images — constrained by its own actions
  const parsed = buildSchema(entity.fields).safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
  }
  return parsed.data;
}

const fail = (e: unknown) => ({
  ok: false as const,
  error: e instanceof Error ? e.message : "Something went wrong",
});

/** Best-effort activity trail shown on the dashboard. Never blocks the action. */
async function log(db: Awaited<ReturnType<typeof supabaseServer>>, action: string, table: string, label = "") {
  try {
    await db.from("activity_log").insert({ action, table_name: table, item_label: String(label).slice(0, 120) });
  } catch {
    /* table may not exist before migration-002 — logging is optional */
  }
}

/** Human-readable label for a row, best effort. */
const labelOf = (row: Record<string, unknown>) =>
  String(row.title ?? row.name ?? row.role ?? row.author ?? row.platform ?? "");

/** Upsert the single row (id = 1) of a singleton table. */
export async function saveSingleton(table: string, values: Record<string, unknown>): Promise<ActionResult> {
  try {
    assertTable(table);
    const db = await requireAdmin();
    const data = validate(table, values);
    const { error } = await db.from(table).upsert({ id: 1, ...data, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    await log(db, "updated", table);
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** Insert (no id) or update (with id) one row of a collection table. */
export async function saveRow(
  table: string,
  values: Record<string, unknown>,
  id?: string
): Promise<ActionResult> {
  try {
    assertTable(table);
    const db = await requireAdmin();
    const data = validate(table, values);
    if (id) {
      const { error } = await db.from(table).update(data).eq("id", id);
      if (error) throw new Error(error.message);
      await log(db, "updated", table, labelOf(data));
    } else {
      const { count } = await db.from(table).select("*", { count: "exact", head: true });
      const { error } = await db.from(table).insert({ ...data, sort_order: count ?? 0 });
      if (error) throw new Error(error.message);
      await log(db, "created", table, labelOf(data));
    }
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** Delete rows and return them so the client can offer Undo. */
export async function deleteRows(table: string, ids: string[]): Promise<DeleteResult> {
  try {
    assertTable(table);
    if (ids.length === 0) return { ok: true, rows: [] };
    const db = await requireAdmin();
    const { data: rows, error: readError } = await db.from(table).select("*").in("id", ids);
    if (readError) throw new Error(readError.message);
    const { error } = await db.from(table).delete().in("id", ids);
    if (error) throw new Error(error.message);
    await log(db, "deleted", table, rows?.map(labelOf).filter(Boolean).join(", "));
    revalidatePath("/");
    return { ok: true, rows: rows ?? [] };
  } catch (e) {
    return fail(e);
  }
}

/** Undo for deleteRows: reinsert the exact rows that were removed. */
export async function restoreRows(table: string, rows: Record<string, unknown>[]): Promise<ActionResult> {
  try {
    assertTable(table);
    if (rows.length === 0) return { ok: true };
    const db = await requireAdmin();
    const { error } = await db.from(table).insert(rows);
    if (error) throw new Error(error.message);
    await log(db, "restored", table, rows.map(labelOf).filter(Boolean).join(", "));
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** Duplicate a row (appended at the end, drafts where possible). */
export async function duplicateRow(table: string, id: string): Promise<ActionResult> {
  try {
    assertTable(table);
    const db = await requireAdmin();
    const { data: row, error: readError } = await db.from(table).select("*").eq("id", id).single();
    if (readError) throw new Error(readError.message);

    const copy: Record<string, unknown> = { ...row };
    delete copy.id;
    delete copy.created_at;
    const { count } = await db.from(table).select("*", { count: "exact", head: true });
    copy.sort_order = count ?? 0;
    if (typeof copy.title === "string") copy.title = `${copy.title} (copy)`;
    if (typeof copy.slug === "string") copy.slug = `${copy.slug}-copy-${Date.now().toString(36)}`;
    if ("published" in copy) copy.published = false; // duplicates start as drafts

    const { error } = await db.from(table).insert(copy);
    if (error) throw new Error(error.message);
    await log(db, "duplicated", table, labelOf(copy));
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

const FLAG_COLUMNS = new Set(["archived", "published", "enabled", "featured"]);

/** Quick boolean toggles (publish, archive, enable, feature) from the list view. */
export async function setRowFlags(
  table: string,
  id: string,
  flags: Record<string, boolean>
): Promise<ActionResult> {
  try {
    assertTable(table);
    const entries = Object.entries(flags).filter(([k, v]) => FLAG_COLUMNS.has(k) && typeof v === "boolean");
    if (entries.length === 0) throw new Error("No valid flags");
    const db = await requireAdmin();
    const { error } = await db.from(table).update(Object.fromEntries(entries)).eq("id", id);
    if (error) throw new Error(error.message);
    await log(db, "updated", table, entries.map(([k, v]) => `${k}=${v}`).join(", "));
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** Persist a new drag-and-drop order. */
export async function reorderRows(table: string, orderedIds: string[]): Promise<ActionResult> {
  try {
    assertTable(table);
    const db = await requireAdmin();
    const results = await Promise.all(
      orderedIds.map((id, index) => db.from(table).update({ sort_order: index }).eq("id", id))
    );
    const firstError = results.find((r) => r.error)?.error;
    if (firstError) throw new Error(firstError.message);
    await log(db, "reordered", table);
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function signOut(): Promise<ActionResult> {
  try {
    const db = await supabaseServer();
    await db.auth.signOut();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
