"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProjectType } from "@/types/dashboard";

interface ProjectTypeInput {
  name: string;
  slug: string;
  status?: "draft" | "published" | "archived";
}

export async function getDashboardProjectTypes(): Promise<ProjectType[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("project_types")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro getDashboardProjectTypes:", error);
    return [];
  }
  return data ?? [];
}

export async function getProjectTypeBySlug(slug: string): Promise<ProjectType | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("project_types")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data;
}

export async function createProjectTypeService(input: ProjectTypeInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("project_types")
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

export async function updateProjectTypeService(id: string, input: Partial<ProjectTypeInput>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("project_types")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function softDeleteProjectTypeService(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("project_types")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}
