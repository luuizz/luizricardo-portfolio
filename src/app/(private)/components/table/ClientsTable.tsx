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
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Client, ClientSector } from "@/types/dashboard";
import { ROUTES } from "@/lib/routes";
import { DeleteConfirmDialog } from "@/app/(private)/components/ui/DeleteConfigmDialog";
import { deleteClientAction } from "@/lib/actions/clients.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ClientsTableProps {
  data: Client[];
  sectors?: ClientSector[];
}

export default function ClientsTable({
  data,
  sectors = [],
}: ClientsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [, startTransition] = useTransition();
  const router = useRouter();

  const sectorMap = Object.fromEntries(sectors.map((s) => [s.id, s.name]));

  function handleDeleteConfirm() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteClientAction(deleteId);
      if (result.success) {
        toast.success("Cliente excluído.");
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
        title="Todos os Clientes"
        newButtonLink={ROUTES.clientes.novo}
        data={data}
        renderHeader={() => (
          <TableRow>
            <TableHead className="w-[200px]">Nome</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Setor</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        )}
        renderRow={(client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell className="text-muted-foreground">
              {client.company ?? "-"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {client.sector_id ? (sectorMap[client.sector_id] ?? "-") : "-"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {client.email ?? "-"}
            </TableCell>
            <TableCell>
              <Badge
                variant={client.status === "active" ? "default" : "secondary"}
              >
                {client.status === "active" ? "Ativo" : "Inativo"}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(client.created_at)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`${ROUTES.clientes.root}/${client.id}/editar`}>
                      Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      setDeleteId(client.id);
                      setDeleteName(client.name);
                    }}
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
