import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import EmptyTax from "@/app/(private)/components/ui/empty-tax";
import { IconTag } from "@tabler/icons-react";
import { ROUTES } from "@/lib/routes";
import React from "react";
import type { Metadata } from "next";
import ProjectTypeTable from "@table/ProjectTypeTable";
import { getDashboardProjectTypes } from "@/lib/services/project-types.service";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = createDashboardMeta("Tipos de Projeto");

export default async function ListingDashboardProjectsCategories() {
  const types = await getDashboardProjectTypes();
  const hasTypes = types.length > 0;

  return (
    <ContentDashboard>
      {hasTypes ? (
        <ProjectTypeTable data={types} />
      ) : (
        <EmptyTax
          title="Nenhum tipo foi criado no momento."
          description="Você ainda não criou nenhum tipo de projeto. Comece criando no botão abaixo."
          icon={IconTag}
          linkButton={ROUTES.projetos_categorias.novo}
          labelButton="Criar Novo Tipo"
        />
      )}
      <Toaster />
    </ContentDashboard>
  );
}
