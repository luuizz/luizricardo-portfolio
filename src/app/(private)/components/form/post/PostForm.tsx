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
import { createPostAndPublish, updatePostAction } from "@/lib/actions/posts.actions";
import slugify from "@/app/shared/utils/slugfy";
import { ROUTES } from "@/lib/routes";
import { Category, PostForEdit, PostsWithCategory } from "@/types/dashboard";
import { Json } from "@/types/supabase";
import dynamic from "next/dynamic";
import { DocLayout } from "@/app/(private)/components/ui/DocLayout";
import { SidebarCard, SidebarField, SidebarDate, StatusDot } from "@/app/(private)/components/ui/SidebarCard";
import { ContentTabs } from "@/app/(private)/components/ui/ContentTabs";
import { CategoryMultiSelect } from "@/app/(private)/components/ui/CategoryMultiSelect";
import { SeoFields, type SeoData } from "@/app/(private)/components/ui/SeoFields";
import { FileText, Search } from "lucide-react";

const RichTextEditor = dynamic(
  () => import("@/app/(private)/components/editor/RichTextEditor"),
  { ssr: false, loading: () => <div className="h-80 animate-pulse rounded-lg border bg-muted" /> },
);

interface PostFormProps {
  post?: PostForEdit | PostsWithCategory;
  categories?: Category[];
}

function isPostForEdit(post: PostForEdit | PostsWithCategory | undefined): post is PostForEdit {
  return !!post && "post_categories" in post;
}

export default function PostForm({ post, categories = [] }: PostFormProps) {
  const isEdit = !!post;

  // Content fields
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">(
    (post?.status as "draft" | "published" | "scheduled") ?? "draft",
  );
  const [content, setContent] = useState<Json | null>((post?.content as Json) ?? null);

  // Multi-category
  const [categoryIds, setCategoryIds] = useState<string[]>(
    isPostForEdit(post)
      ? (post.post_categories?.map((pc) => pc.category_id) ?? [])
      : post?.category
        ? [post.category]
        : [],
  );

  // SEO
  const postWithSeo = isPostForEdit(post) ? post : null;
  const [seo, setSeo] = useState<SeoData>({
    seo_title: postWithSeo?.seo?.seo_title ?? "",
    seo_description: postWithSeo?.seo?.seo_description ?? "",
    keywords: postWithSeo?.seo?.seo_keywords
      ? postWithSeo.seo.seo_keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [],
    og_title: postWithSeo?.seo?.og_title ?? "",
    og_description: postWithSeo?.seo?.og_description ?? "",
    og_image: postWithSeo?.seo?.og_image ?? "",
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

    let result;
    if (isEdit) {
      result = await updatePostAction(post!.id, postWithSeo?.seo?.id ?? null, {
        title,
        slug: slug.trim() || slugify(title),
        excerpt,
        status,
        content: content ?? undefined,
        categoryIds,
        seo: seoPayload,
      });
    } else {
      result = await createPostAndPublish({
        title,
        slug: slug.trim() || slugify(title),
        excerpt,
        status,
        content: content ?? undefined,
        categoryIds,
        seo: seoPayload,
      });
    }

    setLoading(false);

    if (result.success) {
      toast.success(isEdit ? "Post atualizado!" : "Post criado com sucesso!");
      router.push(ROUTES.blog.root);
      router.refresh();
    } else {
      toast.error("Erro ao salvar post.", { description: result.message });
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
              <SelectItem value="scheduled">Agendado</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
            </SelectContent>
          </Select>
        </SidebarField>
      </SidebarCard>

      <SidebarCard title="Categorias">
        <CategoryMultiSelect
          categories={categories}
          selected={categoryIds}
          onChange={setCategoryIds}
          placeholder="Selecionar categorias..."
        />
      </SidebarCard>

      <SidebarCard title="URL / SEO">
        <SidebarField label="Slug">
          <Input
            placeholder="meu-post"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="h-8 text-sm font-mono"
          />
        </SidebarField>
        {slug && (
          <p className="truncate text-xs text-muted-foreground">/blog/artigo/{slug}</p>
        )}
      </SidebarCard>

      {isEdit && (
        <SidebarCard title="Informações">
          <SidebarDate label="Criado em" value={post!.created_at} />
          <SidebarDate label="Atualizado em" value={post!.updated_at} />
          <SidebarField label="ID">
            <p className="truncate font-mono text-xs text-muted-foreground">{post!.id}</p>
          </SidebarField>
        </SidebarCard>
      )}

      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Salvando..." : isEdit ? "Atualizar Post" : "Criar Post"}
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
          <Label htmlFor="excerpt">Resumo / Excerpt *</Label>
          <Textarea
            id="excerpt"
            placeholder="Uma breve descrição do conteúdo..."
            className="min-h-[80px] resize-none"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Conteúdo</Label>
          <RichTextEditor
            content={content}
            placeholder="Escreva o conteúdo do post aqui..."
            onChange={setContent}
          />
        </div>
      </div>
    ),
    seo: (
      <SeoFields
        data={seo}
        onChange={handleSeoChange}
        slug={slug}
        urlBase="luizricardotech.com/blog/artigo"
      />
    ),
  };

  return (
    <form onSubmit={handleSubmit}>
      <DocLayout
        title={isEdit ? `Editar: ${post!.title}` : "Novo Post"}
        backHref={ROUTES.blog.root}
        loading={loading}
        submitLabel={isEdit ? "Atualizar Post" : "Criar Post"}
        sidebar={sidebar}
      >
        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs text-muted-foreground">Título *</Label>
          <Input
            id="title"
            placeholder="Título da publicação..."
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
