import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Grid from "@/components/grid";
import type { Metadata } from "next";
import type { Database } from "@/types/supabase";
import { ArrowLeft, ArrowRight, Calendar, Clock, Hash } from "lucide-react";
import { NoiseOverlay, GradientOrb, DotGrid } from "../../_components/Decorations";
import { getPostGradient, readTime, formatDate } from "../../_components/BlogUtils";

type Post = Database["public"]["Tables"]["posts"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];
type PostWithCategory = Post & {
  categories: Pick<Category, "id" | "name" | "slug"> | null;
};

async function getData(slug: string) {
  const supabase = await createSupabaseServerClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (!category) return null;

  const { data: posts } = await supabase
    .from("posts")
    .select("*, categories:category(id, name, slug)")
    .eq("category", category.id)
    .eq("status", "published")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return { category, posts: (posts ?? []) as PostWithCategory[] };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getData(slug);
  if (!result) return { title: "Categoria não encontrada" };
  return {
    title: result.category.name,
    description: `Artigos na categoria ${result.category.name} — desenvolvimento web, front-end e design por Luiz Ricardo.`,
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getData(slug);
  if (!result) notFound();
  const { category, posts } = result;

  return (
    <div className="min-h-screen bg-black">

      {/* ─── Header ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-brand-gray-900 py-20 md:py-28">
        <NoiseOverlay opacity={0.025} />
        <GradientOrb className="absolute -left-20 top-0 h-64 w-64 opacity-50" />
        <DotGrid className="absolute right-6 top-6 h-32 w-32 opacity-40" />

        <Grid className="relative z-10">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-brand-gray-600 transition-colors hover:text-brand-primary-default"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Blog
          </Link>

          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-brand-primary-default/25 bg-brand-primary-default/10 px-4 py-1.5">
            <Hash className="h-3.5 w-3.5 text-brand-primary-default" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary-default">
              Categoria
            </span>
          </div>

          <h1 className="font-poppins text-4xl-short font-semibold leading-short text-white md:text-5xl">
            {category.name}
          </h1>

          <div className="mt-6 flex items-center gap-3">
            <p className="text-base text-brand-gray-500">
              {posts.length} artigo{posts.length !== 1 ? "s" : ""} publicado{posts.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px w-16 bg-brand-primary-default/40" />
          </div>
        </Grid>
      </section>

      {/* ─── Posts grid ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <Grid>
          {posts.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <p className="font-poppins text-xl font-semibold text-white">
                Nenhum artigo nesta categoria ainda
              </p>
              <p className="text-brand-gray-500">Volte em breve — novos conteúdos chegando.</p>
              <Link
                href="/blog"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary-default hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Ver todos os artigos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const gradient = getPostGradient(post.title);
                return (
                  <Link
                    key={post.id}
                    href={`/blog/artigo/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-brand-gray-800 bg-black transition-all duration-300 hover:border-brand-gray-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden" style={gradient}>
                      <span className="absolute inset-0 flex items-center justify-center text-[72px] font-bold text-white/[0.04] select-none font-poppins leading-none">
                        {post.title.charAt(0).toUpperCase()}
                      </span>
                      <div
                        className="absolute inset-0"
                        style={{ background: "radial-gradient(circle at 70% 30%, rgba(255,211,0,0.07), transparent 60%)" }}
                      />
                    </div>

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

                      <h2 className="mb-2 font-poppins text-lg font-semibold leading-snug text-white transition-colors group-hover:text-brand-primary-default line-clamp-2">
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
              })}
            </div>
          )}
        </Grid>
      </section>
    </div>
  );
}
