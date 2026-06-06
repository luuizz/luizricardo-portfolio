"use client";

import React, { useState, useTransition } from "react";
import DataTableShell from "./DataTableShell";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/app/shared/utils/format-date";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectWithTypes } from "@/types/dashboard";
import { ROUTES } from "@/lib/routes";
import { DeleteConfirmDialog } from "@/app/(private)/components/ui/DeleteConfigmDialog";
import { deleteProjectAction } from "@/lib/actions/projects.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProjectTableProps {
  data: ProjectWithTypes[];
}

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  published: { label: "Publicado", variant: "default" },
  draft: { label: "Rascunho", variant: "secondary" },
  archived: { label: "Arquivado", variant: "outline" },
};

export default function ProjectTable({ data }: ProjectTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState<string>("");
  const [, startTransition] = useTransition();
  const router = useRouter();

  function handleDeleteConfirm() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteProjectAction(deleteId);
      if (result.success) {
        toast.success("Projeto excluído com sucesso.");
        router.refresh();
      } else {
        toast.error("Erro ao excluir projeto.", { description: result.message });
      }
      setDeleteId(null);
    });
  }

  return (
    <>
      <DataTableShell
        title="Todos os Projetos"
        newButtonLink={ROUTES.projetos.novo}
        data={data}
        renderHeader={() => (
          <TableRow>
            <TableHead className="min-w-[160px]">Título</TableHead>
            <TableHead className="hidden sm:table-cell">Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Tipos</TableHead>
            <TableHead className="hidden lg:table-cell">Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        )}
        renderRow={(project) => {
          const status = STATUS_MAP[project.status] ?? { label: project.status, variant: "outline" as const };
          const types = project.project_type_relations
            ?.map((r) => r.project_types?.name)
            .filter(Boolean)
            .join(", ");

          return (
            <TableRow key={project.id}>
              <TableCell className="min-w-[160px] max-w-[220px] truncate font-medium" title={project.title}>
                {project.title}
              </TableCell>
              <TableCell className="hidden max-w-[150px] truncate text-muted-foreground sm:table-cell">
                {project.slug ?? "-"}
              </TableCell>
              <TableCell>
                <Badge variant={status.variant}>{status.label}</Badge>
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                {types || "-"}
              </TableCell>
              <TableCell className="hidden lg:table-cell">{formatDate(project.created_at)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`${ROUTES.projetos.root}/${project.slug}/editar`}>
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => { setDeleteId(project.id); setDeleteTitle(project.title); }}
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        }}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        itemName={deleteTitle}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
