"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  VideoIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"; // This is sample data.

// This is sample data.
const data = {
  user: {
    name: "Luiz Ricardo",
    email: "contato@luricweb.com.br",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Luric.web Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Luric.web Corp",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Projetos",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Criar um projeto",
          url: "#",
        },
        {
          title: "Ver todos os projetos",
          url: "#",
        },
        {
          title: "Categorias",
          url: "#",
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
          url: "#",
        },
        {
          title: "Ver todos os Posts",
          url: "#",
        },
        {
          title: "Categorias",
          url: "#",
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
          url: "#",
        },
        {
          title: "Canal Youtube",
          url: "#",
        },
      ],
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
