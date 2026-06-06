import { Metadata } from "next";
import ContentDashboard from "@/app/(private)/components/ui/content-home";
import BudgetsTable from "@table/BudgetsTable";
import EmptyTax from "@/app/(private)/components/ui/empty-tax";
import { IconReceipt } from "@tabler/icons-react";
import { ROUTES } from "@/lib/routes";
import { getDashboardBudgets } from "@/lib/services/budgets.service";
import { getDashboardClients } from "@/lib/services/clients.service";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = { title: "Dashboard | Orçamentos" };

export default async function OrcamentoPage() {
  const [budgets, clients] = await Promise.all([
    getDashboardBudgets(),
    getDashboardClients(),
  ]);
  const hasBudgets = budgets.length > 0;

  return (
    <ContentDashboard>
      {hasBudgets ? (
        <BudgetsTable data={budgets} clients={clients} />
      ) : (
        <EmptyTax
          title="Nenhum orçamento criado."
          description="Crie orçamentos para seus clientes e acompanhe o status de cada proposta."
          icon={IconReceipt}
          linkButton={ROUTES.orcamentos.novo}
          labelButton="Criar Primeiro Orçamento"
        />
      )}
      <Toaster />
    </ContentDashboard>
  );
}
