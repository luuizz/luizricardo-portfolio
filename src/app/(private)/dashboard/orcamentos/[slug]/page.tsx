import type { Metadata } from "next";
import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { getBudgetById } from "@/lib/services/budgets.service";
import { getDashboardClients } from "@/lib/services/clients.service";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/app/shared/utils/format-date";
import { ROUTES } from "@/lib/routes";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Dashboard | Orçamento: ${slug}` };
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

export default async function VerOrcamentoPage({ params }: Props) {
  const { slug } = await params;
  const [budget, clients] = await Promise.all([
    getBudgetById(slug),
    getDashboardClients(),
  ]);

  if (!budget) notFound();

  const clientName = budget.client_id
    ? clients.find((c) => c.id === budget.client_id)?.name
    : null;

  const s = STATUS_MAP[budget.status] ?? { label: budget.status, variant: "outline" as const };

  return (
    <ContentDashboard>
      <div className="max-w-2xl space-y-6">
        <div className="flex items-start justify-between">
          <h1 className="font-inter text-3xl font-bold">{budget.title}</h1>
          <Button asChild variant="outline">
            <Link href={`${ROUTES.orcamentos.root}/${budget.id}/editar`}>Editar</Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={s.variant}>{s.label}</Badge>
          {clientName && <Badge variant="outline">{clientName}</Badge>}
          <span className="text-sm text-muted-foreground">
            Criado em {formatDate(budget.created_at)}
          </span>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Valor total</p>
          <p className="mt-1 text-2xl font-bold">{formatCurrency(budget.total)}</p>
        </div>

        {budget.notes && (
          <div className="rounded-lg border p-4">
            <p className="mb-1 text-sm font-medium text-muted-foreground">Observações</p>
            <p className="text-sm">{budget.notes}</p>
          </div>
        )}
      </div>
    </ContentDashboard>
  );
}
