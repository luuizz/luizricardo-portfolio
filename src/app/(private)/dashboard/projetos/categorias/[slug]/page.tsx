import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { getProjectTypeBySlug } from "@/lib/services/project-types.service";
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
  return { title: `Dashboard | Tipo: ${slug}` };
}

export default async function ViewCategoryProject({ params }: Props) {
  const { slug } = await params;
  const type = await getProjectTypeBySlug(slug);

  if (!type) notFound();

  return (
    <ContentDashboard>
      <div className="max-w-xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-inter text-3xl font-bold">{type.name}</h1>
            <p className="text-sm text-muted-foreground">/{type.slug}</p>
          </div>
          <Button asChild variant="outline">
            <Link href={`${ROUTES.projetos_categorias.root}/${type.slug}/editar`}>Editar</Link>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Badge>{type.status}</Badge>
          <span className="text-sm text-muted-foreground">
            Criado em {formatDate(type.created_at)}
          </span>
        </div>
      </div>
    </ContentDashboard>
  );
}
