"use client";

import { useRouter } from "next/navigation";
import type { EntityConfig } from "@/lib/admin-config";
import { saveSingleton } from "@/app/(base)/admin/actions";
import EntityForm, { emptyValues } from "./EntityForm";

export default function SingletonEditor({
  entity,
  initialData,
}: {
  entity: EntityConfig;
  initialData: Record<string, unknown> | null;
}) {
  const router = useRouter();

  return (
    <EntityForm
      fields={entity.fields}
      defaultValues={emptyValues(entity.fields, initialData)}
      autosave
      onSubmit={async (values) => {
        const result = await saveSingleton(entity.table, values);
        if (result.ok) router.refresh();
        return result;
      }}
    />
  );
}
