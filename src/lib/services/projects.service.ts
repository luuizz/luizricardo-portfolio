"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProjectWithTypes, ProjectForEdit } from "@/types/dashboard";
import { Json } from "@/types/supabase";

interface ProjectInput {
  title: string;
  slug?: string;
  summary?: string;
  status?: "draft" | "published" | "archived";
  banner_image?: string;
  highlight_color?: string;
  start_date?: string;
  end_date?: string;
  content?: Json;
  tags?: string[];
  seo_id?: string;
}

export async function getDashboardProjects(): Promise<ProjectWithTypes[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_type_relations (
        project_types (
          id,
          name,
          slug
        )
      )
    `,
    )
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro getDashboardProjects:", error);
    return [];
  }
  return (data ?? []) as ProjectWithTypes[];
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithTypes | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_type_relations (
        project_types (id, name, slug)
      )
    `,
    )
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data as ProjectWithTypes;
}

export async function getProjectForEdit(slug: string): Promise<ProjectForEdit | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      seo:seo_id (id, seo_title, seo_description, seo_keywords, og_title, og_description, og_image),
      project_type_relations (
        project_types (id, name, slug)
      )
    `)
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data as ProjectForEdit;
}

export async function getProjectById(id: string): Promise<ProjectWithTypes | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_type_relations (
        project_types (id, name, slug)
      )
    `,
    )
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data as ProjectWithTypes;
}

export async function createProjectService(input: ProjectInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: input.title,
      slug: input.slug ?? null,
      summary: input.summary ?? null,
      status: input.status ?? "draft",
      banner_image: input.banner_image ?? null,
      highlight_color: input.highlight_color ?? null,
      start_date: input.start_date ?? null,
      end_date: input.end_date ?? null,
      tags: input.tags ?? null,
      seo_id: input.seo_id ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProjectService(id: string, input: Partial<ProjectInput>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function softDeleteProjectService(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("projects")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}
