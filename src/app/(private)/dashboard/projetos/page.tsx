import { Metadata } from "next";
import ContentDashboard from "@/app/(private)/components/ui/content-home";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard | Todos os projetos",
};

export default function DashboardAllProjeto() {
  return <ContentDashboard showPlaceholders />;
}
