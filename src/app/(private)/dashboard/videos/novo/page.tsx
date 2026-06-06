import type { Metadata } from "next";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import { Toaster } from "@/components/ui/sonner";
import VideoForm from "@/app/(private)/components/form/video/VideoForm";

export const metadata: Metadata = createDashboardMeta("Novo Vídeo");

export default function NovoVideoPage() {
  return (
    <>
      <VideoForm />
      <Toaster />
    </>
  );
}
