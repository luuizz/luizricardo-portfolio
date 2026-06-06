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
import { Budget, Client } from "@/types/dashboard";
import { ROUTES } from "@/lib/routes";
import { DeleteConfirmDialog } from "@/app/(private)/components/ui/DeleteConfigmDialog";
import { deleteBudgetAction } from "@/lib/actions/budgets.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BudgetsTableProps {
  data: Budget[];
  clients?: Client[];
}

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  draft: { label: "Rascunho", variant: "secondary" },
  sent: { label: "Enviado", variant: "outline" },
  approved: { label: "Aprovado", variant: "default" },
  rejected: { label: "Rejeitado", variant: "destructive" },
};

function formatCurrency(value: number | null) {
  if (value === null) return "-";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function BudgetsTable({ data, clients = [] }: BudgetsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState<string>("");
  const [, startTransition] = useTransition();
  const router = useRouter();

  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c.name]));

  function handleDeleteConfirm() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteBudgetAction(deleteId);
      if (result.success) {
        toast.success("Orçamento excluído.");
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
        title="Todos os Orçamentos"
        newButtonLink={ROUTES.orcamentos.novo}
        data={data}
        renderHeader={() => (
          <TableRow>
            <TableHead className="min-w-[160px]">Título</TableHead>
            <TableHead className="hidden sm:table-cell">Cliente</TableHead>
            <TableHead className="hidden md:table-cell">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        )}
        renderRow={(budget) => {
          const s = STATUS_MAP[budget.status] ?? { label: budget.status, variant: "outline" as const };
          return (
            <TableRow key={budget.id}>
              <TableCell className="min-w-[160px] max-w-[220px] truncate font-medium" title={budget.title}>
                {budget.title}
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {budget.client_id ? clientMap[budget.client_id] ?? "-" : "-"}
              </TableCell>
              <TableCell className="hidden font-medium md:table-cell">{formatCurrency(budget.total)}</TableCell>
              <TableCell>
                <Badge variant={s.variant}>{s.label}</Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">{formatDate(budget.created_at)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`${ROUTES.orcamentos.root}/${budget.id}/editar`}>Editar</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => { setDeleteId(budget.id); setDeleteTitle(budget.title); }}
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
