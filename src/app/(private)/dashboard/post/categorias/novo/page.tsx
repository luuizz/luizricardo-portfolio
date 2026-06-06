import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import CategoryForm from "@/app/(private)/components/form/category/CategoryForm";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

export const metadata: Metadata = createDashboardMeta("Criar Nova Categoria");

export default function CreateCategoryPost() {
  return (
    <ContentDashboard>
      <CategoryForm />
      <Toaster />
    </ContentDashboard>
  );
}
