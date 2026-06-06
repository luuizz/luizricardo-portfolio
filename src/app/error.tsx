"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import Grid from "@/components/grid";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="relative min-h-[calc(100vh-200px)] overflow-hidden bg-black">
        {/* Noise */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.025]">
          <filter id="nerr">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#nerr)" />
        </svg>

        {/* Red/amber orb for error feel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)", filter: "blur(50px)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -left-10 h-64 w-64 rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, rgba(255,211,0,0.1) 0%, transparent 70%)", filter: "blur(40px)" }}
        />

        <Grid className="relative z-10 flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-24 text-center">

          {/* Background "500" */}
          <p
            aria-hidden="true"
            className="pointer-events-none absolute select-none font-poppins font-bold leading-none text-white/[0.025]"
            style={{ fontSize: "clamp(120px, 25vw, 260px)" }}
          >
            500
          </p>

          <div className="relative z-10 flex flex-col items-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                Ocorreu um erro
              </span>
            </div>

            <h1 className="font-poppins text-4xl font-semibold leading-snug text-white md:text-5xl">
              Algo deu errado
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-brand-gray-400">
              Aconteceu um erro inesperado. Tente novamente ou volte para a
              página inicial.
            </p>

            {error.digest && (
              <p className="mt-3 font-mono text-xs text-brand-gray-700">
                digest: {error.digest}
              </p>
            )}

            {/* Divider */}
            <div className="my-8 flex items-center gap-3">
              <div className="h-px w-12 bg-brand-gray-800" />
              <div className="h-1.5 w-1.5 rotate-45 bg-brand-gray-700" />
              <div className="h-px w-12 bg-brand-gray-800" />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full bg-brand-primary-default px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-brand-primary-default/90"
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Tentar novamente
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-brand-gray-700 px-6 py-3 text-sm font-medium text-white transition-all hover:border-brand-gray-500"
              >
                Ir para home
              </Link>
            </div>
          </div>
        </Grid>
      </main>
      <Footer />
    </>
  );
}
