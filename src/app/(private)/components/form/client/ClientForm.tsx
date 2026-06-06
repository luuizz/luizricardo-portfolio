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
import { createClientAction, updateClientAction } from "@/lib/actions/clients.actions";
import { ROUTES } from "@/lib/routes";
import { Client, ClientSector } from "@/types/dashboard";
import { DocLayout } from "@/app/(private)/components/ui/DocLayout";
import { SidebarCard, SidebarField, SidebarDate, StatusDot } from "@/app/(private)/components/ui/SidebarCard";

interface ClientFormProps {
  client?: Client;
  sectors?: ClientSector[];
}

export default function ClientForm({ client, sectors = [] }: ClientFormProps) {
  const isEdit = !!client;
  const [name, setName] = useState(client?.name ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const [company, setCompany] = useState(client?.company ?? "");
  const [sectorId, setSectorId] = useState(client?.sector_id ?? "");
  const [notes, setNotes] = useState(client?.notes ?? "");
  const [status, setStatus] = useState<"active" | "inactive">(
    (client?.status as "active" | "inactive") ?? "active",
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      email: email || undefined,
      phone: phone || undefined,
      company: company || undefined,
      sector_id: sectorId && sectorId !== "none" ? sectorId : undefined,
      notes: notes || undefined,
      status,
    };

    const result = isEdit
      ? await updateClientAction(client!.id, payload)
      : await createClientAction(payload);

    setLoading(false);

    if (result.success) {
      toast.success(isEdit ? "Cliente atualizado!" : "Cliente criado com sucesso!");
      router.push(ROUTES.clientes.root);
      router.refresh();
    } else {
      toast.error("Erro ao salvar cliente.", { description: result.message });
    }
  }

  const sectorName = sectors.find((s) => s.id === sectorId)?.name;

  const sidebar = (
    <>
      <SidebarCard title="Status">
        <SidebarField label="Situação atual">
          <StatusDot status={status} />
        </SidebarField>
        <SidebarField label="Alterar">
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </SidebarField>
      </SidebarCard>

      <SidebarCard title="Organização">
        <SidebarField label="Setor">
          {sectors.length > 0 ? (
            <Select value={sectorId || "none"} onValueChange={setSectorId}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Selecionar setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem setor</SelectItem>
                {sectors.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum setor cadastrado.</p>
          )}
        </SidebarField>
        {sectorName && (
          <p className="text-xs text-muted-foreground">Setor: {sectorName}</p>
        )}
      </SidebarCard>

      {isEdit && (
        <SidebarCard title="Informações">
          <SidebarDate label="Criado em" value={client!.created_at} />
          <SidebarDate label="Atualizado em" value={client!.updated_at} />
          <SidebarField label="ID">
            <p className="truncate font-mono text-xs text-muted-foreground">{client!.id}</p>
          </SidebarField>
        </SidebarCard>
      )}

      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Salvando..." : isEdit ? "Atualizar Cliente" : "Criar Cliente"}
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
        title={isEdit ? `Editar: ${client!.name}` : "Novo Cliente"}
        backHref={ROUTES.clientes.root}
        loading={loading}
        submitLabel={isEdit ? "Atualizar Cliente" : "Criar Cliente"}
        sidebar={sidebar}
      >
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs text-muted-foreground">Nome completo *</Label>
          <Input
            id="name"
            placeholder="Nome do cliente..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border-0 border-b rounded-none px-0 text-2xl font-semibold shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              placeholder="Nome da empresa"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            placeholder="(00) 00000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            placeholder="Informações adicionais sobre o cliente..."
            className="min-h-[120px] resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </DocLayout>
    </form>
  );
}
