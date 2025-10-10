"use client";

import { supabaseBrowser } from "@/lib/supabase/client";

export default function useSupabase() {
  return supabaseBrowser;
}
