import type { Metadata } from "next";
import ContentDashboard from "@/app/(private)/components/ui/content-home";
import { createDashboardMeta } from "@/app/shared/utils/create-metadata";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  User,
  Mail,
  Shield,
  Bell,
  ExternalLink,
  Database,
  ImageIcon,
  FileText,
  FolderKanban,
} from "lucide-react";

export const metadata: Metadata = createDashboardMeta("Configurações");

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [postsRes, projectsRes, mediaRes] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact" }).is("deleted_at", null),
    supabase.from("projects").select("id", { count: "exact" }).is("deleted_at", null),
    supabase.from("media").select("id", { count: "exact" }).is("deleted_at", null),
  ]);

  const stats = [
    { label: "Posts", value: postsRes.count ?? 0, icon: FileText },
    { label: "Projetos", value: projectsRes.count ?? 0, icon: FolderKanban },
    { label: "Mídias", value: mediaRes.count ?? 0, icon: ImageIcon },
  ];

  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";

  return (
    <ContentDashboard>
      <div className="max-w-3xl space-y-8">
        <div>
          <h1 className="font-inter text-2xl font-bold">Configurações</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie sua conta e preferências do sistema.
          </p>
        </div>

        {/* Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" /> Perfil
            </CardTitle>
            <CardDescription>Informações da sua conta Supabase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                {user?.email?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div>
                <p className="font-medium">{user?.email ?? "—"}</p>
                <p className="text-xs text-muted-foreground">Conta criada em {createdAt}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> E-mail
                </p>
                <p className="font-medium">{user?.email ?? "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" /> Status
                </p>
                <Badge variant="default">Autenticado</Badge>
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://app.supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-3.5 w-3.5" />
                  Gerenciar no Supabase
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resumo do conteúdo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" /> Resumo do Conteúdo
            </CardTitle>
            <CardDescription>Visão geral dos dados armazenados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-lg border p-4 text-center">
                  <Icon className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Banco de dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" /> Banco de Dados
            </CardTitle>
            <CardDescription>
              Informações sobre migrações e estrutura do banco.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Execute a migration abaixo no SQL Editor do Supabase para habilitar
              o soft delete e as novas tabelas (clientes, setores, orçamentos).
            </p>
            <div className="rounded-lg border bg-muted/50 p-3 font-mono text-xs text-muted-foreground">
              supabase/migrations/001_add_soft_delete.sql
            </div>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://app.supabase.com/project/veqexzgnvuzjxoncwaoi/sql"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                Abrir SQL Editor
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" /> Notificações
            </CardTitle>
            <CardDescription>Preferências de notificação — em breve.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configurações de e-mail e alertas estarão disponíveis em uma próxima versão.
            </p>
          </CardContent>
        </Card>
      </div>
    </ContentDashboard>
  );
}
