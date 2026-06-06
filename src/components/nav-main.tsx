"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { type LucideIcon, ChevronRight, LayoutDashboard } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: { title: string; url: string }[];
  sectionLabel?: string;
}

function isSubActive(url: string, pathname: string) {
  if (url === "#" || !url) return false;
  return pathname === url || pathname.startsWith(url + "/");
}

function isGroupActive(item: NavItem, pathname: string) {
  return item.items?.some((sub) => isSubActive(sub.url, pathname)) ?? false;
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((item) => [item.title, isGroupActive(item, pathname)])),
  );

  useEffect(() => {
    setOpenMap((prev) => {
      const next = { ...prev };
      items.forEach((item) => {
        if (isGroupActive(item, pathname)) next[item.title] = true;
      });
      return next;
    });
  }, [pathname, items]);

  const isHome = pathname === ROUTES.dashboard;

  return (
    <SidebarGroup className="p-0">
      <SidebarMenu className="gap-0 px-2 py-2">
        {/* Dashboard home */}
        <SidebarMenuItem className="mb-1">
          <SidebarMenuButton
            asChild
            isActive={isHome}
            className={cn(
              "h-9 rounded-lg font-medium transition-all",
              isHome
                ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
          >
            <Link href={ROUTES.dashboard}>
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {items.map((item, idx) => {
          const isOpen = openMap[item.title] ?? false;
          const groupActive = isGroupActive(item, pathname);
          const prevItem = items[idx - 1];
          const showSection = item.sectionLabel && item.sectionLabel !== prevItem?.sectionLabel;

          return (
            <div key={item.title}>
              {showSection && (
                <p className="mt-3 mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/35 select-none">
                  {item.sectionLabel}
                </p>
              )}

              <Collapsible
                open={isOpen}
                onOpenChange={(open) =>
                  setOpenMap((prev) => ({ ...prev, [item.title]: open }))
                }
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn(
                        "h-9 w-full rounded-lg transition-all duration-150",
                        isOpen || groupActive
                          ? "bg-sidebar-accent text-sidebar-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                      )}
                    >
                      {item.icon && (
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            groupActive
                              ? "text-sidebar-primary"
                              : "text-sidebar-foreground/50",
                          )}
                        />
                      )}
                      <span className="flex-1 font-medium text-sm">{item.title}</span>
                      <ChevronRight
                        className={cn(
                          "h-3.5 w-3.5 shrink-0 text-sidebar-foreground/30 transition-transform duration-200",
                          isOpen && "rotate-90",
                        )}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <SidebarMenuSub className="mx-0 mt-0.5 border-0 px-0">
                      {item.items?.map((subItem) => {
                        const active = isSubActive(subItem.url, pathname);
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <Link
                              href={subItem.url}
                              className={cn(
                                "flex h-8 w-full items-center gap-2.5 rounded-md pl-8 pr-3 text-sm transition-all duration-150",
                                active
                                  ? "bg-sidebar-primary/20 font-semibold text-sidebar-primary"
                                  : "text-sidebar-foreground/55 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                              )}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                                  active
                                    ? "bg-sidebar-primary"
                                    : "bg-sidebar-foreground/25",
                                )}
                              />
                              {subItem.title}
                            </Link>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </div>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
