"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Check, ChevronRight, Copy, FileText, Film, Folder, FolderPlus, Home,
  Loader2, Pencil, RefreshCw, Search, Trash2, Upload,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";

type Entry = {
  name: string;
  id: string | null; // null = folder
  updated_at: string | null;
  metadata: { size?: number; mimetype?: string } | null;
};

const isImage = (f: Entry) =>
  f.metadata?.mimetype?.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(f.name);
const isVideo = (f: Entry) =>
  f.metadata?.mimetype?.startsWith("video/") || /\.(mp4|webm|mov|m4v)$/i.test(f.name);

const formatSize = (bytes?: number) =>
  !bytes ? "" : bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;

export default function MediaLibrary() {
  const db = supabaseBrowser();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [folder, setFolder] = useState(""); // "" = root
  const [virtualFolders, setVirtualFolders] = useState<string[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const fullPath = (name: string) => (folder ? `${folder}/${name}` : name);
  const publicUrl = useCallback(
    (name: string) => db.storage.from("media").getPublicUrl(folder ? `${folder}/${name}` : name).data.publicUrl,
    [db, folder]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await db.storage
      .from("media")
      .list(folder, { limit: 400, sortBy: { column: "created_at", order: "desc" } });
    if (error) toast.error(error.message);
    setEntries((data as Entry[]) ?? []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, folder]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const folders = useMemo(() => {
    const real = entries.filter((e) => e.id === null).map((e) => e.name);
    const virtual = folder === "" ? virtualFolders.filter((v) => !real.includes(v)) : [];
    return [...real, ...virtual].sort();
  }, [entries, virtualFolders, folder]);

  const files = useMemo(() => {
    let list = entries.filter((e) => e.id !== null && !e.name.startsWith("."));
    if (query.trim()) list = list.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [entries, query]);

  const uploadFiles = async (list: FileList | File[] | null, replaceName?: string) => {
    if (!list || list.length === 0) return;
    setBusy(true);
    let okCount = 0;
    for (const file of Array.from(list)) {
      const safe = replaceName ?? `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const { error } = await db.storage
        .from("media")
        .upload(fullPath(safe), file, { upsert: !!replaceName });
      if (error) toast.error(`${file.name}: ${error.message}`);
      else okCount++;
    }
    setBusy(false);
    if (okCount > 0) toast.success(replaceName ? "File replaced" : `Uploaded ${okCount} file${okCount > 1 ? "s" : ""}`);
    refresh();
  };

  const replaceFile = (entry: Entry) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,application/pdf,video/*";
    input.onchange = () => uploadFiles(input.files, entry.name);
    input.click();
  };

  const rename = async (entry: Entry) => {
    const next = window.prompt("New file name (keep the extension):", entry.name);
    if (!next || next === entry.name) return;
    const safe = next.replace(/[^a-zA-Z0-9._-]/g, "-");
    const { error } = await db.storage.from("media").move(fullPath(entry.name), fullPath(safe));
    if (error) toast.error(error.message);
    else toast.success("Renamed");
    refresh();
  };

  const remove = async () => {
    if (!deleting) return;
    const { error } = await db.storage.from("media").remove([fullPath(deleting)]);
    if (error) toast.error(error.message);
    else toast.success("File deleted");
    setDeleting(null);
    refresh();
  };

  const copy = async (name: string) => {
    await navigator.clipboard.writeText(publicUrl(name));
    setCopied(name);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopied(null), 1600);
  };

  const newFolder = () => {
    const name = window.prompt("Folder name (letters, numbers, dashes):");
    if (!name) return;
    const safe = name.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
    setVirtualFolders((prev) => [...new Set([...prev, safe])]);
    setFolder(safe);
    toast.success(`Folder "${safe}" — upload a file to make it permanent`);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        uploadFiles(e.dataTransfer.files);
      }}
    >
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Media Library</h1>
          <p className="mt-2 text-sm text-muted">
            Images, PDFs, and videos in Supabase Storage. Drag files anywhere on this page to upload.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={newFolder}
            className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white"
          >
            <FolderPlus size={15} /> New folder
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            Upload
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,application/pdf,video/*"
          className="hidden"
          onChange={(e) => uploadFiles(e.target.files)}
        />
      </header>

      {/* breadcrumb + search */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <nav className="flex items-center gap-1 text-sm" aria-label="Folder path">
          <button
            type="button"
            onClick={() => setFolder("")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors ${
              folder === "" ? "bg-white/[0.07] text-white" : "text-muted hover:text-white"
            }`}
          >
            <Home size={13} /> media
          </button>
          {folder && (
            <>
              <ChevronRight size={13} className="text-muted/50" />
              <span className="rounded-lg bg-white/[0.07] px-2.5 py-1.5 text-white">{folder}</span>
            </>
          )}
        </nav>
        <div className="relative min-w-48 flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files…"
            className="field !py-2.5 !pl-10"
            aria-label="Search files"
          />
        </div>
      </div>

      {/* drop overlay */}
      {dragOver && (
        <div className="pointer-events-none fixed inset-0 z-[94] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="gradient-border glow-indigo rounded-3xl px-10 py-8 text-center">
            <Upload size={28} className="mx-auto text-violet-300" />
            <p className="mt-3 font-display text-lg font-semibold">Drop to upload</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20 text-muted">
          <Loader2 size={22} className="animate-spin" />
        </div>
      ) : (
        <>
          {/* folders */}
          {folder === "" && folders.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {folders.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFolder(f)}
                  className="card-surface card-hover inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm"
                >
                  <Folder size={15} className="text-cyan-accent" /> {f}
                </button>
              ))}
            </div>
          )}

          {files.length === 0 ? (
            <div className="card-surface rounded-2xl px-6 py-16 text-center text-sm text-muted">
              {query ? "No files match this search." : "No files here yet — drop some in or hit Upload."}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {files.map((file, i) => (
                <motion.div
                  key={file.name}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.35 }}
                  className="card-surface card-hover overflow-hidden rounded-2xl"
                >
                  <a href={publicUrl(file.name)} target="_blank" rel="noreferrer" aria-label={`Preview ${file.name}`}>
                    {isImage(file) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={publicUrl(file.name)} alt={file.name} loading="lazy" className="h-36 w-full object-cover" />
                    ) : isVideo(file) ? (
                      <div className="relative h-36 w-full bg-black/40">
                        <video src={publicUrl(file.name)} className="h-full w-full object-cover" muted preload="metadata" />
                        <Film size={22} className="absolute bottom-2 right-2 text-white/80" />
                      </div>
                    ) : (
                      <div className="flex h-36 items-center justify-center bg-white/[0.02] text-muted">
                        <FileText size={32} />
                      </div>
                    )}
                  </a>
                  <div className="p-3.5">
                    <p className="truncate text-xs font-medium" title={file.name}>
                      {file.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">{formatSize(file.metadata?.size)}</p>
                    <div className="mt-3 flex gap-1.5">
                      <button type="button" onClick={() => copy(file.name)} className="icon-chip h-8 w-8 rounded-lg" aria-label="Copy URL" title="Copy URL">
                        {copied === file.name ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                      <button type="button" onClick={() => rename(file)} className="icon-chip h-8 w-8 rounded-lg" aria-label="Rename" title="Rename">
                        <Pencil size={13} />
                      </button>
                      <button type="button" onClick={() => replaceFile(file)} className="icon-chip h-8 w-8 rounded-lg" aria-label="Replace file" title="Replace">
                        <RefreshCw size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(file.name)}
                        className="icon-chip h-8 w-8 rounded-lg hover:!border-red-400/50 hover:!text-red-400"
                        aria-label="Delete"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete this file?"
        message="Anything on the website using this file will show a broken link. This cannot be undone."
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
