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
import { createProjectTypeAction, updateProjectTypeAction } from "@/lib/actions/projects.actions";
import slugify from "@/app/shared/utils/slugfy";
import { ROUTES } from "@/lib/routes";
import { ProjectType } from "@/types/dashboard";
import { DocLayout } from "@/app/(private)/components/ui/DocLayout";
import { SidebarCard, SidebarField, SidebarDate, StatusDot } from "@/app/(private)/components/ui/SidebarCard";

interface ProjectTypeFormProps {
  projectType?: ProjectType;
}

export default function ProjectTypeForm({ projectType }: ProjectTypeFormProps) {
  const isEdit = !!projectType;
  const [name, setName] = useState(projectType?.name ?? "");
  const [slug, setSlug] = useState(projectType?.slug ?? "");
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    (projectType?.status as "draft" | "published" | "archived") ?? "draft",
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
      ? await updateProjectTypeAction(projectType!.id, { name, slug, status })
      : await createProjectTypeAction({ name, slug, status });

    setLoading(false);

    if (result.success) {
      toast.success(isEdit ? "Tipo atualizado!" : "Tipo criado com sucesso!");
      router.push(ROUTES.projetos_categorias.root);
      router.refresh();
    } else {
      toast.error("Erro ao salvar.", { description: result.message });
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

      <SidebarCard title="URL / Identificador">
        <SidebarField label="Slug">
          <Input
            placeholder="web-design"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="h-8 text-sm font-mono"
          />
        </SidebarField>
        <p className="text-xs text-muted-foreground">Gerado automaticamente a partir do nome.</p>
      </SidebarCard>

      {isEdit && (
        <SidebarCard title="Informações">
          <SidebarDate label="Criado em" value={projectType!.created_at} />
          <SidebarDate label="Atualizado em" value={projectType!.updated_at} />
        </SidebarCard>
      )}

      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Salvando..." : isEdit ? "Atualizar Tipo" : "Criar Tipo"}
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
        title={isEdit ? `Editar: ${projectType!.name}` : "Novo Tipo de Projeto"}
        backHref={ROUTES.projetos_categorias.root}
        loading={loading}
        submitLabel={isEdit ? "Atualizar" : "Criar Tipo"}
        sidebar={sidebar}
      >
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs text-muted-foreground">Nome do tipo *</Label>
          <Input
            id="name"
            placeholder="Ex: Web Design, Branding, App Mobile..."
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
