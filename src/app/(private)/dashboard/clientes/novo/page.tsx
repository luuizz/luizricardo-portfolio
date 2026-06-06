import { Metadata } from "next";
import ContentDashboard from "@/app/(private)/components/ui/content-home";
import ClientForm from "@/app/(private)/components/form/client/ClientForm";
import { getDashboardSectors } from "@/lib/services/clients.service";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = { title: "Dashboard | Novo Cliente" };

export default async function NovoClientePage() {
  const sectors = await getDashboardSectors();
  return (
    <ContentDashboard>
      <ClientForm sectors={sectors} />
      <Toaster />
    </ContentDashboard>
  );
}
