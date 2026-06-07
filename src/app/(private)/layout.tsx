import React from "react";
import "../globals.css";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import LayoutSidebarDashboard from "@/app/(private)/components/ui/sidebar-dashboard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <SidebarProvider>
      <LayoutSidebarDashboard>{children}</LayoutSidebarDashboard>
    </SidebarProvider>
  );
}
