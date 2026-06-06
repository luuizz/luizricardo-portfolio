"use client";

import { useRef, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, ImageIcon, Loader2, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const BUCKET = "media";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  aspectRatio?: string;
}

export function ImageUploadField({
  value,
  onChange,
  hint = "Recomendado: 1200×630px · PNG, JPG, WEBP",
  aspectRatio = "aspect-[1200/630]",
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Apenas imagens são permitidas.");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const uniqueName = `og-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(uniqueName, file, { upsert: false });

      if (uploadError) throw uploadError;

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${uniqueName}`;

      // Also register in media table
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("media").insert({
        name: file.name,
        path: uniqueName,
        bucket: BUCKET,
        mime_type: file.type,
        size: file.size,
        uploaded_by: user?.id ?? null,
      });

      onChange(publicUrl);
      toast.success("Imagem enviada!");
    } catch {
      toast.error("Erro ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function applyUrl() {
    if (urlInput.trim()) onChange(urlInput.trim());
    setUrlInput("");
    setShowUrlInput(false);
  }

  if (value) {
    return (
      <div className="space-y-2">
        <div className={cn("relative overflow-hidden rounded-lg border bg-muted", aspectRatio)}>
          <img
            src={value}
            alt="OG preview"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute right-2 top-2 h-7 w-7 shadow"
            onClick={() => onChange("")}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="truncate text-xs text-muted-foreground font-mono">{value}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !uploading && fileRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/30 p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/50",
          aspectRatio,
          uploading && "cursor-not-allowed opacity-60",
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Enviando...</p>
          </>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Clique ou arraste uma imagem</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
            </div>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {/* URL fallback */}
      {showUrlInput ? (
        <div className="flex gap-2">
          <Input
            placeholder="https://..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyUrl()}
            className="h-8 text-sm"
            autoFocus
          />
          <Button type="button" size="sm" variant="outline" onClick={applyUrl}>
            Aplicar
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setShowUrlInput(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowUrlInput(true)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Link2 className="h-3.5 w-3.5" />
          Ou cole uma URL de imagem
        </button>
      )}
    </div>
  );
}
