import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Grid from "@/components/grid";
import type { Metadata } from "next";
import type { Database } from "@/types/supabase";
import { ArrowLeft, Calendar, Clock, Tag, ArrowRight } from "lucide-react";
import { generateHTML } from "@tiptap/core";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { ReadingProgress } from "../../_components/ReadingProgress";
import { TableOfContents } from "../../_components/TableOfContents";
import { NoiseOverlay, GradientOrb, DotGrid } from "../../_components/Decorations";
import {
  extractHeadings,
  injectHeadingIds,
  readTime,
  formatDate,
  getPostGradient,
} from "../../_components/BlogUtils";

type Post = Database["public"]["Tables"]["posts"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];
type SeoMeta = Database["public"]["Tables"]["seo_meta"]["Row"];
type PostFull = Post & {
  categories: Pick<Category, "id" | "name" | "slug"> | null;
  seo: SeoMeta | null;
  related?: PostWithCategory[];
};
type PostWithCategory = Post & {
  categories: Pick<Category, "id" | "name" | "slug"> | null;
};

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

async function getRelated(categoryId: string | null, excludeId: string): Promise<PostWithCategory[]> {
  if (!categoryId) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("posts")
    .select("*, categories:category(id, name, slug)")
    .eq("status", "published")
    .eq("category", categoryId)
    .neq("id", excludeId)
    .is("deleted_at", null)
    .limit(3);
  return (data ?? []) as PostWithCategory[];
}

function renderContent(content: unknown): string {
  if (!content) return "";
  try {
    return generateHTML(content as JSONContent, [
      StarterKit,
      TextStyle,
      Color,
      TiptapLink.configure({ openOnClick: false }),
      TiptapImage,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ]);
  } catch {
    return "";
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Artigo não encontrado" };
  const s = post.seo;
  return {
    title: s?.seo_title ?? post.title,
    description: s?.seo_description ?? post.excerpt ?? undefined,
    keywords: s?.seo_keywords ?? undefined,
    openGraph: {
      title: s?.og_title ?? s?.seo_title ?? post.title,
      description: s?.og_description ?? s?.seo_description ?? post.excerpt ?? undefined,
      images: s?.og_image ? [{ url: s.og_image }] : undefined,
    },
  };
}

export default async function ArtigoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const headings = extractHeadings(post.content);
  const rawHtml = renderContent(post.content);
  const contentHtml = injectHeadingIds(rawHtml, headings);
  const gradient = getPostGradient(post.title);
  const heroImage = post.seo?.og_image ?? null;
  const related = await getRelated(
    post.categories?.id ?? (post as unknown as { category?: string }).category ?? null,
    post.id,
  );

  return (
    <div className="min-h-screen bg-black">
      <ReadingProgress />

      {/* ─── Article header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-brand-gray-900 py-16 md:py-24">
        <NoiseOverlay opacity={0.025} />
        <GradientOrb className="absolute -right-24 -top-24 h-72 w-72 opacity-50" />
        <DotGrid className="absolute bottom-4 right-4 h-36 w-36 opacity-40" />

        <Grid className="relative z-10 max-w-4xl">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-brand-gray-600 transition-colors hover:text-brand-primary-default"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Blog
          </Link>

          {post.categories && (
            <div className="mb-5">
              <Link
                href={`/blog/categoria/${post.categories.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-primary-default/25 bg-brand-primary-default/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-primary-default transition-colors hover:bg-brand-primary-default/20"
              >
                <Tag className="h-3 w-3" />
                {post.categories.name}
              </Link>
            </div>
          )}

          <h1 className="font-poppins text-3xl font-semibold leading-[1.15] text-white md:text-[44px] lg:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-5 text-lg leading-relaxed text-brand-gray-400 md:text-xl">
              {post.excerpt}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* Author pill */}
            <div className="flex items-center gap-2.5 rounded-full border border-brand-gray-800 bg-brand-gray-900 px-3.5 py-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary-default text-[10px] font-bold text-black">
                L
              </div>
              <span className="text-sm font-medium text-white">Luiz Ricardo</span>
            </div>

            <span className="flex items-center gap-1.5 text-sm text-brand-gray-600">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.created_at!)}
            </span>

            <span className="flex items-center gap-1.5 text-sm text-brand-gray-600">
              <Clock className="h-3.5 w-3.5" />
              {readTime(post.content)} min de leitura
            </span>
          </div>

          {/* Decorative separator */}
          <div className="mt-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-brand-primary-default/40 to-transparent" />
            <div className="h-1.5 w-1.5 rotate-45 bg-brand-primary-default" />
          </div>
        </Grid>
      </div>

      {/* ─── Hero image ─────────────────────────────────────────────── */}
      <div className="border-b border-brand-gray-900">
        {heroImage ? (
          <div className="aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] md:aspect-[21/9]">
            <img
              src={heroImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className="relative flex aspect-[4/3] items-center justify-center overflow-hidden sm:aspect-[16/9] md:aspect-[21/9]"
            style={gradient}
          >
            <span
              className="absolute select-none font-poppins text-[20vw] font-bold leading-none text-white/[0.03]"
            >
              {post.title.charAt(0).toUpperCase()}
            </span>
            <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-[0.04]" preserveAspectRatio="none">
              {Array.from({ length: 16 }).map((_, i) => (
                <line key={i} x1={`${i * 7}%`} y1="0%" x2={`${i * 7 + 14}%`} y2="100%"
                  stroke="#FFD300" strokeWidth="0.8" />
              ))}
            </svg>
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(255,211,0,0.06), transparent 60%)" }}
            />
          </div>
        )}
      </div>

      {/* ─── Article body ────────────────────────────────────────────── */}
      <div className="py-14 md:py-20">
        <Grid>
          <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-16 xl:grid-cols-[260px_1fr]">

            {/* ToC (desktop sticky + mobile collapsible) */}
            <TableOfContents headings={headings} />

            {/* Content */}
            <div className="min-w-0">
              {contentHtml ? (
                <article
                  className="
                    prose prose-invert max-w-none
                    prose-headings:font-poppins prose-headings:font-semibold
                    prose-headings:text-white prose-headings:leading-snug
                    prose-headings:scroll-mt-28
                    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-brand-gray-300 prose-p:leading-[1.85] prose-p:text-[15px]
                    prose-a:text-brand-primary-default prose-a:no-underline
                    hover:prose-a:underline prose-a:font-medium
                    prose-strong:text-white prose-strong:font-semibold
                    prose-em:text-brand-gray-300
                    prose-code:rounded prose-code:bg-brand-gray-900 prose-code:px-1.5
                    prose-code:py-0.5 prose-code:text-[13px] prose-code:text-brand-primary-light
                    prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
                    prose-pre:rounded-xl prose-pre:border prose-pre:border-brand-gray-800
                    prose-pre:bg-brand-gray-900 prose-pre:shadow-xl
                    prose-blockquote:border-l-brand-primary-default
                    prose-blockquote:bg-brand-primary-default/5
                    prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-4
                    prose-blockquote:text-brand-gray-400 prose-blockquote:not-italic
                    prose-blockquote:font-normal prose-blockquote:text-[15px]
                    prose-ul:text-brand-gray-300 prose-ol:text-brand-gray-300
                    prose-li:text-[15px] prose-li:leading-relaxed
                    prose-img:rounded-2xl prose-img:border prose-img:border-brand-gray-800
                    prose-img:shadow-2xl
                    prose-hr:border-brand-gray-800
                    prose-table:text-sm
                    prose-th:text-brand-gray-200 prose-td:text-brand-gray-400
                  "
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              ) : (
                <p className="italic text-brand-gray-600">
                  Este artigo ainda não tem conteúdo publicado.
                </p>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-14 flex flex-wrap gap-2 border-t border-brand-gray-900 pt-8">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-brand-gray-800 bg-brand-gray-900 px-3.5 py-1 text-xs font-medium text-brand-gray-500 transition-colors hover:border-brand-gray-600 hover:text-brand-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Author card */}
              <div className="mt-14 flex items-start gap-4 rounded-2xl border border-brand-gray-800 bg-brand-gray-900/60 p-5 sm:items-center sm:gap-5 sm:p-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-primary-default text-xl font-bold text-black">
                  L
                </div>
                <div>
                  <p className="font-poppins font-semibold text-white">Luiz Ricardo</p>
                  <p className="mt-0.5 text-sm text-brand-gray-500">
                    Desenvolvedor Front-end apaixonado por interfaces e experiências digitais de alta qualidade.
                  </p>
                </div>
              </div>

              {/* Back */}
              <div className="mt-10">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full border border-brand-gray-800 px-5 py-2.5 text-sm font-medium text-brand-gray-400 transition-all hover:border-brand-gray-600 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Todos os artigos
                </Link>
              </div>
            </div>
          </div>
        </Grid>
      </div>

      {/* ─── Related posts ───────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-brand-gray-900 py-16">
          <Grid>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-gray-600">
              Continue lendo
            </p>
            <h2 className="mb-8 font-poppins text-2xl font-semibold text-white">
              Artigos relacionados
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => {
                const g = getPostGradient(p.title);
                return (
                  <Link
                    key={p.id}
                    href={`/blog/artigo/${p.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-brand-gray-800 bg-black transition-all duration-300 hover:border-brand-gray-700 hover:-translate-y-1"
                  >
                    <div className="relative aspect-video overflow-hidden" style={g}>
                      <span className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-white/[0.04] select-none font-poppins">
                        {p.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="mb-1.5 text-xs text-brand-gray-600">{formatDate(p.created_at!)}</p>
                      <h3 className="line-clamp-2 font-poppins text-base font-semibold text-white transition-colors group-hover:text-brand-primary-default">
                        {p.title}
                      </h3>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-primary-default">
                        Ler
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Grid>
        </section>
      )}
    </div>
  );
}
