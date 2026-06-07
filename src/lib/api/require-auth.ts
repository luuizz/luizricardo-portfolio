import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

type AuthResult =
  | { user: User; error: null }
  | { user: null; error: NextResponse };

export async function requireAuth(): Promise<AuthResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: "Não autorizado." }, { status: 401 }),
    };
  }

  return { user, error: null };
}
