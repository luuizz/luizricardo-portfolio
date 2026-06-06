import ContentDashboard from "@/app/(private)/components/ui/content-home";
import React from "react";
import { IconFolderCode } from "@tabler/icons-react";
import { ROUTES } from "@/lib/routes";
import EmptyTax from "@/app/(private)/components/ui/empty-tax";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import type { Metadata } from "next";
import ProjectTable from "@table/PrjectsTable";
import { getDashboardProjects } from "@/lib/services/projects.service";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = createDashboardMeta("Todos os projetos");

export default async function DashboardAllProjeto() {
  const projects = await getDashboardProjects();
  const hasProjects = projects.length > 0;

  return (
    <ContentDashboard>
      {hasProjects ? (
        <ProjectTable data={projects} />
      ) : (
        <EmptyTax
          title="Nenhum projeto foi criado no momento."
          description="Você ainda não criou nenhum projeto. Comece criando seu primeiro projeto."
          icon={IconFolderCode}
          linkButton={ROUTES.projetos.novo}
          labelButton="Criar Novo Projeto"
        />
      )}
      <Toaster />
    </ContentDashboard>
  );
}
