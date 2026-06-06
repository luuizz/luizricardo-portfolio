import React from "react";
import type { Metadata } from "next";
import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { ROUTES } from "@/lib/routes";
import EmptyTax from "@/app/(private)/components/ui/empty-tax";
import { IconFolderCode } from "@tabler/icons-react";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import { Toaster } from "@/components/ui/sonner";
import { getDashboardPosts } from "@/lib/services/posts.service";
import { PostsTable } from "@table/PostsTable";

export const metadata: Metadata = createDashboardMeta("Todos os Posts");

export default async function DashboardBlog() {
  const posts = await getDashboardPosts();

  const hasPosts = Array.isArray(posts) && posts.length > 0;

  return (
    <>
      <ContentDashboard>
        {hasPosts ? (
          <PostsTable data={posts} />
        ) : (
          <EmptyTax
            title={"Nenhuma publicação foi criada no momento."}
            description={
              "Você ainda não criou nenhuma publicação. Comece criando sua primeira publicação."
            }
            icon={IconFolderCode}
            linkButton={ROUTES.blog.novo}
            labelButton={"Criar Nova Postagem"}
          />
        )}
      </ContentDashboard>
      <Toaster />
    </>
  );
}
