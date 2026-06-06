"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Video } from "@/types/dashboard";

export async function getVideos(category?: string): Promise<Video[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("videos")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) {
    console.error("[getVideos]", error);
    return [];
  }
  return data ?? [];
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data;
}

export async function getVideoById(id: string): Promise<Video | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data;
}

export async function createVideoService(input: {
  title: string;
  slug: string;
  url: string;
  description?: string;
  thumbnail?: string;
  platform?: string;
  category?: string;
  status?: string;
  duration?: string;
}): Promise<Video> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("videos")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateVideoService(
  id: string,
  input: Partial<{
    title: string;
    slug: string;
    url: string;
    description: string | null;
    thumbnail: string | null;
    platform: string;
    category: string;
    status: string;
    duration: string | null;
  }>,
): Promise<Video> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("videos")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function softDeleteVideoService(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("videos")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
