import { Metadata } from "next";
import ContentDashboard from "@/app/(private)/components/ui/content-home";
import SectorsTable from "@table/SectorsTable";
import EmptyTax from "@/app/(private)/components/ui/empty-tax";
import { IconBuildingCommunity } from "@tabler/icons-react";
import { ROUTES } from "@/lib/routes";
import { getDashboardSectors } from "@/lib/services/clients.service";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = { title: "Dashboard | Setores" };

export default async function SetorDashboardPage() {
  const sectors = await getDashboardSectors();
  const hasSectors = sectors.length > 0;

  return (
    <ContentDashboard>
      {hasSectors ? (
        <SectorsTable data={sectors} />
      ) : (
        <EmptyTax
          title="Nenhum setor cadastrado."
          description="Cadastre setores para organizar seus clientes por área de atuação."
          icon={IconBuildingCommunity}
          linkButton={ROUTES.clientes.setor_novo}
          labelButton="Criar Primeiro Setor"
        />
      )}
      <Toaster />
    </ContentDashboard>
  );
}
