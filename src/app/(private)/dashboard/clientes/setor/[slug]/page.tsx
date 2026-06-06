import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { getSectorBySlug } from "@/lib/services/clients.service";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/app/shared/utils/format-date";
import { ROUTES } from "@/lib/routes";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: `Dashboard | Setor: ${slug}` };
}

export default async function ViewSetorDashboardPage({ params }: Props) {
  const { slug } = await params;
  const sector = await getSectorBySlug(slug);

  if (!sector) notFound();

  return (
    <ContentDashboard>
      <div className="max-w-xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-inter text-3xl font-bold">{sector.name}</h1>
            <p className="text-sm text-muted-foreground">/{sector.slug}</p>
          </div>
          <Button asChild variant="outline">
            <Link href={`${ROUTES.clientes.setor}/${sector.slug}/editar`}>Editar</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Criado em {formatDate(sector.created_at)}
        </p>
      </div>
    </ContentDashboard>
  );
}
