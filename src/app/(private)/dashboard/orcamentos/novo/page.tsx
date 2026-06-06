import { Metadata } from "next";
import ContentDashboard from "@/app/(private)/components/ui/content-home";
import BudgetForm from "@/app/(private)/components/form/budget/BudgetForm";
import { getDashboardClients } from "@/lib/services/clients.service";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = { title: "Dashboard | Novo Orçamento" };

export default async function NovoOrcamentoPage() {
  const clients = await getDashboardClients();
  return (
    <ContentDashboard>
      <BudgetForm clients={clients} />
      <Toaster />
    </ContentDashboard>
  );
}
