import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Metadata } from "next";
import type { Database } from "@/types/supabase";

export const metadata: Metadata = {
  title: "Blog | Luric.web",
  description:
    "Leia artigos e tutoriais sobre desenvolvimento web, design e performance. Escrito por Luiz Ricardo.",
};

type Post = Database["public"]["Tables"]["posts"]["Row"];
type SupabaseResponse<T> = {
  data: T | null;
  error: { message: string } | null;
};

export default async function BlogPage() {
  const supabase = await createSupabaseServerClient();

  const { data: posts, error }: SupabaseResponse<Post[]> = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[BlogPage] Erro ao buscar posts:", error.message);
    return <main className="p-8">Erro ao carregar postagens 😢</main>;
  }

  if (!posts?.length) {
    return (
      <main className="p-8">
        <h1 className="mb-4 text-2xl font-bold">Nenhum post encontrado</h1>
        <p>Assim que publicarmos artigos, eles aparecerão aqui 🚀</p>
      </main>
    );
  }

  return (
    <main className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Blog</h1>

      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="border-b border-gray-200 pb-4">
            <Link href={`/blog/artigo/${post.slug}`} className="group block">
              <h2 className="text-xl font-semibold transition-colors group-hover:text-primary">
                {post.title}
              </h2>
              <p className="mt-1 text-gray-600">{post.excerpt}</p>
              <time
                dateTime={post.created_at}
                className="mt-2 block text-sm text-gray-400"
              >
                {new Date(post.created_at!).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
