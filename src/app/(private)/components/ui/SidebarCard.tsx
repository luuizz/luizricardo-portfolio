"use client";

import { cn } from "@/lib/utils";

interface SidebarCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function SidebarCard({ title, children, className }: SidebarCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card text-card-foreground", className)}>
      {title && (
        <div className="border-b px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
        </div>
      )}
      <div className="space-y-3 p-4">{children}</div>
    </div>
  );
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft:     { label: "Rascunho",  color: "bg-zinc-400" },
  published: { label: "Publicado", color: "bg-emerald-500" },
  archived:  { label: "Arquivado", color: "bg-amber-500" },
  scheduled: { label: "Agendado",  color: "bg-blue-500" },
  active:    { label: "Ativo",     color: "bg-emerald-500" },
  inactive:  { label: "Inativo",   color: "bg-zinc-400" },
  sent:      { label: "Enviado",   color: "bg-blue-500" },
  approved:  { label: "Aprovado",  color: "bg-emerald-500" },
  rejected:  { label: "Rejeitado", color: "bg-red-500" },
};

export function StatusDot({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "bg-zinc-400" };
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full", cfg.color)} />
      <span className="text-sm">{cfg.label}</span>
    </span>
  );
}

export function SidebarField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

export function SidebarDate({ label, value }: { label: string; value?: string | null }) {
  const formatted = value
    ? new Date(value).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <SidebarField label={label}>
      <p className="text-sm">{formatted}</p>
    </SidebarField>
  );
}
