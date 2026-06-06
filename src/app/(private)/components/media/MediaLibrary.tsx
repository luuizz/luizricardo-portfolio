"use client";

import { useState, useRef, useTransition, useCallback } from "react";
import { MediaItem } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DeleteConfirmDialog } from "@/app/(private)/components/ui/DeleteConfigmDialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  Trash2,
  Copy,
  Check,
  Search,
  ImageIcon,
  VideoIcon,
  FileIcon,
  ExternalLink,
  Tag,
  Info,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { cn } from "@/lib/utils";

const BUCKET = "media";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getPublicUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

function MediaThumb({ item, selected }: { item: MediaItem; selected: boolean }) {
  const url = getPublicUrl(item.path);
  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-md border-2 bg-muted transition-all",
        selected ? "border-primary ring-2 ring-primary/30" : "border-transparent",
      )}
    >
      {item.mime_type.startsWith("image/") ? (
        <img src={url} alt={item.alt_text ?? item.name} className="h-full w-full object-cover" />
      ) : item.mime_type.startsWith("video/") ? (
        <div className="flex h-full items-center justify-center">
          <VideoIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <FileIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}

      {/* Selection checkbox */}
      <div
        className={cn(
          "absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded border-2 bg-background transition-all",
          selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/50",
        )}
      >
        {selected && <Check className="h-3 w-3" />}
      </div>
    </div>
  );
}

interface MediaLibraryProps {
  initialItems: MediaItem[];
}

export default function MediaLibrary({ initialItems }: MediaLibraryProps) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [search, setSearch] = useState("");
  const [multiSelect, setMultiSelect] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | "multi" | null>(null);

  // Upload state
  const [uploadQueue, setUploadQueue] = useState<{ file: File; preview: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // Sidebar edit state
  const [altText, setAltText] = useState("");
  const [titleText, setTitleText] = useState("");
  const [caption, setCaption] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const [, startTransition] = useTransition();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Filtering
  const filtered = items.filter((item) =>
    search === "" ||
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (item.tags ?? []).some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  // Selection
  function selectItem(item: MediaItem) {
    setSelected(item);
    setAltText(item.alt_text ?? "");
    setTitleText(item.title ?? "");
    setCaption(item.caption ?? "");
    setTagsInput((item.tags ?? []).join(", "));
  }

  function toggleMultiSelect(id: string) {
    setMultiSelect((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleItemClick(e: React.MouseEvent, item: MediaItem) {
    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      toggleMultiSelect(item.id);
    } else {
      setMultiSelect(new Set());
      selectItem(item);
    }
  }

  // Upload
  function addFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    const previews = arr.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    setUploadQueue((prev) => [...prev, ...previews]);
    setShowUpload(true);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  }

  async function handleUpload() {
    if (uploadQueue.length === 0) return;
    setUploading(true);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      toast.error("Sessão expirada. Faça login novamente.");
      setUploading(false);
      return;
    }

    const uploaded: MediaItem[] = [];
    const failedNames: string[] = [];

    for (const { file } of uploadQueue) {
      try {
        const ext = file.name.split(".").pop() ?? "bin";
        const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(uniqueName, file, { upsert: false });

        if (uploadError) {
          console.error(`[upload] ${file.name}:`, uploadError.message);
          failedNames.push(file.name);
          continue;
        }

        const { data: record, error: dbError } = await supabase
          .from("media")
          .insert({
            name: file.name,
            path: uniqueName,
            bucket: BUCKET,
            mime_type: file.type,
            size: file.size,
            uploaded_by: user.id,
          })
          .select()
          .single();

        if (dbError) {
          console.error(`[db insert] ${file.name}:`, dbError.message);
          // Remove from storage if DB insert failed
          await supabase.storage.from(BUCKET).remove([uniqueName]);
          failedNames.push(file.name);
          continue;
        }

        if (record) uploaded.push(record as MediaItem);
      } catch (err) {
        console.error(`[upload unknown] ${file.name}:`, err);
        failedNames.push(file.name);
      }
    }

    setUploadQueue((prev) => {
      prev.forEach(({ preview }) => URL.revokeObjectURL(preview));
      return [];
    });
    setUploading(false);
    setShowUpload(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (uploaded.length > 0) {
      setItems((prev) => [...uploaded, ...prev]);
      toast.success(`${uploaded.length} arquivo(s) enviado(s) com sucesso!`);
    }
    if (failedNames.length > 0) {
      toast.error(
        `${failedNames.length} arquivo(s) falharam. Verifique o console para detalhes.`,
        { description: failedNames.slice(0, 3).join(", ") + (failedNames.length > 3 ? "..." : "") },
      );
    }
  }

  // Save metadata
  async function saveMeta() {
    if (!selected) return;
    setSavingMeta(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await supabase
        .from("media")
        .update({ alt_text: altText || null, title: titleText || null, caption: caption || null, tags: tags.length ? tags : null })
        .eq("id", selected.id);

      setItems((prev) =>
        prev.map((i) =>
          i.id === selected.id
            ? { ...i, alt_text: altText || null, title: titleText || null, caption: caption || null, tags: tags.length ? tags : null }
            : i,
        ),
      );
      setSelected((prev) =>
        prev ? { ...prev, alt_text: altText || null, title: titleText || null, caption: caption || null, tags: tags.length ? tags : null } : null,
      );
      toast.success("Metadados salvos!");
    } catch {
      toast.error("Erro ao salvar metadados.");
    } finally {
      setSavingMeta(false);
    }
  }

  // Copy URL
  async function copyUrl(item: MediaItem) {
    await navigator.clipboard.writeText(getPublicUrl(item.path));
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
    toast.success("URL copiada!");
  }

  // Delete
  function confirmDelete() {
    if (deleteTarget === "multi") {
      startTransition(async () => {
        const ids = Array.from(multiSelect);
        const toDelete = items.filter((i) => ids.includes(i.id));

        for (const item of toDelete) {
          await supabase.storage.from(BUCKET).remove([item.path]);
          await supabase.from("media").update({ deleted_at: new Date().toISOString() }).eq("id", item.id);
        }

        setItems((prev) => prev.filter((i) => !ids.includes(i.id)));
        if (selected && ids.includes(selected.id)) setSelected(null);
        setMultiSelect(new Set());
        toast.success(`${ids.length} arquivo(s) excluído(s).`);
        setDeleteTarget(null);
      });
    } else if (deleteTarget) {
      startTransition(async () => {
        try {
          await supabase.storage.from(BUCKET).remove([deleteTarget.path]);
          await supabase.from("media").update({ deleted_at: new Date().toISOString() }).eq("id", deleteTarget.id);
          setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
          if (selected?.id === deleteTarget.id) setSelected(null);
          toast.success("Arquivo excluído.");
        } catch {
          toast.error("Erro ao excluir.");
        } finally {
          setDeleteTarget(null);
        }
      });
    }
  }

  const deleteTargetName =
    deleteTarget === "multi"
      ? `${multiSelect.size} arquivos selecionados`
      : deleteTarget?.name;

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, título ou tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {multiSelect.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteTarget("multi")}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir {multiSelect.size} selecionado(s)
          </Button>
        )}

        <Button size="sm" onClick={() => setShowUpload((v) => !v)}>
          <Upload className="mr-2 h-4 w-4" />
          Enviar arquivos
        </Button>
      </div>

      {/* Upload panel */}
      {showUpload && (
        <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
          <div
            ref={dropRef}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center transition-colors hover:border-primary/50 hover:bg-background/50"
          >
            <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium">Clique ou arraste arquivos aqui</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP, SVG, MP4 — até 50 MB</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
          </div>

          {uploadQueue.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {uploadQueue.map(({ file, preview }, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded border bg-muted">
                    <button
                      type="button"
                      onClick={() =>
                        setUploadQueue((prev) => {
                          URL.revokeObjectURL(prev[i].preview);
                          return prev.filter((_, idx) => idx !== i);
                        })
                      }
                      className="absolute right-1 top-1 z-10 rounded-full bg-destructive p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {file.type.startsWith("image/") ? (
                      <img src={preview} alt={file.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpload} disabled={uploading} size="sm">
                  {uploading ? "Enviando..." : `Enviar ${uploadQueue.length} arquivo(s)`}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    uploadQueue.forEach(({ preview }) => URL.revokeObjectURL(preview));
                    setUploadQueue([]);
                  }}
                >
                  Limpar
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Main content: grid + sidebar */}
      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-[1fr_280px]">
        {/* Grid */}
        <div>
          {filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed text-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">
                {search ? "Nenhum arquivo encontrado." : "Nenhuma mídia ainda."}
              </p>
              {!search && (
                <Button size="sm" variant="outline" onClick={() => setShowUpload(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Enviar primeiro arquivo
                </Button>
              )}
            </div>
          ) : (
            <>
              <p className="mb-3 text-xs text-muted-foreground">
                {filtered.length} arquivo(s)
                {multiSelect.size > 0 && ` · ${multiSelect.size} selecionado(s)`}
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={(e) => handleItemClick(e, item)}
                    className={cn(
                      "group relative text-left transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary rounded-md",
                      selected?.id === item.id && multiSelect.size === 0 && "scale-[1.02]",
                    )}
                    title={item.name}
                  >
                    <MediaThumb item={item} selected={multiSelect.has(item.id) || selected?.id === item.id} />
                    <p className="mt-1 truncate px-0.5 text-xs text-muted-foreground">{item.name}</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar detail panel */}
        <aside className="space-y-4">
          {selected ? (
            <>
              {/* Preview */}
              <div className="overflow-hidden rounded-lg border bg-muted/30">
                {selected.mime_type.startsWith("image/") ? (
                  <img
                    src={getPublicUrl(selected.path)}
                    alt={selected.alt_text ?? selected.name}
                    className="h-48 w-full object-contain p-2"
                  />
                ) : selected.mime_type.startsWith("video/") ? (
                  <video src={getPublicUrl(selected.path)} controls className="h-48 w-full object-contain" />
                ) : (
                  <div className="flex h-48 items-center justify-center">
                    <FileIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* File info */}
              <div className="rounded-lg border bg-card p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Info className="h-3.5 w-3.5" /> Arquivo
                </div>
                <p className="break-all text-sm font-medium">{selected.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-xs">{selected.mime_type}</Badge>
                  <Badge variant="outline" className="text-xs">{formatBytes(selected.size)}</Badge>
                  {selected.width && selected.height && (
                    <Badge variant="outline" className="text-xs">{selected.width}×{selected.height}</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(selected.uploaded_at).toLocaleDateString("pt-BR", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => copyUrl(selected)}
                >
                  {copiedUrl ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                  {copiedUrl ? "Copiado!" : "Copiar URL"}
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={getPublicUrl(selected.path)} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(selected)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <Separator />

              {/* Metadata editor */}
              <div className="rounded-lg border bg-card p-3 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" /> Metadados
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Texto alternativo (alt)</Label>
                  <Input
                    placeholder="Descreva a imagem para acessibilidade..."
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Título</Label>
                  <Input
                    placeholder="Título do arquivo"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Legenda / Caption</Label>
                  <Textarea
                    placeholder="Legenda exibida abaixo da imagem..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="min-h-[60px] resize-none text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Tags (separadas por vírgula)</Label>
                  <Input
                    placeholder="portfolio, web, design..."
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="h-8 text-sm"
                  />
                  {tagsInput && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {tagsInput.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button size="sm" className="w-full" onClick={saveMeta} disabled={savingMeta}>
                  {savingMeta ? "Salvando..." : "Salvar metadados"}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center p-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Clique em um arquivo para ver os detalhes e editar metadados.
              </p>
              <p className="text-xs text-muted-foreground">
                Use Shift ou Ctrl+clique para selecionar múltiplos arquivos.
              </p>
            </div>
          )}
        </aside>
      </div>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        itemName={deleteTargetName}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
