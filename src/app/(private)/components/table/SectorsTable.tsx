"use client";

import React, { useState, useTransition } from "react";
import DataTableShell from "./DataTableShell";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
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
import { ClientSector } from "@/types/dashboard";
import { ROUTES } from "@/lib/routes";
import { DeleteConfirmDialog } from "@/app/(private)/components/ui/DeleteConfigmDialog";
import { deleteSectorAction } from "@/lib/actions/clients.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SectorsTableProps {
  data: ClientSector[];
}

export default function SectorsTable({ data }: SectorsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [, startTransition] = useTransition();
  const router = useRouter();

  function handleDeleteConfirm() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteSectorAction(deleteId);
      if (result.success) {
        toast.success("Setor excluído.");
        router.refresh();
      } else {
        toast.error("Erro ao excluir.", { description: result.message });
      }
      setDeleteId(null);
    });
  }

  return (
    <>
      <DataTableShell
        title="Todos os Setores"
        newButtonLink={ROUTES.clientes.setor_novo}
        data={data}
        renderHeader={() => (
          <TableRow>
            <TableHead className="w-[200px]">Nome</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        )}
        renderRow={(sector) => (
          <TableRow key={sector.id}>
            <TableCell className="font-medium">{sector.name}</TableCell>
            <TableCell className="text-muted-foreground">{sector.slug}</TableCell>
            <TableCell>{formatDate(sector.created_at)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`${ROUTES.clientes.setor}/${sector.slug}/editar`}>
                      Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => { setDeleteId(sector.id); setDeleteName(sector.name); }}
                  >
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        )}
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
