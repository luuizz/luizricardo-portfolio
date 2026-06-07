import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/api/require-auth";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = await createSupabaseServerClient();
  const { data, error: dbError } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (dbError) {
    return NextResponse.json({ error: "Erro ao buscar posts." }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const supabase = await createSupabaseServerClient();
  const body = await request.json();

  const { title, slug, excerpt, status, content, tags, category } = body;
  const payload = {
    title,
    slug,
    excerpt,
    status: status ?? "draft",
    content,
    tags,
    category,
    user_id: user.id,
  };

  const { data, error: dbError } = await supabase
    .from("posts")
    .insert([payload])
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: "Erro ao criar post." }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const supabase = await createSupabaseServerClient();
  const body = await request.json();
  const { id, slug, title, excerpt, status, content, tags, category } = body;

  if (!id && !slug) {
    return NextResponse.json({ error: "ID ou slug obrigatório." }, { status: 400 });
  }

  const updates = {
    ...(title !== undefined && { title }),
    ...(excerpt !== undefined && { excerpt }),
    ...(status !== undefined && { status }),
    ...(content !== undefined && { content }),
    ...(tags !== undefined && { tags }),
    ...(category !== undefined && { category }),
    updated_at: new Date().toISOString(),
  };

  let query = supabase.from("posts").update(updates);
  if (id) {
    query = query.eq("id", id);
  } else {
    query = query.eq("slug", slug);
  }

  const { data, error: dbError } = await query.select().single();

  if (dbError) {
    return NextResponse.json({ error: "Erro ao atualizar post." }, { status: 400 });
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
    .from("posts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: "Erro ao excluir post." }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
