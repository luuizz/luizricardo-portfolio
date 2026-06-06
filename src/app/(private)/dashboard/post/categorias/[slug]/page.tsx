import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { getCategoryBySlug } from "@/lib/services/categories.service";
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
  return { title: `Dashboard | Categoria: ${slug}` };
}

export default async function ViewCategoryPost({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  const STATUS_LABEL: Record<string, string> = {
    published: "Publicado",
    draft: "Rascunho",
    scheduled: "Agendado",
  };

  return (
    <ContentDashboard>
      <div className="max-w-xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-inter text-3xl font-bold">{category.name}</h1>
            <p className="text-sm text-muted-foreground">/{category.slug}</p>
          </div>
          <Button asChild variant="outline">
            <Link href={`${ROUTES.blog_categorias.root}${category.slug}/editar`}>Editar</Link>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Badge>{STATUS_LABEL[category.status] ?? category.status}</Badge>
          <span className="text-sm text-muted-foreground">
            Criado em {formatDate(category.created_at)}
          </span>
        </div>
      </div>
    </ContentDashboard>
  );
}
