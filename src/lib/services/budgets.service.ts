"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Budget } from "@/types/dashboard";

interface BudgetInput {
  title: string;
  client_id?: string;
  total?: number;
  status?: "draft" | "sent" | "approved" | "rejected";
  notes?: string;
}

export async function getDashboardBudgets(): Promise<Budget[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) { console.error("getDashboardBudgets:", error); return []; }
  return data ?? [];
}

export async function getBudgetById(id: string): Promise<Budget | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data;
}

export async function createBudgetService(input: BudgetInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("budgets")
    .insert({
      title: input.title,
      client_id: input.client_id ?? null,
      total: input.total ?? null,
      status: input.status ?? "draft",
      notes: input.notes ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateBudgetService(id: string, input: Partial<BudgetInput>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("budgets")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function softDeleteBudgetService(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("budgets")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}
