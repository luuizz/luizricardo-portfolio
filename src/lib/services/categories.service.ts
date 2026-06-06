"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Category } from "@/types/dashboard";

interface CategoryInput {
  name: string;
  slug: string;
  status?: "draft" | "scheduled" | "published";
}

export async function getDashboardCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro getDashboardCategories:", error);
    return [];
  }
  return data ?? [];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data;
}

export async function createCategoryService(input: CategoryInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: input.name,
      slug: input.slug,
      status: input.status ?? "draft",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateCategoryService(id: string, input: Partial<CategoryInput>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function softDeleteCategoryService(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("categories")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}
