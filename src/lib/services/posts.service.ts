"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PostsWithCategory, PostForEdit } from "@/types/dashboard";
import { Json } from "@/types/supabase";

interface CreatePostInput {
  title: string;
  slug?: string;
  excerpt: string;
  category?: string;
  status?: "draft" | "published" | "scheduled";
  content?: Json;
  tags?: string[];
  seo_id?: string;
}

interface UpdatePostInput extends Partial<CreatePostInput> {
  id: string;
}

export async function getDashboardPosts() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      categories:category (
        id,
        name,
        slug
      )
    `,
    )
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .returns<PostsWithCategory[]>();

  if (error) {
    console.error("Erro no Service getDashboardPosts:", error);
    return [];
  }

  return data;
}

export async function getPostById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(`*, categories:category(id, name, slug)`)
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data as PostsWithCategory;
}

export async function getPostBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(`*, categories:category(id, name, slug)`)
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data as PostsWithCategory;
}

export async function getPostForEdit(slug: string): Promise<PostForEdit | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      seo:seo_id (id, seo_title, seo_description, seo_keywords, og_title, og_description, og_image),
      post_categories (
        category_id,
        categories:category_id (id, name, slug)
      )
    `)
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data as PostForEdit;
}

export async function upsertSeoMeta(
  seoId: string | null,
  input: {
    seo_title: string;
    seo_description?: string | null;
    seo_keywords?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
  },
): Promise<string | null> {
  const supabase = await createSupabaseServerClient();

  if (seoId) {
    await supabase.from("seo_meta").update({ ...input, updated_at: new Date().toISOString() }).eq("id", seoId);
    return seoId;
  }

  const { data, error } = await supabase.from("seo_meta").insert(input).select("id").single();
  if (error) return null;
  return data?.id ?? null;
}

export async function syncPostCategories(postId: string, categoryIds: string[]) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("post_categories").delete().eq("post_id", postId);

  if (categoryIds.length > 0) {
    await supabase.from("post_categories").insert(
      categoryIds.map((category_id) => ({ post_id: postId, category_id })),
    );
  }
}

export async function createPostService(data: CreatePostInput) {
  const supabase = await createSupabaseServerClient();
  const { data: inserted, error } = await supabase
    .from("posts")
    .insert({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      category: data.category || null,
      status: data.status || "draft",
      tags: data.tags ?? null,
      seo_id: data.seo_id ?? null,
    })
    .select("id, slug")
    .single();

  if (error) throw new Error(error.message);
  return inserted;
}

export async function updatePostService(data: UpdatePostInput) {
  const supabase = await createSupabaseServerClient();
  const { id, ...updates } = data;

  const { data: updated, error } = await supabase
    .from("posts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return updated;
}

export async function publishPostService(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("posts")
    .update({ status: "published", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}

export async function softDeletePostService(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("posts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}

export async function deletePostService(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}
