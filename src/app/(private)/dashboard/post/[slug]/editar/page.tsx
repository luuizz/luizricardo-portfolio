import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import PostForm from "@/app/(private)/components/form/post/PostForm";
import { Toaster } from "@/components/ui/sonner";
import { getPostForEdit } from "@/lib/services/posts.service";
import { getDashboardCategories } from "@/lib/services/categories.service";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return createDashboardMeta(`Editar: ${slug}`);
}

export default async function EditPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, categories] = await Promise.all([
    getPostForEdit(slug),
    getDashboardCategories(),
  ]);

  if (!post) notFound();

  return (
    <ContentDashboard>
      <PostForm post={post} categories={categories} />
      <Toaster />
    </ContentDashboard>
  );
}
