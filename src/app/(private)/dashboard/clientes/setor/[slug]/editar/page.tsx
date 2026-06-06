import ContentDashboard from "@/app/(private)/components/ui/content-home";
import SectorForm from "@/app/(private)/components/form/sector/SectorForm";
import { getSectorBySlug } from "@/lib/services/clients.service";
import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: `Dashboard | Editar Setor: ${slug}` };
}

export default async function EditarSetorDashboardPage({ params }: Props) {
  const { slug } = await params;
  const sector = await getSectorBySlug(slug);

  if (!sector) notFound();

  return (
    <ContentDashboard>
      <SectorForm sector={sector} />
      <Toaster />
    </ContentDashboard>
  );
}
