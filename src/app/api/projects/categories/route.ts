import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/api/require-auth";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = await createSupabaseServerClient();
  const { data, error: dbError } = await supabase
    .from("project_types")
    .select("*")
    .order("created_at", { ascending: false });

  if (dbError) {
    return NextResponse.json({ error: "Erro ao buscar tipos de projeto." }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = await createSupabaseServerClient();
  const body = await request.json();
  const { name, slug, status } = body;

  const { data, error: dbError } = await supabase
    .from("project_types")
    .insert([{ name, slug, status }])
    .select();

  if (dbError) {
    return NextResponse.json({ error: "Erro ao criar tipo de projeto." }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = await createSupabaseServerClient();
  const body = await request.json();
  const { id, name, slug, status } = body;

  if (!id) {
    return NextResponse.json({ error: "ID obrigatório." }, { status: 400 });
  }

  const updates = {
    ...(name !== undefined && { name }),
    ...(slug !== undefined && { slug }),
    ...(status !== undefined && { status }),
  };

  const { data, error: dbError } = await supabase
    .from("project_types")
    .update(updates)
    .eq("id", id)
    .select();

  if (dbError) {
    return NextResponse.json({ error: "Erro ao atualizar tipo de projeto." }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = await createSupabaseServerClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID obrigatório." }, { status: 400 });
  }

  const { error: dbError } = await supabase
    .from("project_types")
    .delete()
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: "Erro ao excluir tipo de projeto." }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
