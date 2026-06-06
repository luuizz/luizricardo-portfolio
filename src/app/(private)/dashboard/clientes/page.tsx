import { Metadata } from "next";
import ContentDashboard from "@/app/(private)/components/ui/content-home";
import ClientsTable from "@table/ClientsTable";
import EmptyTax from "@/app/(private)/components/ui/empty-tax";
import { IconUsers } from "@tabler/icons-react";
import { ROUTES } from "@/lib/routes";
import { getDashboardClients, getDashboardSectors } from "@/lib/services/clients.service";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = { title: "Dashboard | Clientes" };

export default async function ClientDashboardPage() {
  const [clients, sectors] = await Promise.all([
    getDashboardClients(),
    getDashboardSectors(),
  ]);
  const hasClients = clients.length > 0;

  return (
    <ContentDashboard>
      {hasClients ? (
        <ClientsTable data={clients} sectors={sectors} />
      ) : (
        <EmptyTax
          title="Nenhum cliente cadastrado."
          description="Adicione seu primeiro cliente para começar a gerenciar seus relacionamentos."
          icon={IconUsers}
          linkButton={ROUTES.clientes.novo}
          labelButton="Cadastrar Primeiro Cliente"
        />
      )}
      <Toaster />
    </ContentDashboard>
  );
}
