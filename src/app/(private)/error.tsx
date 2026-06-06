"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 py-16">

      {/* Background text */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute select-none font-bold leading-none text-destructive/5"
        style={{ fontSize: "clamp(140px, 20vw, 240px)" }}
      >
        Erro
      </p>

      <div className="relative z-10 flex max-w-sm flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        <h1 className="text-2xl font-semibold">Algo deu errado</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Ocorreu um erro inesperado nesta página. Tente novamente ou
          navegue para outra área do painel.
        </p>

        {/* Error detail */}
        {(error.message || error.digest) && (
          <div className="mt-4 w-full rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-left">
            {error.message && (
              <p className="break-all font-mono text-xs text-destructive/80">
                {error.message}
              </p>
            )}
            {error.digest && (
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="my-6 h-px w-full bg-border" />

        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </button>
          <Link
            href={ROUTES.dashboard}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Ir ao Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
