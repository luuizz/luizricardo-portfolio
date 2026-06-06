"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MediaItem } from "@/types/dashboard";

export async function getDashboardMedia(): Promise<MediaItem[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("media")
    .select("*")
    .is("deleted_at", null)
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("Erro getDashboardMedia:", error);
    return [];
  }
  return data ?? [];
}

export async function getMediaById(id: string): Promise<MediaItem | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data;
}

export async function createMediaRecord(input: {
  name: string;
  path: string;
  bucket: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  uploaded_by?: string;
}): Promise<MediaItem> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("media")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateMediaMetadata(
  id: string,
  input: {
    alt_text?: string | null;
    title?: string | null;
    caption?: string | null;
    tags?: string[] | null;
  },
) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("media").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}

export async function softDeleteMediaService(id: string, storagePath: string) {
  const supabase = await createSupabaseServerClient();
  await supabase.storage.from("media").remove([storagePath]);

  const { error } = await supabase
    .from("media")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}
