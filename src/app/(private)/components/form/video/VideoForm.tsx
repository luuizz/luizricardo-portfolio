"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createVideoAction, updateVideoAction } from "@/lib/actions/videos.actions";
import slugify from "@/app/shared/utils/slugfy";
import { ROUTES } from "@/lib/routes";
import { Video } from "@/types/dashboard";
import { DocLayout } from "@/app/(private)/components/ui/DocLayout";
import {
  SidebarCard,
  SidebarField,
  SidebarDate,
  StatusDot,
} from "@/app/(private)/components/ui/SidebarCard";
import { Youtube, ExternalLink } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  tutorial: "Tutorial",
  talk: "Talk / Palestra",
  course: "Curso",
  other: "Outro",
};

const PLATFORM_LABELS: Record<string, string> = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  other: "Outro",
};

function getEmbedUrl(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}

interface VideoFormProps {
  video?: Video;
}

export default function VideoForm({ video }: VideoFormProps) {
  const isEdit = !!video;
  const [title, setTitle] = useState(video?.title ?? "");
  const [slug, setSlug] = useState(video?.slug ?? "");
  const [url, setUrl] = useState(video?.url ?? "");
  const [description, setDescription] = useState(video?.description ?? "");
  const [thumbnail, setThumbnail] = useState(video?.thumbnail ?? "");
  const [category, setCategory] = useState(video?.category ?? "tutorial");
  const [status, setStatus] = useState(video?.status ?? "draft");
  const [duration, setDuration] = useState(video?.duration ?? "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const embedUrl = getEmbedUrl(url);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEdit) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("A URL do vídeo é obrigatória.");
      return;
    }
    setLoading(true);

    const input = {
      title,
      url,
      description: description || undefined,
      thumbnail: thumbnail || undefined,
      category,
      status,
      duration: duration || undefined,
      slug,
    };

    const result = isEdit
      ? await updateVideoAction(video!.id, input)
      : await createVideoAction(input);

    setLoading(false);

    if (result.success) {
      toast.success(isEdit ? "Vídeo atualizado!" : "Vídeo criado com sucesso!");
      router.push(ROUTES.videos.root);
      router.refresh();
    } else {
      toast.error("Erro ao salvar.", { description: result.message });
    }
  }

  const sidebar = (
    <>
      <SidebarCard title="Publicação">
        <SidebarField label="Status">
          <StatusDot status={status} />
        </SidebarField>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="published">Publicado</SelectItem>
          </SelectContent>
        </Select>
      </SidebarCard>

      <SidebarCard title="Classificação">
        <SidebarField label="Categoria">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SidebarField>
        <SidebarField label="Duração (ex: 12:30)">
          <Input
            placeholder="00:00"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="h-8 text-sm font-mono"
          />
        </SidebarField>
      </SidebarCard>

      <SidebarCard title="Identificador">
        <SidebarField label="Slug">
          <Input
            placeholder="meu-tutorial"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="h-8 text-sm font-mono"
          />
        </SidebarField>
      </SidebarCard>

      {url && (
        <SidebarCard title="Plataforma">
          <SidebarField label="Detectada">
            <span className="flex items-center gap-1.5 text-sm">
              {/youtube|youtu\.be/.test(url) && <Youtube className="h-4 w-4 text-red-500" />}
              {PLATFORM_LABELS[/youtube|youtu\.be/.test(url) ? "youtube" : /vimeo/.test(url) ? "vimeo" : "other"]}
            </span>
          </SidebarField>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Abrir vídeo
            </a>
          )}
        </SidebarCard>
      )}

      {isEdit && (
        <SidebarCard title="Informações">
          <SidebarDate label="Criado em" value={video!.created_at} />
          <SidebarDate label="Atualizado em" value={video!.updated_at} />
        </SidebarCard>
      )}

      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Salvando..." : isEdit ? "Atualizar Vídeo" : "Criar Vídeo"}
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </>
  );

  return (
    <form onSubmit={handleSubmit}>
      <DocLayout
        title={isEdit ? `Editar: ${video!.title}` : "Novo Vídeo"}
        backHref={ROUTES.videos.root}
        loading={loading}
        submitLabel={isEdit ? "Atualizar" : "Criar Vídeo"}
        sidebar={sidebar}
      >
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Título *</Label>
            <Input
              placeholder="Nome do vídeo..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="border-0 border-b rounded-none px-0 text-2xl font-semibold shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <Label htmlFor="url">URL do Vídeo *</Label>
            <Input
              id="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Suporta YouTube, Vimeo ou qualquer URL de vídeo.
            </p>
          </div>

          {/* Embed preview */}
          {embedUrl && (
            <div className="overflow-hidden rounded-xl border bg-muted/30">
              <iframe
                src={embedUrl}
                title={title || "Preview do vídeo"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="aspect-video w-full"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="desc">Descrição</Label>
            <Textarea
              id="desc"
              placeholder="Descreva o conteúdo do vídeo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Thumbnail override */}
          <div className="space-y-1.5">
            <Label htmlFor="thumb">Thumbnail personalizada (URL)</Label>
            <Input
              id="thumb"
              placeholder="https://... — deixe vazio para usar a do YouTube"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="font-mono text-sm"
            />
            {(thumbnail || url) && (
              <img
                src={thumbnail || (url ? `https://img.youtube.com/vi/${url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1]}/hqdefault.jpg` : "")}
                alt="Thumbnail"
                className="mt-2 h-32 w-full rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>
        </div>
      </DocLayout>
    </form>
  );
}
