"use client";

import { useState, useTransition } from "react";
import { MediaItem } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/app/(private)/components/ui/DeleteConfigmDialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Copy,
  Trash2,
  Eye,
  ImageIcon,
  VideoIcon,
  FileIcon,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const BUCKET = "media";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getPublicUrl(path: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${url}/storage/v1/object/public/${BUCKET}/${path}`;
}

function MediaThumb({ item }: { item: MediaItem }) {
  const url = getPublicUrl(item.path);
  if (item.mime_type.startsWith("image/")) {
    return (
      <img
        src={url}
        alt={item.name}
        className="h-40 w-full rounded-t-lg object-cover"
      />
    );
  }
  if (item.mime_type.startsWith("video/")) {
    return (
      <div className="flex h-40 items-center justify-center rounded-t-lg bg-muted">
        <VideoIcon className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className="flex h-40 items-center justify-center rounded-t-lg bg-muted">
      <FileIcon className="h-12 w-12 text-muted-foreground" />
    </div>
  );
}

interface MediaGalleryProps {
  items: MediaItem[];
}

export default function MediaGallery({ items }: MediaGalleryProps) {
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  function copyUrl(item: MediaItem) {
    navigator.clipboard.writeText(getPublicUrl(item.path));
    toast.success("URL copiada!");
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await supabase.storage.from(BUCKET).remove([deleteTarget.path]);
        await supabase
          .from("media")
          .update({ deleted_at: new Date().toISOString() })
          .eq("id", deleteTarget.id);

        toast.success("Arquivo excluído.");
        router.refresh();
      } catch {
        toast.error("Erro ao excluir arquivo.");
      } finally {
        setDeleteTarget(null);
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed text-center">
        <ImageIcon className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">Nenhuma mídia encontrada.</p>
        <p className="text-sm text-muted-foreground">
          Use o formulário acima para enviar imagens e vídeos.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative">
              <MediaThumb item={item} />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => setPreview(item)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => copyUrl(item)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => setDeleteTarget(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-2">
              <p className="truncate text-xs font-medium" title={item.name}>
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground">{formatBytes(item.size)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate">{preview?.name}</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="space-y-4">
              {preview.mime_type.startsWith("image/") ? (
                <img
                  src={getPublicUrl(preview.path)}
                  alt={preview.name}
                  className="max-h-[60vh] w-full rounded-lg object-contain"
                />
              ) : preview.mime_type.startsWith("video/") ? (
                <video
                  src={getPublicUrl(preview.path)}
                  controls
                  className="w-full rounded-lg"
                />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg bg-muted">
                  <FileIcon className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{preview.mime_type}</Badge>
                <Badge variant="outline">{formatBytes(preview.size)}</Badge>
                {preview.width && preview.height && (
                  <Badge variant="outline">
                    {preview.width}×{preview.height}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyUrl(preview)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar URL
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  asChild
                >
                  <a href={getPublicUrl(preview.path)} target="_blank" rel="noopener noreferrer">
                    Abrir no navegador
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        itemName={deleteTarget?.name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
