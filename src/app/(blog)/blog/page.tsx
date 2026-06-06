import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Metadata } from "next";
import Grid from "@/components/grid";
import type { Database } from "@/types/supabase";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Suspense } from "react";
import { NoiseOverlay, DotGrid, GradientOrb, YellowUnderline, CircleDecor } from "./_components/Decorations";
import { CategoryFilter } from "./_components/CategoryFilter";
import { getPostGradient, readTime, formatDate } from "./_components/BlogUtils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artigos sobre desenvolvimento web, front-end, React, performance e design. Escrito por Luiz Ricardo.",
};

type Post = Database["public"]["Tables"]["posts"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];
type PostWithCategory = Post & {
  categories: Pick<Category, "id" | "name" | "slug"> | null;
};

function PostCard({ post }: { post: PostWithCategory }) {
  const gradient = getPostGradient(post.title);
  const initial = post.title.charAt(0).toUpperCase();

  return (
    <Link
      href={`/blog/artigo/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-brand-gray-800 bg-black transition-all duration-300 hover:border-brand-gray-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60"
    >
      {/* Thumbnail */}
      <div
        className="relative aspect-[16/9] overflow-hidden"
        style={gradient}
      >
        <span className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-white/5 select-none font-poppins">
          {initial}
        </span>
        {/* yellow corner accent */}
        <div className="absolute right-0 top-0 h-16 w-16 opacity-40"
          style={{ background: "radial-gradient(circle at top right, rgba(255,211,0,0.3), transparent 70%)" }} />
        {post.categories && (
          <div className="absolute left-4 bottom-4">
            <span className="inline-block rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-primary-default backdrop-blur-sm">
              {post.categories.name}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-3 text-xs text-brand-gray-600">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(post.created_at!)}
          </span>
          <span className="h-1 w-1 rounded-full bg-brand-gray-700" />
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readTime(post.content)} min
          </span>
        </div>

        <h2 className="mb-2 font-poppins text-lg font-semibold leading-snug text-white transition-colors duration-200 group-hover:text-brand-primary-default line-clamp-2">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mb-4 flex-1 text-sm leading-relaxed text-brand-gray-500 line-clamp-2">
            {post.excerpt}
          </p>
        )}

        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary-default">
          Ler artigo
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function FeaturedCard({ post }: { post: PostWithCategory }) {
  const gradient = getPostGradient(post.title);
  const initial = post.title.charAt(0).toUpperCase();

  return (
    <Link
      href={`/blog/artigo/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-brand-gray-800 bg-black transition-all duration-300 hover:border-brand-gray-600 md:flex-row"
    >
      {/* Image */}
      <div
        className="relative aspect-video overflow-hidden md:aspect-auto md:w-[45%] md:shrink-0"
        style={gradient}
      >
        <span className="absolute inset-0 flex items-center justify-center text-[120px] font-bold text-white/[0.04] select-none font-poppins leading-none">
          {initial}
        </span>
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 30% 60%, rgba(255,211,0,0.08), transparent 60%)" }} />
        <DiagonalLinesBg />
        {post.categories && (
          <div className="absolute left-5 top-5">
            <span className="inline-block rounded-full border border-brand-primary-default/30 bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-primary-default backdrop-blur-sm">
              {post.categories.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center p-8 md:p-10 lg:p-14">
        <div className="mb-4 flex items-center gap-3 text-xs text-brand-gray-600">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.created_at!)}
          </span>
          <span className="h-1 w-1 rounded-full bg-brand-gray-700" />
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readTime(post.content)} min de leitura
          </span>
        </div>

        <h2 className="font-poppins text-2xl font-semibold leading-snug text-white transition-colors duration-200 group-hover:text-brand-primary-default md:text-3xl lg:text-4xl-short">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="mt-4 text-base leading-relaxed text-brand-gray-400 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <span className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-brand-primary-default">
          Ler artigo completo
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}

// Inline SVG to avoid import overhead
function DiagonalLinesBg() {
  return (
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-[0.04]" preserveAspectRatio="none">
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={`${i * 10 - 10}%`} y1="0%" x2={`${i * 10 + 20}%`} y2="100%"
          stroke="#FFD300" strokeWidth="1" />
      ))}
    </svg>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const supabase = await createSupabaseServerClient();

  // Fetch categories
  const { data: categoriesRaw } = await supabase
    .from("categories")
    .select("id, name, slug")
    .is("deleted_at", null)
    .order("name");

  const categories = (categoriesRaw ?? []) as Pick<Category, "id" | "name" | "slug">[];

  // Fetch posts — filter by category if selected
  let postsQuery = supabase
    .from("posts")
    .select("*, categories:category(id, name, slug)")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (categoria && categoria !== "todos") {
    const cat = categories.find((c) => c.slug === categoria);
    if (cat) postsQuery = postsQuery.eq("category", cat.id);
  }

  const { data: posts, error } = await postsQuery;
  if (error) console.error("[BlogPage]", error.message);

  const typedPosts = (posts ?? []) as PostWithCategory[];
  const [featured, ...rest] = typedPosts;
  const isFiltered = Boolean(categoria && categoria !== "todos");

  return (
    <div className="min-h-screen bg-black">

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-brand-gray-900 py-24 md:py-32">
        <NoiseOverlay opacity={0.03} />
        <GradientOrb className="absolute -bottom-20 -left-20 h-80 w-80 opacity-60" />
        <DotGrid className="absolute right-8 top-8 h-40 w-40 opacity-60 md:h-56 md:w-56" />
        <CircleDecor className="absolute -right-16 -top-16 h-64 w-64 opacity-50" />

        <Grid className="relative z-10">
          <p className="mb-3 font-mono text-xs font-medium tracking-[0.2em] text-brand-primary-default uppercase">
            — Blog
          </p>
          <h1 className="relative inline-block font-poppins text-5xl font-semibold leading-[1.1] text-white md:text-6xl-short">
            Artigos &amp;
            <br />
            <span className="relative">
              Tutoriais
              <YellowUnderline className="absolute -bottom-2 left-0 w-full" />
            </span>
          </h1>
          <p className="mt-8 max-w-md text-base leading-relaxed text-brand-gray-500">
            Escrevo sobre desenvolvimento web, design de interface e tudo que aprendo construindo
            produtos digitais.
          </p>

          <div className="mt-10 flex items-center gap-6">
            <div className="text-center">
              <p className="font-poppins text-2xl font-semibold text-white">{typedPosts.length}</p>
              <p className="text-xs text-brand-gray-600">Artigos</p>
            </div>
            <div className="h-8 w-px bg-brand-gray-800" />
            <div className="text-center">
              <p className="font-poppins text-2xl font-semibold text-white">{categories.length}</p>
              <p className="text-xs text-brand-gray-600">Categorias</p>
            </div>
          </div>
        </Grid>
      </section>

      {/* ─── Posts ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <Grid>
          {/* Category filter */}
          {categories.length > 0 && (
            <div className="mb-10">
              <Suspense
                fallback={
                  <div className="flex gap-2">
                    {["Todos", ...categories.map((c) => c.name)].map((l) => (
                      <div key={l} className="h-8 rounded-full border border-brand-gray-800 px-4 py-1.5 text-sm text-brand-gray-700">
                        {l}
                      </div>
                    ))}
                  </div>
                }
              >
                <CategoryFilter categories={categories} />
              </Suspense>
            </div>
          )}

          {typedPosts.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <div className="relative mx-auto mb-2 h-20 w-20">
                <CircleDecor className="absolute inset-0 h-full w-full" />
                <span className="absolute inset-0 flex items-center justify-center text-3xl">
                  ✍️
                </span>
              </div>
              <p className="font-poppins text-xl font-semibold text-white">
                Nenhum artigo ainda
              </p>
              <p className="text-brand-gray-500">
                {isFiltered ? "Nenhum artigo nesta categoria." : "Novos conteúdos em breve 🚀"}
              </p>
              {isFiltered && (
                <Link
                  href="/blog"
                  className="mt-2 text-sm text-brand-primary-default hover:underline"
                >
                  Ver todos os artigos
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-10">
              {/* Featured */}
              {!isFiltered && featured && (
                <div>
                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-gray-600">
                    Destaque
                  </p>
                  <FeaturedCard post={featured} />
                </div>
              )}

              {/* Grid */}
              {(isFiltered ? typedPosts : rest).length > 0 && (
                <div>
                  {!isFiltered && (
                    <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-gray-600">
                      Mais artigos
                    </p>
                  )}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {(isFiltered ? typedPosts : rest).map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Grid>
      </section>
    </div>
  );
}
