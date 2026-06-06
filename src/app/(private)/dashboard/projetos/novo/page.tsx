import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import ProjectForm from "@/app/(private)/components/form/project/ProjectForm";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

export const metadata: Metadata = createDashboardMeta("Criar Novo Projeto");

export default function NewProjectPage() {
  return (
    <ContentDashboard>
      <ProjectForm />
      <Toaster />
    </ContentDashboard>
  );
}
