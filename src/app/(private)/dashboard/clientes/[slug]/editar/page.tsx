import type { Metadata } from "next";
import ContentDashboard from "@/app/(private)/components/ui/content-home";
import ClientForm from "@/app/(private)/components/form/client/ClientForm";
import { getClientBySlug, getDashboardSectors } from "@/lib/services/clients.service";
import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Dashboard | Editar Cliente: ${slug}` };
}

export default async function EditarClientePage({ params }: Props) {
  const { slug } = await params;
  const [client, sectors] = await Promise.all([
    getClientBySlug(slug),
    getDashboardSectors(),
  ]);

  if (!client) notFound();

  return (
    <ContentDashboard>
      <ClientForm client={client} sectors={sectors} />
      <Toaster />
    </ContentDashboard>
  );
}
