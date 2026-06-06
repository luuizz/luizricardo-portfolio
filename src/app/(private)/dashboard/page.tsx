import { Metadata } from "next";
import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/app/shared/utils/format-date";
import { ROUTES } from "@/lib/routes";
import {
  FileText,
  FolderKanban,
  ImageIcon,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = { title: "Dashboard | Home" };

async function getDashboardStats() {
  const supabase = await createSupabaseServerClient();

  const [postsRes, projectsRes, mediaRes, categoriesRes] = await Promise.all([
    supabase.from("posts").select("id, title, slug, status, created_at", { count: "exact" }).is("deleted_at", null).order("created_at", { ascending: false }).limit(5),
    supabase.from("projects").select("id, title, slug, status, created_at", { count: "exact" }).is("deleted_at", null).order("created_at", { ascending: false }).limit(5),
    supabase.from("media").select("id", { count: "exact" }).is("deleted_at", null),
    supabase.from("categories").select("id", { count: "exact" }).is("deleted_at", null),
  ]);

  return {
    posts: { count: postsRes.count ?? 0, recent: postsRes.data ?? [] },
    projects: { count: projectsRes.count ?? 0, recent: projectsRes.data ?? [] },
    media: { count: mediaRes.count ?? 0 },
    categories: { count: categoriesRes.count ?? 0 },
  };
}

const STATUS_BADGE: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  published: { label: "Publicado", variant: "default" },
  draft: { label: "Rascunho", variant: "secondary" },
  scheduled: { label: "Agendado", variant: "outline" },
  archived: { label: "Arquivado", variant: "outline" },
};

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Posts",
      value: stats.posts.count,
      icon: FileText,
      href: ROUTES.blog.root,
      newHref: ROUTES.blog.novo,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Projetos",
      value: stats.projects.count,
      icon: FolderKanban,
      href: ROUTES.projetos.root,
      newHref: ROUTES.projetos.novo,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Mídias",
      value: stats.media.count,
      icon: ImageIcon,
      href: ROUTES.midia.root,
      newHref: ROUTES.midia.novo,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Categorias",
      value: stats.categories.count,
      icon: Users,
      href: ROUTES.blog.categorias,
      newHref: ROUTES.blog_categorias.novo,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <ContentDashboard>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-inter text-2xl font-bold">Bem-vindo, Luiz Ricardo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Aqui está um resumo do seu conteúdo.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${card.bg}`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{card.value}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs">
                      <Link href={card.href}>
                        Ver todos <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="h-7 px-2 text-xs">
                      <Link href={card.newHref}>
                        <Plus className="mr-1 h-3 w-3" /> Novo
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Ações rápidas
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link href={ROUTES.blog.novo}>
                <Plus className="mr-2 h-4 w-4" /> Novo Post
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={ROUTES.projetos.novo}>
                <Plus className="mr-2 h-4 w-4" /> Novo Projeto
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={ROUTES.midia.root}>
                <ImageIcon className="mr-2 h-4 w-4" /> Upload de Mídia
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={ROUTES.clientes.novo}>
                <Users className="mr-2 h-4 w-4" /> Novo Cliente
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={ROUTES.orcamentos.novo}>
                <TrendingUp className="mr-2 h-4 w-4" /> Novo Orçamento
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Posts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Posts Recentes</CardTitle>
              <Button asChild size="sm" variant="ghost">
                <Link href={ROUTES.blog.root}>Ver todos</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.posts.recent.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Nenhum post criado ainda.
                </p>
              ) : (
                stats.posts.recent.map((post) => {
                  const s = STATUS_BADGE[post.status] ?? { label: post.status, variant: "outline" as const };
                  return (
                    <Link
                      key={post.id}
                      href={`${ROUTES.blog.root}/${post.slug}/editar`}
                      className="flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{post.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(post.created_at)}</p>
                      </div>
                      <Badge variant={s.variant} className="shrink-0 text-xs">
                        {s.label}
                      </Badge>
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Projetos Recentes</CardTitle>
              <Button asChild size="sm" variant="ghost">
                <Link href={ROUTES.projetos.root}>Ver todos</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.projects.recent.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Nenhum projeto criado ainda.
                </p>
              ) : (
                stats.projects.recent.map((project) => {
                  const s = STATUS_BADGE[project.status] ?? { label: project.status, variant: "outline" as const };
                  return (
                    <Link
                      key={project.id}
                      href={`${ROUTES.projetos.root}/${project.slug}/editar`}
                      className="flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{project.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(project.created_at)}</p>
                      </div>
                      <Badge variant={s.variant} className="shrink-0 text-xs">
                        {s.label}
                      </Badge>
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentDashboard>
  );
}
