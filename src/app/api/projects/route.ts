import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// ===================================================
// GET - Lista todos os projetos
// ===================================================
export async function GET() {
  const supabase = await createSupabaseServerClient(); // ✅ await

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// ===================================================
// POST - Cria um novo projeto
// ===================================================
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient(); // ✅ await
  const body = await request.json();

  const { data, error } = await supabase
    .from("projects")
    .insert([body])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}

// ===================================================
// PUT - Atualiza um projeto
// ===================================================
export async function PUT(request: Request) {
  const supabase = await createSupabaseServerClient(); // ✅ await
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}

// ===================================================
// DELETE - Exclui um projeto
// ===================================================
export async function DELETE(request: Request) {
  const supabase = await createSupabaseServerClient(); // ✅ await
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
