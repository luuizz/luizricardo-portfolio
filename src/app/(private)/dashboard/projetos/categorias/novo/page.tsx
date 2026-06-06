import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import ProjectTypeForm from "@/app/(private)/components/form/project-type/ProjectTypeForm";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

export const metadata: Metadata = createDashboardMeta("Criar Tipo de Projeto");

export default function CreateCategoryProject() {
  return (
    <ContentDashboard>
      <ProjectTypeForm />
      <Toaster />
    </ContentDashboard>
  );
}
