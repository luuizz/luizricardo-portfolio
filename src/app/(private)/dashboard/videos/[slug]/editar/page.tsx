import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import { Toaster } from "@/components/ui/sonner";
import VideoForm from "@/app/(private)/components/form/video/VideoForm";
import { getVideoBySlug, getVideoById } from "@/lib/services/videos.service";

export const metadata: Metadata = createDashboardMeta("Editar Vídeo");

export default async function EditarVideoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug) ?? await getVideoById(slug);
  if (!video) notFound();

  return (
    <>
      <VideoForm video={video} />
      <Toaster />
    </>
  );
}
