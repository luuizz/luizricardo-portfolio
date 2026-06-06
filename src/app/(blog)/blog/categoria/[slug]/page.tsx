import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Grid from "@/components/grid";
import type { Metadata } from "next";
import type { Database } from "@/types/supabase";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag } from "lucide-react";

type Post = Database["public"]["Tables"]["posts"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];
type PostWithCategory = Post & {
  categories: Pick<Category, "id" | "name" | "slug"> | null;
};

function readTime(content: unknown): number {
  if (!content) return 1;
  const text = JSON.stringify(content).replace(/<[^>]+>/g, "").replace(/\s+/g, " ");
  return Math.max(1, Math.ceil(text.split(" ").length / 200));
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

async function getCategoryAndPosts(slug: string) {
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
  const result = await getCategoryAndPosts(slug);
  if (!result) return { title: "Categoria não encontrada" };
  return {
    title: result.category.name,
    description: `Artigos na categoria ${result.category.name}. Desenvolvimento web, front-end e design.`,
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getCategoryAndPosts(slug);
  if (!result) notFound();

  const { category, posts } = result;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-brand-gray-900 py-16">
        <Grid>
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-brand-gray-500 transition-colors hover:text-brand-primary-default"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o Blog
          </Link>

          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-primary-default/10 px-4 py-1.5 text-sm font-semibold text-brand-primary-default">
            <Tag className="h-4 w-4" />
            Categoria
          </div>

          <h1 className="font-poppins text-4xl-short font-semibold leading-short text-white">
            {category.name}
          </h1>
          <p className="mt-3 text-brand-gray-400">
            {posts.length} artigo{posts.length !== 1 ? "s" : ""} nesta categoria
          </p>
        </Grid>
      </div>

      {/* Posts */}
      <section className="py-16">
        <Grid>
          {posts.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <p className="text-xl font-semibold text-white">
                Nenhum artigo nesta categoria ainda
              </p>
              <Link
                href="/blog"
                className="text-sm text-brand-primary-default hover:underline"
              >
                Ver todos os artigos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/artigo/${post.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-brand-gray-800 bg-brand-gray-900 transition-all duration-300 hover:border-brand-gray-700 hover:shadow-lg hover:shadow-black/40"
                >
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-brand-gray-800 to-brand-gray-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-brand-gray-700 select-none">
                        {post.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-3 text-xs text-brand-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.created_at!)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {readTime(post.content)} min
                      </span>
                    </div>

                    <h2 className="line-clamp-2 font-poppins text-lg font-semibold leading-snug text-white transition-colors group-hover:text-brand-primary-default">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm text-brand-gray-500">{post.excerpt}</p>
                    )}
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand-primary-default">
                      Ler artigo
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Grid>
      </section>
    </div>
  );
}
