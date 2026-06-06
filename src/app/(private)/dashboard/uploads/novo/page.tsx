import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createDashboardMeta("Upload de Mídia");

export default function CreateNewUpload() {
  return <ContentDashboard showPlaceholders={true} />;
}
