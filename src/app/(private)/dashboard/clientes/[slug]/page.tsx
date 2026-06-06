import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { getClientBySlug, getDashboardSectors } from "@/lib/services/clients.service";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/app/shared/utils/format-date";
import { ROUTES } from "@/lib/routes";
import { Mail, Phone, Building2, FileText } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: `Dashboard | Cliente: ${slug}` };
}

export default async function ViewClientePage({ params }: Props) {
  const { slug } = await params;
  const [client, sectors] = await Promise.all([
    getClientBySlug(slug),
    getDashboardSectors(),
  ]);

  if (!client) notFound();

  const sectorName = client.sector_id
    ? sectors.find((s) => s.id === client.sector_id)?.name
    : null;

  return (
    <ContentDashboard>
      <div className="max-w-2xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-inter text-3xl font-bold">{client.name}</h1>
            {client.company && (
              <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                <Building2 className="h-4 w-4" /> {client.company}
              </p>
            )}
          </div>
          <Button asChild variant="outline">
            <Link href={`${ROUTES.clientes.root}/${client.id}/editar`}>Editar</Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={client.status === "active" ? "default" : "secondary"}>
            {client.status === "active" ? "Ativo" : "Inativo"}
          </Badge>
          {sectorName && <Badge variant="outline">{sectorName}</Badge>}
          <span className="text-sm text-muted-foreground">
            Cadastrado em {formatDate(client.created_at)}
          </span>
        </div>

        <div className="space-y-3 rounded-lg border p-4">
          {client.email && (
            <p className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
            </p>
          )}
          {client.phone && (
            <p className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${client.phone}`} className="hover:underline">{client.phone}</a>
            </p>
          )}
          {client.notes && (
            <div className="flex items-start gap-2 text-sm">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground">{client.notes}</p>
            </div>
          )}
        </div>
      </div>
    </ContentDashboard>
  );
}
