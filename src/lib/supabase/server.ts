import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export default async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (err) {
            if (process.env.NODE_ENV === "development") {
              console.warn("[Supabase] Erro ao setar cookies:", err);
            }
          }
        },
      },
    },
  );
}
