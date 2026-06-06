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
import { Category } from "@/types/dashboard";
import { ROUTES } from "@/lib/routes";
import { DeleteConfirmDialog } from "@/app/(private)/components/ui/DeleteConfigmDialog";
import { deleteCategoryAction } from "@/lib/actions/categories.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CategoryPostTableProps {
  data: Category[];
}

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  published: { label: "Publicado", variant: "default" },
  draft: { label: "Rascunho", variant: "secondary" },
  scheduled: { label: "Agendado", variant: "outline" },
};

export default function CategoryPostTable({ data }: CategoryPostTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [, startTransition] = useTransition();
  const router = useRouter();

  function handleDeleteClick(id: string, name: string) {
    setDeleteId(id);
    setDeleteName(name);
  }

  function handleDeleteConfirm() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteCategoryAction(deleteId);
      if (result.success) {
        toast.success("Categoria excluída com sucesso.");
        router.refresh();
      } else {
        toast.error("Erro ao excluir categoria.", { description: result.message });
      }
      setDeleteId(null);
    });
  }

  return (
    <>
      <DataTableShell
        title="Todas as Categorias"
        newButtonLink={ROUTES.blog_categorias.novo}
        data={data}
        renderHeader={() => (
          <TableRow>
            <TableHead className="min-w-[140px]">Nome</TableHead>
            <TableHead className="hidden sm:table-cell">Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        )}
        renderRow={(category) => {
          const status = STATUS_MAP[category.status] ?? { label: category.status, variant: "outline" as const };
          return (
            <TableRow key={category.id}>
              <TableCell className="min-w-[140px] font-medium">{category.name}</TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">{category.slug}</TableCell>
              <TableCell>
                <Badge variant={status.variant}>{status.label}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{formatDate(category.created_at)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`${ROUTES.blog_categorias.root}${category.slug}/editar`}>
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteClick(category.id, category.name)}
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
        itemName={deleteName}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
