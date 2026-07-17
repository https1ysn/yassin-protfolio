import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { entityBySlug } from "@/lib/admin-config";
import CollectionManager from "@/components/admin/CollectionManager";
import SingletonEditor from "@/components/admin/SingletonEditor";

export const dynamic = "force-dynamic";

export default async function EntityPage({ params }: { params: Promise<{ entity: string }> }) {
  const { entity: slug } = await params;
  const entity = entityBySlug(slug);
  if (!entity) notFound();

  const db = await supabaseServer();

  if (entity.kind === "singleton") {
    const { data } = await db.from(entity.table).select("*").eq("id", 1).maybeSingle();
    return (
      <div>
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold">{entity.title}</h1>
          <p className="mt-2 text-sm text-muted">{entity.description}</p>
        </header>
        <div className="card-surface rounded-2xl p-6 md:p-8">
          <SingletonEditor entity={entity} initialData={data} />
        </div>
      </div>
    );
  }

  const { data: rows } = await db.from(entity.table).select("*").order("sort_order", { ascending: true });

  let relationRows: Record<string, unknown>[] = [];
  if (entity.relation) {
    const { data } = await db
      .from(entity.relation.table)
      .select("*")
      .order("sort_order", { ascending: true });
    relationRows = data ?? [];
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold">{entity.title}</h1>
        <p className="mt-2 text-sm text-muted">{entity.description}</p>
      </header>
      <CollectionManager entity={entity} initialRows={rows ?? []} relationRows={relationRows} />
    </div>
  );
}
