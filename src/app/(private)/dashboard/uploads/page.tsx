import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import type { Metadata } from "next";
import { getDashboardMedia } from "@/lib/services/media.service";
import MediaLibrary from "@/app/(private)/components/media/MediaLibrary";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = createDashboardMeta("Biblioteca de Mídia");

export default async function UploadPage() {
  const media = await getDashboardMedia();

  return (
    <ContentDashboard>
      <div className="mb-6">
        <h1 className="font-inter text-2xl font-bold">Biblioteca de Mídia</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {media.length} arquivo(s) · Clique para selecionar, Shift+clique para seleção múltipla
        </p>
      </div>

      <MediaLibrary initialItems={media} />
      <Toaster />
    </ContentDashboard>
  );
}
