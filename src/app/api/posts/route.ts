import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// ===================================================
// GET - Lista todos os posts
// ===================================================
export async function GET() {
  const supabase = await createSupabaseServerClient(); // ✅ await

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// ===================================================
// POST - Cria um novo post
// ===================================================
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const body = await request.json();

  // ✅ Pegamos o ID do usuário autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { message: "Usuário não autenticado." },
      { status: 401 },
    );
  }

  const payload = {
    ...body,
    status: body.status ?? "draft",
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from("posts")
    .insert([payload])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}

// ===================================================
// PUT - Atualiza um post
// ===================================================
export async function PUT(request: Request) {
  const supabase = await createSupabaseServerClient();
  const body = await request.json();

  const { id, slug, ...updates } = body;

  if (!id && !slug) {
    return NextResponse.json(
      { message: "Missing post ID or slug" },
      { status: 400 },
    );
  }

  let query = supabase.from("posts").update({
    ...updates,
    updated_at: new Date().toISOString(), // ✅ força atualização
  });

  // ✅ aplica WHERE conforme o identificador disponível
  if (id) {
    query = query.eq("id", id);
  } else if (slug) {
    query = query.eq("slug", slug);
  }

  const { data, error } = await query.select().single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}

// ===================================================
// DELETE - Exclui um post
// ===================================================
export async function DELETE(request: Request) {
  const supabase = await createSupabaseServerClient(); // ✅ await
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
