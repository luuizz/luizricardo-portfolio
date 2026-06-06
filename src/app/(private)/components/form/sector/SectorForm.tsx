"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSectorAction, updateSectorAction } from "@/lib/actions/clients.actions";
import slugify from "@/app/shared/utils/slugfy";
import { ROUTES } from "@/lib/routes";
import { ClientSector } from "@/types/dashboard";
import { DocLayout } from "@/app/(private)/components/ui/DocLayout";
import { SidebarCard, SidebarField, SidebarDate } from "@/app/(private)/components/ui/SidebarCard";

interface SectorFormProps {
  sector?: ClientSector;
}

export default function SectorForm({ sector }: SectorFormProps) {
  const isEdit = !!sector;
  const [name, setName] = useState(sector?.name ?? "");
  const [slug, setSlug] = useState(sector?.slug ?? "");
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
      ? await updateSectorAction(sector!.id, { name, slug })
      : await createSectorAction({ name, slug });

    setLoading(false);

    if (result.success) {
      toast.success(isEdit ? "Setor atualizado!" : "Setor criado!");
      router.push(ROUTES.clientes.setor);
      router.refresh();
    } else {
      toast.error("Erro ao salvar setor.", { description: result.message });
    }
  }

  const sidebar = (
    <>
      <SidebarCard title="URL / Identificador">
        <SidebarField label="Slug">
          <Input
            placeholder="meu-setor"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="h-8 text-sm font-mono"
          />
        </SidebarField>
        <p className="text-xs text-muted-foreground">Gerado automaticamente a partir do nome.</p>
      </SidebarCard>

      {isEdit && (
        <SidebarCard title="Informações">
          <SidebarDate label="Criado em" value={sector!.created_at} />
          <SidebarDate label="Atualizado em" value={sector!.updated_at} />
          <SidebarField label="ID">
            <p className="truncate font-mono text-xs text-muted-foreground">{sector!.id}</p>
          </SidebarField>
        </SidebarCard>
      )}

      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Salvando..." : isEdit ? "Atualizar Setor" : "Criar Setor"}
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
        title={isEdit ? `Editar: ${sector!.name}` : "Novo Setor"}
        backHref={ROUTES.clientes.setor}
        loading={loading}
        submitLabel={isEdit ? "Atualizar" : "Criar Setor"}
        sidebar={sidebar}
      >
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs text-muted-foreground">Nome do setor *</Label>
          <Input
            id="name"
            placeholder="Ex: Tecnologia, Saúde, Educação..."
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
