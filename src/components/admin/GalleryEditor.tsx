"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Reorder } from "framer-motion";
import { GripVertical, ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { uploadToMedia } from "./upload";
import { useToast } from "./Toast";

type Img = { id: string; url: string; alt: string; sort_order: number };

/** Gallery manager for one project: upload, drag-sort, set cover, delete. */
export default function GalleryEditor({
  projectId,
  coverUrl,
  onCoverChange,
}: {
  projectId: string;
  coverUrl: string;
  onCoverChange: (url: string) => void;
}) {
  const db = supabaseBrowser();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<Img[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await db
      .from("project_images")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });
    setImages((data as Img[]) ?? []);
  }, [db, projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadToMedia(file);
        const { error } = await db
          .from("project_images")
          .insert({ project_id: projectId, url, alt: file.name, sort_order: images.length });
        if (error) throw new Error(error.message);
      }
      toast.success(`${files.length} image${files.length > 1 ? "s" : ""} added to gallery`);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (img: Img) => {
    const { error } = await db.from("project_images").delete().eq("id", img.id);
    if (error) return toast.error(error.message);
    setImages((prev) => prev.filter((i) => i.id !== img.id));
    toast.success("Image removed");
  };

  const persistOrder = async (list: Img[]) => {
    await Promise.all(list.map((img, i) => db.from("project_images").update({ sort_order: i }).eq("id", img.id)));
  };

  const setCover = async (img: Img) => {
    const { error } = await db.from("projects").update({ cover_image_url: img.url }).eq("id", projectId);
    if (error) return toast.error(error.message);
    onCoverChange(img.url);
    toast.success("Cover image updated");
  };

  return (
    <section className="mt-8 border-t border-white/10 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold">Gallery</h3>
          <p className="mt-1 text-xs text-muted">Drag to reorder · star an image to make it the cover.</p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          {busy ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
          Add images
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
      </div>

      {images.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/15 px-4 py-8 text-center text-xs text-muted">
          No gallery images yet.
        </p>
      ) : (
        <Reorder.Group
          axis="y"
          values={images}
          onReorder={(list) => {
            setImages(list);
          }}
          className="space-y-2"
        >
          {images.map((img) => (
            <Reorder.Item
              key={img.id}
              value={img}
              onDragEnd={() => persistOrder(images)}
              className="card-surface flex items-center gap-3 rounded-xl p-2.5"
            >
              <span className="cursor-grab text-muted/50 active:cursor-grabbing">
                <GripVertical size={14} />
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} className="h-12 w-16 rounded-lg border border-white/10 object-cover" />
              <span className="min-w-0 flex-1 truncate text-xs text-muted">{img.alt || img.url}</span>
              <button
                type="button"
                onClick={() => setCover(img)}
                className={`icon-chip h-8 w-8 rounded-lg ${coverUrl === img.url ? "!border-amber-400/60 !text-amber-400" : ""}`}
                aria-label={coverUrl === img.url ? "Current cover image" : "Set as cover image"}
                title={coverUrl === img.url ? "Current cover" : "Set as cover"}
              >
                <Star size={13} fill={coverUrl === img.url ? "currentColor" : "none"} />
              </button>
              <button
                type="button"
                onClick={() => remove(img)}
                className="icon-chip h-8 w-8 rounded-lg hover:!border-red-400/50 hover:!text-red-400"
                aria-label="Remove image"
              >
                <Trash2 size={13} />
              </button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </section>
  );
}
