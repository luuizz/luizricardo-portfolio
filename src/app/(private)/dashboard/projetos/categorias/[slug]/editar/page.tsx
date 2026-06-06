import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import ProjectTypeForm from "@/app/(private)/components/form/project-type/ProjectTypeForm";
import { Toaster } from "@/components/ui/sonner";
import { getProjectTypeBySlug } from "@/lib/services/project-types.service";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return createDashboardMeta(`Editar Tipo: ${slug}`);
}

export default async function EditCategoryProject({ params }: Props) {
  const { slug } = await params;
  const projectType = await getProjectTypeBySlug(slug);

  if (!projectType) notFound();

  return (
    <ContentDashboard>
      <ProjectTypeForm projectType={projectType} />
      <Toaster />
    </ContentDashboard>
  );
}
