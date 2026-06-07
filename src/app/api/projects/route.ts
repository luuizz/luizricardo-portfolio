import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/api/require-auth";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = await createSupabaseServerClient();
  const { data, error: dbError } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (dbError) {
    return NextResponse.json({ error: "Erro ao buscar projetos." }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = await createSupabaseServerClient();
  const body = await request.json();

  const {
    title, slug, summary, status, banner_image,
    highlight_color, start_date, end_date, content, tags,
  } = body;

  const payload = {
    title, slug, summary,
    status: status ?? "draft",
    banner_image, highlight_color, start_date, end_date, content, tags,
  };

  const { data, error: dbError } = await supabase
    .from("projects")
    .insert([payload])
    .select();

  if (dbError) {
    return NextResponse.json({ error: "Erro ao criar projeto." }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = await createSupabaseServerClient();
  const body = await request.json();
  const {
    id, title, slug, summary, status, banner_image,
    highlight_color, start_date, end_date, content, tags,
  } = body;

  if (!id) {
    return NextResponse.json({ error: "ID obrigatório." }, { status: 400 });
  }

  const updates = {
    ...(title !== undefined && { title }),
    ...(slug !== undefined && { slug }),
    ...(summary !== undefined && { summary }),
    ...(status !== undefined && { status }),
    ...(banner_image !== undefined && { banner_image }),
    ...(highlight_color !== undefined && { highlight_color }),
    ...(start_date !== undefined && { start_date }),
    ...(end_date !== undefined && { end_date }),
    ...(content !== undefined && { content }),
    ...(tags !== undefined && { tags }),
    updated_at: new Date().toISOString(),
  };

  const { data, error: dbError } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select();

  if (dbError) {
    return NextResponse.json({ error: "Erro ao atualizar projeto." }, { status: 400 });
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
    .from("projects")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: "Erro ao excluir projeto." }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
