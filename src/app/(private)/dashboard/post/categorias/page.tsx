import React from "react";
import type { Metadata } from "next";
import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import { ROUTES } from "@/lib/routes";
import EmptyTax from "@/app/(private)/components/ui/empty-tax";
import { IconTag } from "@tabler/icons-react";
import CategoryPostTable from "@table/CategoryPostTable";
import { getDashboardCategories } from "@/lib/services/categories.service";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = createDashboardMeta("Todas as Categorias");

export default async function ListingCategoriesPost() {
  const categories = await getDashboardCategories();
  const hasCategories = categories.length > 0;

  return (
    <ContentDashboard>
      {hasCategories ? (
        <CategoryPostTable data={categories} />
      ) : (
        <EmptyTax
          title="Nenhuma categoria foi criada no momento."
          description="Você ainda não criou nenhuma categoria. Comece criando no botão abaixo."
          icon={IconTag}
          linkButton={ROUTES.blog_categorias.novo}
          labelButton="Criar Nova Categoria"
        />
      )}
      <Toaster />
    </ContentDashboard>
  );
}
