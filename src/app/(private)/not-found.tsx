"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { FileQuestion, ArrowLeft, LayoutDashboard } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 py-16">

      {/* Background number */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute select-none font-bold leading-none text-muted-foreground/5"
        style={{ fontSize: "clamp(140px, 20vw, 240px)" }}
      >
        404
      </p>

      <div className="relative z-10 flex max-w-sm flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border bg-muted/50">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>

        <h1 className="text-2xl font-semibold">Página não encontrada</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Esta rota não existe no painel. Talvez o endereço tenha mudado
          ou o item foi removido.
        </p>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-border" />

        <div className="flex flex-col gap-2 w-full sm:flex-row">
          <Link
            href={ROUTES.dashboard}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <LayoutDashboard className="h-4 w-4" />
            Ir ao Dashboard
          </Link>
          <button
            onClick={() => history.back()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
          {[
            { href: ROUTES.blog.root, label: "Posts" },
            { href: ROUTES.projetos.root, label: "Projetos" },
            { href: ROUTES.clientes.root, label: "Clientes" },
            { href: ROUTES.midia.root, label: "Mídia" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
