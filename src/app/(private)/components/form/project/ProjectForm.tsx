"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
import { createProjectAction, updateProjectAction } from "@/lib/actions/projects.actions";
import slugify from "@/app/shared/utils/slugfy";
import { ROUTES } from "@/lib/routes";
import { ProjectForEdit, ProjectWithTypes } from "@/types/dashboard";
import { Json } from "@/types/supabase";
import dynamic from "next/dynamic";
import { DocLayout } from "@/app/(private)/components/ui/DocLayout";
import { SidebarCard, SidebarField, SidebarDate, StatusDot } from "@/app/(private)/components/ui/SidebarCard";
import { ContentTabs } from "@/app/(private)/components/ui/ContentTabs";
import { TagInput } from "@/app/(private)/components/ui/TagInput";
import { SeoFields, type SeoData } from "@/app/(private)/components/ui/SeoFields";
import { FileText, Search } from "lucide-react";

const RichTextEditor = dynamic(
  () => import("@/app/(private)/components/editor/RichTextEditor"),
  { ssr: false, loading: () => <div className="h-80 animate-pulse rounded-lg border bg-muted" /> },
);

interface ProjectFormProps {
  project?: ProjectForEdit | ProjectWithTypes;
}

function isProjectForEdit(p: ProjectForEdit | ProjectWithTypes | undefined): p is ProjectForEdit {
  return !!p && "seo" in p;
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const isEdit = !!project;
  const projectWithSeo = isProjectForEdit(project) ? project : null;

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    (project?.status as "draft" | "published" | "archived") ?? "draft",
  );
  const [highlightColor, setHighlightColor] = useState(project?.highlight_color ?? "#6366f1");
  const [startDate, setStartDate] = useState(project?.start_date?.split("T")[0] ?? "");
  const [endDate, setEndDate] = useState(project?.end_date?.split("T")[0] ?? "");
  const [content, setContent] = useState<Json | null>((project?.content as Json) ?? null);
  const [tags, setTags] = useState<string[]>((project?.tags as string[]) ?? []);

  const [seo, setSeo] = useState<SeoData>({
    seo_title: projectWithSeo?.seo?.seo_title ?? "",
    seo_description: projectWithSeo?.seo?.seo_description ?? "",
    keywords: projectWithSeo?.seo?.seo_keywords
      ? projectWithSeo.seo.seo_keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [],
    og_title: projectWithSeo?.seo?.og_title ?? "",
    og_description: projectWithSeo?.seo?.og_description ?? "",
    og_image: projectWithSeo?.seo?.og_image ?? "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEdit) setSlug(slugify(value));
  }

  function handleSeoChange<K extends keyof SeoData>(field: K, value: SeoData[K]) {
    setSeo((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const seoPayload = {
      seo_title: seo.seo_title || title,
      seo_description: seo.seo_description || undefined,
      seo_keywords: seo.keywords.length ? seo.keywords.join(", ") : undefined,
      og_title: seo.og_title || undefined,
      og_description: seo.og_description || undefined,
      og_image: seo.og_image || undefined,
    };

    const payload = {
      title,
      slug: slug.trim() || slugify(title),
      summary: summary || undefined,
      status,
      highlight_color: highlightColor || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      content: content ?? undefined,
      tags: tags.length ? tags : undefined,
      seo: seoPayload,
    };

    const result = isEdit
      ? await updateProjectAction(project!.id, projectWithSeo?.seo?.id ?? null, payload)
      : await createProjectAction(payload);

    setLoading(false);

    if (result.success) {
      toast.success(isEdit ? "Projeto atualizado!" : "Projeto criado com sucesso!");
      router.push(ROUTES.projetos.root);
      router.refresh();
    } else {
      toast.error("Erro ao salvar projeto.", { description: result.message });
    }
  }

  const sidebar = (
    <>
      <SidebarCard title="Publicação">
        <SidebarField label="Status atual">
          <StatusDot status={status} />
        </SidebarField>
        <SidebarField label="Alterar status">
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </SidebarField>
      </SidebarCard>

      <SidebarCard title="Visual">
        <SidebarField label="Cor de destaque">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={highlightColor}
              onChange={(e) => setHighlightColor(e.target.value)}
              className="h-8 w-10 cursor-pointer rounded border p-0.5"
            />
            <Input
              value={highlightColor}
              onChange={(e) => setHighlightColor(e.target.value)}
              className="h-8 font-mono text-sm"
              placeholder="#6366f1"
            />
          </div>
        </SidebarField>
      </SidebarCard>

      <SidebarCard title="Cronograma">
        <SidebarField label="Início">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-8 text-sm"
          />
        </SidebarField>
        <SidebarField label="Conclusão">
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-8 text-sm"
          />
        </SidebarField>
      </SidebarCard>

      <SidebarCard title="URL">
        <SidebarField label="Slug">
          <Input
            placeholder="nome-do-projeto"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="h-8 text-sm font-mono"
          />
        </SidebarField>
        {slug && (
          <p className="truncate text-xs text-muted-foreground">/projeto/{slug}</p>
        )}
      </SidebarCard>

      {isEdit && (
        <SidebarCard title="Informações">
          <SidebarDate label="Criado em" value={project!.created_at} />
          <SidebarDate label="Atualizado em" value={project!.updated_at} />
        </SidebarCard>
      )}

      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Salvando..." : isEdit ? "Atualizar Projeto" : "Criar Projeto"}
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </>
  );

  const tabs = [
    {
      id: "content",
      label: (
        <span className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          Conteúdo
        </span>
      ),
    },
    {
      id: "seo",
      label: (
        <span className="flex items-center gap-1.5">
          <Search className="h-3.5 w-3.5" />
          SEO & Metadata
        </span>
      ),
    },
  ];

  const panels = {
    content: (
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="summary">Resumo</Label>
          <Textarea
            id="summary"
            placeholder="Breve descrição do projeto..."
            className="min-h-[80px] resize-none"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Conteúdo / Descrição detalhada</Label>
          <RichTextEditor
            content={content}
            placeholder="Descreva o projeto em detalhes..."
            onChange={setContent}
          />
        </div>

        <div className="space-y-2">
          <Label>Tags do Projeto</Label>
          <TagInput
            tags={tags}
            onChange={setTags}
            placeholder="Ex: react, nextjs, supabase..."
          />
        </div>
      </div>
    ),
    seo: (
      <SeoFields
        data={seo}
        onChange={handleSeoChange}
        slug={slug}
        urlBase="luizricardotech.com/projeto"
      />
    ),
  };

  return (
    <form onSubmit={handleSubmit}>
      <DocLayout
        title={isEdit ? `Editar: ${project!.title}` : "Novo Projeto"}
        backHref={ROUTES.projetos.root}
        loading={loading}
        submitLabel={isEdit ? "Atualizar Projeto" : "Criar Projeto"}
        sidebar={sidebar}
      >
        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs text-muted-foreground">Título *</Label>
          <Input
            id="title"
            placeholder="Nome do projeto..."
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="border-0 border-b rounded-none px-0 text-2xl font-semibold shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
          />
        </div>

        <ContentTabs tabs={tabs} panels={panels} defaultTab="content" />
      </DocLayout>
    </form>
  );
}
