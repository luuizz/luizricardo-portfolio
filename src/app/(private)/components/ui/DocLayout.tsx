"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocLayoutProps {
  title: string;
  backHref: string;
  backLabel?: string;
  loading?: boolean;
  submitLabel?: string;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DocLayout({
  title,
  backHref,
  backLabel = "Voltar",
  loading,
  submitLabel = "Salvar",
  sidebar,
  children,
  className,
}: DocLayoutProps) {
  return (
    <div className={cn("flex flex-col gap-0", className)}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 shrink-0">
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="font-inter text-xl font-semibold leading-tight">{title}</h1>
        </div>
        <Button type="submit" disabled={loading} size="sm">
          {loading ? "Salvando..." : submitLabel}
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-5">{children}</div>
        <aside className="space-y-4">{sidebar}</aside>
      </div>
    </div>
  );
}
