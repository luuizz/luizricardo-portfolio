import type { Metadata } from "next";
import Link from "next/link";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { ROUTES } from "@/lib/routes";
import { getVideos } from "@/lib/services/videos.service";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Clock, Youtube } from "lucide-react";
import { DeleteVideoButton } from "@/app/(private)/dashboard/videos/_components/DeleteVideoButton";

export const metadata: Metadata = createDashboardMeta("Tutoriais");

export default async function TutoriaisPage() {
  const videos = await getVideos("tutorial");

  return (
    <>
      <ContentDashboard>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Tutoriais</h2>
              <p className="text-sm text-muted-foreground">{videos.length} tutorial(is) cadastrado(s)</p>
            </div>
            <Button asChild size="sm">
              <Link href={ROUTES.videos.novo}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Tutorial
              </Link>
            </Button>
          </div>

          {videos.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Youtube className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Nenhum tutorial ainda</p>
                <p className="text-sm text-muted-foreground">
                  Crie um novo vídeo e defina a categoria como "Tutorial".
                </p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href={ROUTES.videos.novo}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar tutorial
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Youtube className="h-10 w-10 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
                        <Play className="h-5 w-5 fill-white text-white" />
                      </div>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                        <Clock className="h-3 w-3" />
                        {video.duration}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <Badge variant={video.status === "published" ? "default" : "secondary"} className="mb-2 text-xs">
                      {video.status === "published" ? "Publicado" : "Rascunho"}
                    </Badge>
                    <h3 className="line-clamp-2 font-semibold leading-snug">{video.title}</h3>
                    {video.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {video.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-2">
                      <Button asChild size="sm" variant="outline" className="flex-1 h-8 text-xs">
                        <Link href={`${ROUTES.videos.root}/${video.slug ?? video.id}/editar`}>
                          Editar
                        </Link>
                      </Button>
                      <DeleteVideoButton id={video.id} title={video.title} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ContentDashboard>
      <Toaster />
    </>
  );
}
