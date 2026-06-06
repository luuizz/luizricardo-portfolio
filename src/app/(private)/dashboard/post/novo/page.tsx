import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import PostForm from "@/app/(private)/components/form/post/PostForm";
import { Toaster } from "@/components/ui/sonner";
import { getDashboardCategories } from "@/lib/services/categories.service";
import type { Metadata } from "next";

export const metadata: Metadata = createDashboardMeta("Criar Novo Post");

export default async function CreateNewPost() {
  const categories = await getDashboardCategories();

  return (
    <ContentDashboard>
      <PostForm categories={categories} />
      <Toaster />
    </ContentDashboard>
  );
}
