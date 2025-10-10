"use client";

import * as React from "react";
import { BookOpen, FileImage, SquareTerminal, VideoIcon } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/lib/routes";

const data = {
  user: {
    name: "Luiz Ricardo",
    email: "contato@luricweb.com.br",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Mídia",
      url: "#",
      icon: FileImage,
      items: [
        {
          title: "Ver Galeria",
          url: ROUTES.midia.root,
        },
        {
          title: "Fazer Upload",
          url: ROUTES.midia.novo,
        },
      ],
    },
    {
      title: "Projetos",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Criar um projeto",
          url: ROUTES.projetos.novo,
        },
        {
          title: "Ver todos os projects",
          url: ROUTES.projetos.root,
        },
        {
          title: "Categorias",
          url: ROUTES.projetos.categorias,
        },
      ],
    },
    {
      title: "Blog",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Criar Novo",
          url: ROUTES.blog.novo,
        },
        {
          title: "Ver todos os Posts",
          url: ROUTES.blog.root,
        },
        {
          title: "Categorias",
          url: ROUTES.blog.categorias,
        },
      ],
    },
    {
      title: "Videos",
      url: "#",
      icon: VideoIcon,
      items: [
        {
          title: "Tutoriais",
          url: ROUTES.videos.tutoriais,
        },
        {
          title: "Canal Youtube",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
