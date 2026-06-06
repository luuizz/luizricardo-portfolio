import Link from "next/link";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import Grid from "@/components/grid";

function Decorations() {
  return (
    <>
      {/* Noise */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.025]">
        <filter id="nf404">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#nf404)" />
      </svg>

      {/* Dot grid — top right */}
      <svg aria-hidden="true" viewBox="0 0 160 160" className="pointer-events-none absolute right-8 top-8 h-40 w-40 opacity-30 md:h-56 md:w-56">
        {Array.from({ length: 8 }, (_, r) =>
          Array.from({ length: 8 }, (_, c) => (
            <circle key={`${r}-${c}`} cx={c * 20 + 10} cy={r * 20 + 10} r="1.2" fill="#FFD300" fillOpacity="0.4" />
          ))
        )}
      </svg>

      {/* Orb — bottom left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full opacity-50"
        style={{ background: "radial-gradient(circle, rgba(255,211,0,0.12) 0%, transparent 70%)", filter: "blur(40px)" }}
      />

      {/* Concentric circles — background */}
      <svg aria-hidden="true" viewBox="0 0 400 400" fill="none" className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-[0.035]">
        <circle cx="200" cy="200" r="198" stroke="#FFD300" strokeWidth="1" />
        <circle cx="200" cy="200" r="155" stroke="#FFD300" strokeWidth="1" />
        <circle cx="200" cy="200" r="110" stroke="#FFD300" strokeWidth="1" />
        <circle cx="200" cy="200" r="66" stroke="#FFD300" strokeWidth="1" />
      </svg>
    </>
  );
}

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="relative min-h-[calc(100vh-200px)] overflow-hidden bg-black">
        <Decorations />

        <Grid className="relative z-10 flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-24 text-center">

          {/* 404 number */}
          <p
            aria-hidden="true"
            className="pointer-events-none absolute select-none font-poppins font-bold leading-none text-white/[0.03]"
            style={{ fontSize: "clamp(120px, 25vw, 280px)" }}
          >
            404
          </p>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-primary-default/25 bg-brand-primary-default/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary-default" />
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary-default">
                Página não encontrada
              </span>
            </div>

            <h1 className="font-poppins text-4xl font-semibold leading-snug text-white md:text-5xl">
              Você se perdeu
              <br />
              no caminho?
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-brand-gray-400">
              A página que você está procurando não existe, foi movida ou
              o endereço foi digitado incorretamente.
            </p>

            {/* Divider */}
            <div className="my-8 flex items-center gap-3">
              <div className="h-px w-12 bg-brand-primary-default/40" />
              <div className="h-1.5 w-1.5 rotate-45 bg-brand-primary-default" />
              <div className="h-px w-12 bg-brand-primary-default/40" />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-brand-primary-default px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-brand-primary-default/90 hover:shadow-lg hover:shadow-brand-primary-default/20"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Ir para home
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-brand-gray-700 px-6 py-3 text-sm font-medium text-white transition-all hover:border-brand-gray-500 hover:text-brand-primary-default"
              >
                Ver o Blog
              </Link>
            </div>

            {/* Quick links */}
            <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {[
                { href: "/#projetos", label: "Projetos" },
                { href: "/#quem-sou", label: "Sobre mim" },
                { href: "/#contato", label: "Contato" },
                { href: "/blog", label: "Blog" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-brand-gray-600 transition-colors hover:text-brand-primary-default"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </Grid>
      </main>
      <Footer />
    </>
  );
}
