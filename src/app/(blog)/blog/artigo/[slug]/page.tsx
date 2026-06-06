import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Grid from "@/components/grid";
import type { Metadata } from "next";
import type { Database } from "@/types/supabase";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Link2 from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import type { JSONContent } from "@tiptap/core";

type Post = Database["public"]["Tables"]["posts"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];
type SeoMeta = Database["public"]["Tables"]["seo_meta"]["Row"];

type PostFull = Post & {
  categories: Pick<Category, "id" | "name" | "slug"> | null;
  seo: SeoMeta | null;
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

async function getPost(slug: string): Promise<PostFull | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("posts")
    .select("*, categories:category(id, name, slug), seo:seo_id(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single();

  return data as PostFull | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Artigo não encontrado" };

  const seo = post.seo;
  return {
    title: seo?.seo_title ?? post.title,
    description: seo?.seo_description ?? post.excerpt ?? undefined,
    keywords: seo?.seo_keywords ?? undefined,
    openGraph: {
      title: seo?.og_title ?? seo?.seo_title ?? post.title,
      description: seo?.og_description ?? seo?.seo_description ?? post.excerpt ?? undefined,
      images: seo?.og_image ? [{ url: seo.og_image }] : undefined,
    },
  };
}

function renderContent(content: unknown): string {
  if (!content) return "";
  try {
    return generateHTML(content as JSONContent, [
      StarterKit,
      TextStyle,
      Color,
      Link2.configure({ openOnClick: false }),
      Image,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ]);
  } catch {
    return "";
  }
}

export default async function ArtigoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const contentHtml = renderContent(post.content);

  return (
    <div className="min-h-screen bg-black">
      {/* Article header */}
      <div className="border-b border-brand-gray-900 bg-black py-16">
        <Grid className="max-w-3xl">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-brand-gray-500 transition-colors hover:text-brand-primary-default"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o Blog
          </Link>

          {post.categories && (
            <Link
              href={`/blog/categoria/${post.categories.slug}`}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary-default hover:underline"
            >
              <Tag className="h-4 w-4" />
              {post.categories.name}
            </Link>
          )}

          <h1 className="font-poppins text-3xl font-semibold leading-snug text-white md:text-4xl-short">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-lg leading-relaxed text-brand-gray-400">{post.excerpt}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-brand-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(post.created_at!)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {readTime(post.content)} min de leitura
            </span>
          </div>
        </Grid>
      </div>

      {/* Article body */}
      <div className="py-12">
        <Grid className="max-w-3xl">
          {contentHtml ? (
            <article
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-poppins prose-headings:text-white
                prose-p:text-brand-gray-300 prose-p:leading-relaxed
                prose-a:text-brand-primary-default prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-code:bg-brand-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-brand-primary-default
                prose-pre:bg-brand-gray-900 prose-pre:border prose-pre:border-brand-gray-800
                prose-blockquote:border-l-brand-primary-default prose-blockquote:text-brand-gray-400
                prose-img:rounded-xl prose-img:border prose-img:border-brand-gray-800
                prose-hr:border-brand-gray-800
                prose-li:text-brand-gray-300"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          ) : (
            <p className="text-brand-gray-500 italic">
              Este artigo ainda não tem conteúdo publicado.
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-brand-gray-900 pt-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-brand-gray-800 bg-brand-gray-900 px-3 py-1 text-xs text-brand-gray-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Back link */}
          <div className="mt-16 border-t border-brand-gray-900 pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-brand-gray-700 bg-brand-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-brand-primary-default hover:text-brand-primary-default"
            >
              <ArrowLeft className="h-4 w-4" />
              Ver todos os artigos
            </Link>
          </div>
        </Grid>
      </div>
    </div>
  );
}
