"use client";

import React from "react";
import { supabaseBrowser } from "@/lib/supabase/client"; // seu client já configurado
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

interface UserContextProps {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: boolean;
  userLogin: (email: string, password: string) => Promise<void>;
  userLogout: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextProps | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [login, setLogin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 🔹 LOGIN
  async function userLogin(email: string, password: string) {
    try {
      setError(null);
      setLoading(true);
      const { data, error } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      setUser(data.user);
      setLogin(true);
      router.push("/dashboard"); // redireciona se quiser
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro inesperado ao fazer login");
      }
      setLogin(false);
    } finally {
      setLoading(false);
    }
  }

  async function userLogout() {
    await supabaseBrowser.auth.signOut();
    setUser(null);
    setLogin(false);
    setError(null);
    router.push("/auth/login");
  }

  React.useEffect(() => {
    const restoreSession = async () => {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabaseBrowser.auth.getUser();

      if (user) {
        setUser(user);
        setLogin(true);
      } else {
        setUser(null);
        setLogin(false);
      }

      if (error) console.warn("[Supabase Auth]", error.message);
      setLoading(false);
    };

    restoreSession();

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLogin(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        userLogin,
        userLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
