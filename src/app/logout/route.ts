// app/logout/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookies().set(cookiesToSet);
        },
      },
    },
  );

  await supabase.auth.signOut();

  return NextResponse.redirect(
    new URL("/auth/login", process.env.NEXT_PUBLIC_SITE_URL),
  );
}
