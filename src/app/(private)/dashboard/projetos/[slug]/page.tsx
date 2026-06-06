import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { getProjectBySlug } from "@/lib/services/projects.service";
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
  return { title: `Dashboard | Projeto: ${slug}` };
}

export default async function ViewPageProject({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const STATUS_LABEL: Record<string, string> = {
    published: "Publicado",
    draft: "Rascunho",
    archived: "Arquivado",
  };

  const types = project.project_type_relations
    ?.map((r) => r.project_types?.name)
    .filter(Boolean);

  return (
    <ContentDashboard>
      <div className="max-w-3xl space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="font-inter text-3xl font-bold">{project.title}</h1>
            <p className="text-sm text-muted-foreground">/{project.slug}</p>
          </div>
          <Button asChild variant="outline">
            <Link href={`${ROUTES.projetos.root}/${project.slug}/editar`}>Editar</Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge>{STATUS_LABEL[project.status] ?? project.status}</Badge>
          {types?.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
          <span className="text-sm text-muted-foreground">
            Criado em {formatDate(project.created_at)}
          </span>
        </div>

        {project.summary && (
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">Resumo</p>
            <p className="mt-1">{project.summary}</p>
          </div>
        )}

        {(project.start_date || project.end_date) && (
          <div className="flex gap-6 text-sm">
            {project.start_date && (
              <div>
                <p className="text-muted-foreground">Início</p>
                <p>{formatDate(project.start_date)}</p>
              </div>
            )}
            {project.end_date && (
              <div>
                <p className="text-muted-foreground">Término</p>
                <p>{formatDate(project.end_date)}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </ContentDashboard>
  );
}
