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
import { createBudgetAction, updateBudgetAction } from "@/lib/actions/budgets.actions";
import { ROUTES } from "@/lib/routes";
import { Budget, Client } from "@/types/dashboard";
import { DocLayout } from "@/app/(private)/components/ui/DocLayout";
import { SidebarCard, SidebarField, SidebarDate, StatusDot } from "@/app/(private)/components/ui/SidebarCard";

interface BudgetFormProps {
  budget?: Budget;
  clients?: Client[];
}

export default function BudgetForm({ budget, clients = [] }: BudgetFormProps) {
  const isEdit = !!budget;
  const [title, setTitle] = useState(budget?.title ?? "");
  const [clientId, setClientId] = useState(budget?.client_id ?? "");
  const [total, setTotal] = useState(budget?.total?.toString() ?? "");
  const [status, setStatus] = useState<"draft" | "sent" | "approved" | "rejected">(
    (budget?.status as "draft" | "sent" | "approved" | "rejected") ?? "draft",
  );
  const [notes, setNotes] = useState(budget?.notes ?? "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title,
      client_id: clientId && clientId !== "none" ? clientId : undefined,
      total: total ? parseFloat(total.replace(",", ".")) : undefined,
      status,
      notes: notes || undefined,
    };

    const result = isEdit
      ? await updateBudgetAction(budget!.id, payload)
      : await createBudgetAction(payload);

    setLoading(false);

    if (result.success) {
      toast.success(isEdit ? "Orçamento atualizado!" : "Orçamento criado!");
      router.push(ROUTES.orcamentos.root);
      router.refresh();
    } else {
      toast.error("Erro ao salvar orçamento.", { description: result.message });
    }
  }

  const clientName = clients.find((c) => c.id === clientId)?.name;
  const totalFormatted = budget?.total
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(budget.total)
    : null;

  const sidebar = (
    <>
      <SidebarCard title="Status">
        <SidebarField label="Situação atual">
          <StatusDot status={status} />
        </SidebarField>
        <SidebarField label="Alterar status">
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="sent">Enviado</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
        </SidebarField>
      </SidebarCard>

      <SidebarCard title="Financeiro">
        <SidebarField label="Valor total (R$)">
          <Input
            placeholder="0,00"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="h-8 text-sm"
          />
        </SidebarField>
        {totalFormatted && isEdit && (
          <p className="text-xs text-muted-foreground">Atual: {totalFormatted}</p>
        )}
      </SidebarCard>

      <SidebarCard title="Cliente">
        <SidebarField label="Vincular cliente">
          {clients.length > 0 ? (
            <Select value={clientId || "none"} onValueChange={setClientId}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Selecionar cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem cliente</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} {c.company ? `— ${c.company}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum cliente cadastrado.</p>
          )}
        </SidebarField>
        {clientName && (
          <p className="text-xs text-muted-foreground">Cliente: {clientName}</p>
        )}
      </SidebarCard>

      {isEdit && (
        <SidebarCard title="Informações">
          <SidebarDate label="Criado em" value={budget!.created_at} />
          <SidebarDate label="Atualizado em" value={budget!.updated_at} />
          <SidebarField label="ID">
            <p className="truncate font-mono text-xs text-muted-foreground">{budget!.id}</p>
          </SidebarField>
        </SidebarCard>
      )}

      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Salvando..." : isEdit ? "Atualizar Orçamento" : "Criar Orçamento"}
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
        title={isEdit ? `Editar: ${budget!.title}` : "Novo Orçamento"}
        backHref={ROUTES.orcamentos.root}
        loading={loading}
        submitLabel={isEdit ? "Atualizar Orçamento" : "Criar Orçamento"}
        sidebar={sidebar}
      >
        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs text-muted-foreground">Título do orçamento *</Label>
          <Input
            id="title"
            placeholder="Ex: Desenvolvimento de site institucional..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border-0 border-b rounded-none px-0 text-2xl font-semibold shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações / Detalhes</Label>
          <Textarea
            id="notes"
            placeholder="Detalhes do orçamento, condições de pagamento, escopo, prazos..."
            className="min-h-[200px] resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </DocLayout>
    </form>
  );
}
