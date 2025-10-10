import { Metadata } from "next";
import ContentDashboard from "@/app/(private)/components/ui/content-home";

export const metadata: Metadata = {
  title: "Dashboard | Home",
};

export default function DashboardPage() {
  return <ContentDashboard showPlaceholders />;
}
