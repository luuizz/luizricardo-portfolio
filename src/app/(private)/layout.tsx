import React from "react";
import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import LayoutSidebarDashboard from "@/app/(private)/components/ui/sidebar-dashboard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <LayoutSidebarDashboard>{children}</LayoutSidebarDashboard>
    </SidebarProvider>
  );
}
