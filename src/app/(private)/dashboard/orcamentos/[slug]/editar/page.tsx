import ContentDashboard from "@/app/(private)/components/ui/content-home";
import BudgetForm from "@/app/(private)/components/form/budget/BudgetForm";
import { getBudgetById } from "@/lib/services/budgets.service";
import { getDashboardClients } from "@/lib/services/clients.service";
import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: `Dashboard | Editar Orçamento: ${slug}` };
}

export default async function EditarOrcamentoPage({ params }: Props) {
  const { slug } = await params;
  const [budget, clients] = await Promise.all([
    getBudgetById(slug),
    getDashboardClients(),
  ]);

  if (!budget) notFound();

  return (
    <ContentDashboard>
      <BudgetForm budget={budget} clients={clients} />
      <Toaster />
    </ContentDashboard>
  );
}
