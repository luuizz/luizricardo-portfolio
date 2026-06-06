"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Client, ClientSector } from "@/types/dashboard";

interface ClientInput {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  sector_id?: string;
  notes?: string;
  status?: "active" | "inactive";
}

interface SectorInput {
  name: string;
  slug: string;
}

// ── Clients ──────────────────────────────────────────────────────────

export async function getDashboardClients(): Promise<Client[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) { console.error("getDashboardClients:", error); return []; }
  return data ?? [];
}

export async function getClientBySlug(slug: string): Promise<Client | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", slug)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data;
}

export async function createClientService(input: ClientInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("clients")
    .insert({
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      company: input.company ?? null,
      sector_id: input.sector_id ?? null,
      notes: input.notes ?? null,
      status: input.status ?? "active",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateClientService(id: string, input: Partial<ClientInput>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("clients")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function softDeleteClientService(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("clients")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}

// ── Sectors ──────────────────────────────────────────────────────────

export async function getDashboardSectors(): Promise<ClientSector[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("client_sectors")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) { console.error("getDashboardSectors:", error); return []; }
  return data ?? [];
}

export async function getSectorBySlug(slug: string): Promise<ClientSector | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("client_sectors")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) return null;
  return data;
}

export async function createSectorService(input: SectorInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("client_sectors")
    .insert({ name: input.name, slug: input.slug })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateSectorService(id: string, input: Partial<SectorInput>) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("client_sectors")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function softDeleteSectorService(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("client_sectors")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}
