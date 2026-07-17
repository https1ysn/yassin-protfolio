import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";
import { entities } from "@/lib/admin-config";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const db = await supabaseServer();
  const collections = entities.filter((e) => e.kind === "collection");

  const counts = await Promise.all(
    collections.map(async (e) => {
      const { count } = await db.from(e.table).select("*", { count: "exact", head: true });
      return { entity: e, count: count ?? 0 };
    })
  );

  const seeded = await db.from("profile").select("id").eq("id", 1).maybeSingle();
  const activity = await db
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">Everything on your website is managed from here.</p>

      {!seeded.data && (
        <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-relaxed text-amber-200">
          <strong>Your database is empty.</strong>
          <p className="mt-1 text-amber-200/80">
            Run <code>npm run seed</code> locally to import all the current portfolio content, or start
            filling in the sections manually. Until then, the public site shows the built-in content.
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {counts.map(({ entity, count }) => (
          <Link
            key={entity.slug}
            href={`/admin/${entity.slug}`}
            className="card-surface card-hover group rounded-2xl p-5"
          >
            <div className="flex items-start justify-between">
              <p className="font-display text-3xl font-bold gradient-text">{count}</p>
              <ArrowUpRight
                size={16}
                className="text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
              />
            </div>
            <p className="mt-2 text-sm font-semibold">{entity.title}</p>
            <p className="mt-1 line-clamp-1 text-xs text-muted">{entity.description}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 font-display text-lg font-semibold">Site configuration</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entities
          .filter((e) => e.kind === "singleton")
          .map((e) => (
            <Link key={e.slug} href={`/admin/${e.slug}`} className="card-surface card-hover group rounded-2xl p-5">
              <p className="text-sm font-semibold">{e.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted">{e.description}</p>
            </Link>
          ))}
      </div>

      {(activity.data?.length ?? 0) > 0 && (
        <>
          <h2 className="mt-10 font-display text-lg font-semibold">Recent activity</h2>
          <div className="card-surface mt-4 divide-y divide-white/[0.06] rounded-2xl">
            {activity.data!.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    a.action === "deleted" ? "bg-red-400" : a.action === "created" ? "bg-emerald-400" : "bg-cyan-accent"
                  }`}
                />
                <span className="text-white/85 capitalize">{a.action}</span>
                <span className="text-muted">{a.table_name.replace(/_/g, " ")}</span>
                {a.item_label && <span className="truncate text-muted/70">— {a.item_label}</span>}
                <span className="ml-auto shrink-0 text-xs text-muted/60">
                  {new Date(a.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
