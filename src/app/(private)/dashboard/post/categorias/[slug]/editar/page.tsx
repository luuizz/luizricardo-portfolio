import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import CategoryForm from "@/app/(private)/components/form/category/CategoryForm";
import { Toaster } from "@/components/ui/sonner";
import { getCategoryBySlug } from "@/lib/services/categories.service";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return createDashboardMeta(`Editar Categoria: ${slug}`);
}

export default async function EditCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  return (
    <ContentDashboard>
      <CategoryForm category={category} />
      <Toaster />
    </ContentDashboard>
  );
}
