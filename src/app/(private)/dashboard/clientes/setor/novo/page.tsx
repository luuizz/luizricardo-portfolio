import { Metadata } from "next";
import ContentDashboard from "@/app/(private)/components/ui/content-home";
import SectorForm from "@/app/(private)/components/form/sector/SectorForm";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = { title: "Dashboard | Novo Setor" };

export default function NovoSetorDashboardPage() {
  return (
    <ContentDashboard>
      <SectorForm />
      <Toaster />
    </ContentDashboard>
  );
}
