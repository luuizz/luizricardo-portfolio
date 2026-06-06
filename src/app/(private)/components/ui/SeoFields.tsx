"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { TagInput } from "./TagInput";
import { Globe, Share2, AlertCircle, CheckCircle2 } from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";
import { cn } from "@/lib/utils";

export interface SeoData {
  seo_title: string;
  seo_description: string;
  keywords: string[];
  og_title: string;
  og_description: string;
  og_image: string;
}

interface SeoFieldsProps {
  data: SeoData;
  onChange: <K extends keyof SeoData>(field: K, value: SeoData[K]) => void;
  slug?: string;
  urlBase?: string;
}

function CharCounter({ value, max, warn = max * 0.85 }: { value: string; max: number; warn?: number }) {
  const len = value.length;
  return (
    <span
      className={cn(
        "text-xs",
        len > max ? "text-destructive font-medium" : len > warn ? "text-amber-500" : "text-muted-foreground",
      )}
    >
      {len}/{max}
    </span>
  );
}

export function SeoFields({ data, onChange, slug = "", urlBase = "luizricardotech.com" }: SeoFieldsProps) {
  const displayUrl = `${urlBase} › ${slug || "..."}`;
  const titlePreview = data.seo_title || "— sem meta title —";
  const descPreview = data.seo_description || "— sem meta description —";
  const titleOk = data.seo_title.length > 0 && data.seo_title.length <= 60;
  const descOk = data.seo_description.length > 0 && data.seo_description.length <= 160;

  return (
    <div className="space-y-8">
      {/* Google snippet preview */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium">Prévia no Google</p>
        </div>
        <div className="rounded-lg border bg-card p-4 space-y-0.5">
          <p className="text-xs text-muted-foreground">{displayUrl}</p>
          <p className={cn("text-base font-medium leading-snug", !data.seo_title && "text-muted-foreground/60 italic")}>
            {titlePreview}
          </p>
          <p className={cn("text-sm leading-snug", !data.seo_description ? "text-muted-foreground/60 italic" : "text-muted-foreground")}>
            {descPreview}
          </p>
        </div>

        {/* Quick status */}
        <div className="flex gap-4 text-xs">
          <span className={cn("flex items-center gap-1", titleOk ? "text-emerald-600" : "text-amber-500")}>
            {titleOk ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
            Título {titleOk ? "ok" : "ausente ou longo demais"}
          </span>
          <span className={cn("flex items-center gap-1", descOk ? "text-emerald-600" : "text-amber-500")}>
            {descOk ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
            Descrição {descOk ? "ok" : "ausente ou longa demais"}
          </span>
        </div>
      </div>

      {/* Meta fields */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="seo_title">Meta Title</Label>
            <CharCounter value={data.seo_title} max={60} />
          </div>
          <Input
            id="seo_title"
            placeholder="Título otimizado para mecanismos de busca (máx. 60 chars)"
            value={data.seo_title}
            onChange={(e) => onChange("seo_title", e.target.value)}
            maxLength={80}
          />
          <p className="text-xs text-muted-foreground">
            Se vazio, será usado o título do documento.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="seo_desc">Meta Description</Label>
            <CharCounter value={data.seo_description} max={160} />
          </div>
          <Textarea
            id="seo_desc"
            placeholder="Descrição exibida nos resultados de busca (máx. 160 chars)"
            value={data.seo_description}
            onChange={(e) => onChange("seo_description", e.target.value)}
            maxLength={200}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Keywords / Palavras-chave</Label>
          <TagInput
            tags={data.keywords}
            onChange={(tags) => onChange("keywords", tags)}
            placeholder="Adicione palavras-chave e pressione Enter..."
          />
          <p className="text-xs text-muted-foreground">
            Pressione Enter ou vírgula para adicionar. Backspace para remover.
          </p>
        </div>
      </div>

      <Separator />

      {/* Open Graph */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium">Open Graph — Compartilhamento Social</p>
        </div>

        {/* OG image upload */}
        <div className="space-y-1.5">
          <Label>og:image — Imagem de compartilhamento</Label>
          <ImageUploadField
            value={data.og_image}
            onChange={(url) => onChange("og_image", url)}
            hint="Recomendado: 1200×630px · PNG, JPG, WEBP"
            aspectRatio="aspect-[1200/630]"
          />
        </div>

        {/* OG text preview card */}
        <div className="overflow-hidden rounded-lg border bg-card">
          <div className="p-3">
            <p className="text-xs text-muted-foreground">{urlBase}</p>
            <p className={cn("text-sm font-semibold leading-snug", !(data.og_title || data.seo_title) && "text-muted-foreground/60 italic")}>
              {data.og_title || data.seo_title || "— sem og:title —"}
            </p>
            <p className={cn("mt-0.5 text-xs leading-snug", !(data.og_description || data.seo_description) ? "text-muted-foreground/60 italic" : "text-muted-foreground")}>
              {data.og_description || data.seo_description || "— sem og:description —"}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="og_title">og:title</Label>
            <CharCounter value={data.og_title} max={60} />
          </div>
          <Input
            id="og_title"
            placeholder="Título para compartilhamento (padrão: usa meta title)"
            value={data.og_title}
            onChange={(e) => onChange("og_title", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="og_desc">og:description</Label>
            <CharCounter value={data.og_description} max={200} />
          </div>
          <Textarea
            id="og_desc"
            placeholder="Descrição para compartilhamento (padrão: usa meta description)"
            value={data.og_description}
            onChange={(e) => onChange("og_description", e.target.value)}
            className="min-h-[70px] resize-none"
          />
        </div>

      </div>
    </div>
  );
}
