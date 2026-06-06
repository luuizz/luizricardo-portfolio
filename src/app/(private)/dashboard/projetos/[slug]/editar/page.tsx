import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import ProjectForm from "@/app/(private)/components/form/project/ProjectForm";
import { Toaster } from "@/components/ui/sonner";
import { getProjectForEdit } from "@/lib/services/projects.service";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return createDashboardMeta(`Editar Projeto: ${slug}`);
}

export default async function EditProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectForEdit(slug);

  if (!project) notFound();

  return (
    <ContentDashboard>
      <ProjectForm project={project} />
      <Toaster />
    </ContentDashboard>
  );
}
