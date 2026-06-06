import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { getPostBySlug } from "@/lib/services/posts.service";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/app/shared/utils/format-date";
import { ROUTES } from "@/lib/routes";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Dashboard | Post: ${slug}` };
}

export default async function ViewPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const STATUS_LABEL: Record<string, string> = {
    published: "Publicado",
    draft: "Rascunho",
    scheduled: "Agendado",
  };

  return (
    <ContentDashboard>
      <div className="max-w-3xl space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="font-inter text-3xl font-bold">{post.title}</h1>
            <p className="text-sm text-muted-foreground">/{post.slug}</p>
          </div>
          <Button asChild variant="outline">
            <Link href={`${ROUTES.blog.root}/${post.slug}/editar`}>Editar</Link>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Badge>{STATUS_LABEL[post.status] ?? post.status}</Badge>
          {post.categories && (
            <Badge variant="outline">{post.categories.name}</Badge>
          )}
          <span className="text-sm text-muted-foreground">
            Criado em {formatDate(post.created_at)}
          </span>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium text-muted-foreground">Resumo</p>
          <p className="mt-1">{post.excerpt}</p>
        </div>
      </div>
    </ContentDashboard>
  );
}
