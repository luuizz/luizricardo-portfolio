"use client";

import { useState, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, X, ImageIcon } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

const BUCKET = "media";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface SelectedFile {
  file: File;
  preview: string;
}

export default function MediaUploader() {
  const [selected, setSelected] = useState<SelectedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const previews = files.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setSelected((prev) => [...prev, ...previews]);
  }

  function removeFile(index: number) {
    setSelected((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleUpload() {
    if (selected.length === 0) return;
    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let successCount = 0;
    let errorCount = 0;

    for (const { file } of selected) {
      try {
        const ext = file.name.split(".").pop();
        const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const path = uniqueName;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { upsert: false });

        if (uploadError) throw uploadError;

        await supabase.from("media").insert({
          name: file.name,
          path,
          bucket: BUCKET,
          mime_type: file.type,
          size: file.size,
          uploaded_by: user?.id ?? null,
        });

        successCount++;
      } catch {
        errorCount++;
      }
    }

    setUploading(false);
    setSelected([]);
    if (inputRef.current) inputRef.current.value = "";

    if (successCount > 0) {
      toast.success(`${successCount} arquivo(s) enviado(s) com sucesso!`);
      router.refresh();
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} arquivo(s) falharam ao enviar.`);
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/30"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
        <p className="font-medium">Clique para selecionar arquivos</p>
        <p className="text-sm text-muted-foreground">
          PNG, JPG, WEBP, GIF, SVG, MP4 — até 50 MB cada
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {selected.length > 0 && (
        <div className="space-y-3">
          <Label>Arquivos selecionados ({selected.length})</Label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {selected.map(({ file, preview }, i) => (
              <div key={i} className="group relative rounded-lg border bg-muted/20 p-2">
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute right-1 top-1 z-10 rounded-full bg-destructive p-0.5 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
                {file.type.startsWith("image/") ? (
                  <img
                    src={preview}
                    alt={file.name}
                    className="mb-2 h-24 w-full rounded object-cover"
                  />
                ) : (
                  <div className="mb-2 flex h-24 items-center justify-center rounded bg-muted">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <p className="truncate text-xs font-medium" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? "Enviando..." : `Enviar ${selected.length} arquivo(s)`}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                selected.forEach(({ preview }) => URL.revokeObjectURL(preview));
                setSelected([]);
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
