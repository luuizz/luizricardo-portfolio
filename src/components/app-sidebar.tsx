"use client";

import * as React from "react";
import {
  BookOpen,
  BookText,
  BookUser,
  FileImage,
  FolderKanban,
  Settings,
  Video,
} from "lucide-react";

import { NavMain, type NavItem } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/lib/routes";

const navItems: NavItem[] = [
  {
    sectionLabel: "Conteúdo",
    title: "Projetos",
    url: ROUTES.projetos.root,
    icon: FolderKanban,
    items: [
      { title: "Novo Projeto", url: ROUTES.projetos.novo },
      { title: "Ver Projetos", url: ROUTES.projetos.root },
      { title: "Tipos de Projeto", url: ROUTES.projetos.categorias },
    ],
  },
  {
    sectionLabel: "Conteúdo",
    title: "Blog",
    url: ROUTES.blog.root,
    icon: BookOpen,
    items: [
      { title: "Novo Post", url: ROUTES.blog.novo },
      { title: "Ver Posts", url: ROUTES.blog.root },
      { title: "Categorias", url: ROUTES.blog.categorias },
    ],
  },
  {
    sectionLabel: "Conteúdo",
    title: "Vídeos",
    url: ROUTES.videos.root,
    icon: Video,
    items: [
      { title: "Todos os Vídeos", url: ROUTES.videos.root },
      { title: "Novo Vídeo", url: ROUTES.videos.novo },
      { title: "Tutoriais", url: ROUTES.videos.tutoriais },
    ],
  },
  {
    sectionLabel: "Gestão",
    title: "Clientes",
    url: ROUTES.clientes.root,
    icon: BookUser,
    items: [
      { title: "Novo Cliente", url: ROUTES.clientes.novo },
      { title: "Ver Clientes", url: ROUTES.clientes.root },
      { title: "Setores", url: ROUTES.clientes.setor },
    ],
  },
  {
    sectionLabel: "Gestão",
    title: "Orçamentos",
    url: ROUTES.orcamentos.root,
    icon: BookText,
    items: [
      { title: "Novo Orçamento", url: ROUTES.orcamentos.novo },
      { title: "Ver Orçamentos", url: ROUTES.orcamentos.root },
    ],
  },
  {
    sectionLabel: "Gestão",
    title: "Biblioteca de Mídia",
    url: ROUTES.midia.root,
    icon: FileImage,
    items: [
      { title: "Galeria", url: ROUTES.midia.root },
      { title: "Fazer Upload", url: ROUTES.midia.novo },
    ],
  },
  {
    sectionLabel: "Sistema",
    title: "Configurações",
    url: ROUTES.settings,
    icon: Settings,
    items: [{ title: "Conta & Sistema", url: ROUTES.settings }],
  },
];

const user = {
  name: "Luiz Ricardo",
  email: "contato@luricweb.com.br",
  avatar: "/avatars/shadcn.jpg",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="pt-0">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter />
    </Sidebar>
  );
}
