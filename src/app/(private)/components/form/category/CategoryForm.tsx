"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { createCategoryAction, updateCategoryAction } from "@/lib/actions/categories.actions";
import slugify from "@/app/shared/utils/slugfy";
import { ROUTES } from "@/lib/routes";
import { Category } from "@/types/dashboard";
import { DocLayout } from "@/app/(private)/components/ui/DocLayout";
import { SidebarCard, SidebarField, SidebarDate, StatusDot } from "@/app/(private)/components/ui/SidebarCard";

interface CategoryFormProps {
  category?: Category;
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const isEdit = !!category;
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [status, setStatus] = useState<"draft" | "scheduled" | "published">(
    (category?.status as "draft" | "scheduled" | "published") ?? "draft",
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleNameChange(value: string) {
    setName(value);
    if (!isEdit) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = isEdit
      ? await updateCategoryAction(category!.id, { name, slug, status })
      : await createCategoryAction({ name, slug, status });

    setLoading(false);

    if (result.success) {
      toast.success(isEdit ? "Categoria atualizada!" : "Categoria criada com sucesso!");
      router.push(ROUTES.blog_categorias.root);
      router.refresh();
    } else {
      toast.error("Erro ao salvar categoria.", { description: result.message });
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

      <SidebarCard title="URL">
        <SidebarField label="Slug">
          <Input
            placeholder="minha-categoria"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="h-8 text-sm font-mono"
          />
        </SidebarField>
        <p className="text-xs text-muted-foreground">Gerado automaticamente a partir do nome.</p>
        {slug && (
          <p className="truncate text-xs text-muted-foreground">/blog/categoria/{slug}</p>
        )}
      </SidebarCard>

      {isEdit && (
        <SidebarCard title="Informações">
          <SidebarDate label="Criado em" value={category!.created_at} />
          <SidebarDate label="Atualizado em" value={category!.updated_at} />
        </SidebarCard>
      )}

      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Salvando..." : isEdit ? "Atualizar Categoria" : "Criar Categoria"}
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
        title={isEdit ? `Editar: ${category!.name}` : "Nova Categoria"}
        backHref={ROUTES.blog_categorias.root}
        loading={loading}
        submitLabel={isEdit ? "Atualizar" : "Criar Categoria"}
        sidebar={sidebar}
      >
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs text-muted-foreground">Nome da categoria *</Label>
          <Input
            id="name"
            placeholder="Ex: Tecnologia, Design, Marketing..."
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            className="border-0 border-b rounded-none px-0 text-2xl font-semibold shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
          />
        </div>
      </DocLayout>
    </form>
  );
}
