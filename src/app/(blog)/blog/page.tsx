import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Metadata } from "next";
import Grid from "@/components/grid";
import type { Database } from "@/types/supabase";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";

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

function PostCard({ post, featured = false }: { post: PostWithCategory; featured?: boolean }) {
  return (
    <Link
      href={`/blog/artigo/${post.slug}`}
      className={`group block overflow-hidden rounded-2xl border border-brand-gray-800 bg-brand-gray-900 transition-all duration-300 hover:border-brand-gray-700 hover:shadow-lg hover:shadow-black/40 ${featured ? "md:flex" : ""}`}
    >
      {/* Placeholder image area */}
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-brand-gray-800 to-brand-gray-900 ${featured ? "md:w-1/2 aspect-video md:aspect-auto" : "aspect-video"}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-brand-gray-700 select-none">
            {post.title.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-gray-900/60 to-transparent" />
        {post.categories && (
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary-default/20 px-3 py-1 text-xs font-semibold text-brand-primary-default backdrop-blur-sm">
              <Tag className="h-3 w-3" />
              {post.categories.name}
            </span>
          </div>
        )}
      </div>

      <div className={`p-6 ${featured ? "md:w-1/2 md:flex md:flex-col md:justify-center" : ""}`}>
        <div className="mb-3 flex items-center gap-3 text-xs text-brand-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.created_at!)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readTime(post.content)} min de leitura
          </span>
        </div>

        <h2
          className={`font-poppins font-semibold leading-snug text-white transition-colors group-hover:text-brand-primary-default ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}
        >
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-brand-gray-400">
            {post.excerpt}
          </p>
        )}

        <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-brand-primary-default">
          Ler artigo
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  const supabase = await createSupabaseServerClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*, categories:category(id, name, slug)")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[BlogPage]", error.message);
    return (
      <section className="min-h-screen bg-black py-24">
        <Grid>
          <p className="text-brand-gray-400">Erro ao carregar postagens.</p>
        </Grid>
      </section>
    );
  }

  const typedPosts = (posts ?? []) as PostWithCategory[];
  const [featured, ...rest] = typedPosts;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="border-b border-brand-gray-900 py-20">
        <Grid>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-primary-default">
            Blog
          </p>
          <h1 className="font-poppins text-4xl-short font-semibold leading-short text-white md:text-6xl-short">
            Artigos &amp; Tutoriais
          </h1>
          <p className="mt-4 max-w-xl text-base text-brand-gray-400">
            Escrevo sobre desenvolvimento web, front-end, React, performance e tudo que aprendo no
            caminho.
          </p>
        </Grid>
      </section>

      {typedPosts.length === 0 ? (
        <section className="py-24">
          <Grid>
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <p className="text-2xl font-semibold text-white">Nenhum artigo publicado ainda</p>
              <p className="text-brand-gray-500">Volte em breve — novos conteúdos estão a caminho 🚀</p>
            </div>
          </Grid>
        </section>
      ) : (
        <section className="py-16">
          <Grid>
            {/* Featured post */}
            {featured && (
              <div className="mb-12">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-gray-500">
                  Destaque
                </p>
                <PostCard post={featured} featured />
              </div>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <>
                <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-brand-gray-500">
                  Mais artigos
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </>
            )}
          </Grid>
        </section>
      )}
    </div>
  );
}
