"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash; // supabase manda token no fragmento #
    if (hash) {
      supabaseBrowser.auth
        .exchangeCodeForSession(window.location.href)
        .then(() => {
          router.push("/dashboard"); // redireciona depois do login
        });
    }
  }, [router]);

  return <p>Validando login...</p>;
}
