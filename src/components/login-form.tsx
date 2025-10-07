"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useForm from "@/hooks/useForm";
import { UserContext } from "@/context/UserContext";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  // campos de formulário
  const email = useForm("email");
  const password = useForm("password");

  // pega funções e estados do contexto
  const userCtx = React.useContext(UserContext);
  if (!userCtx) return null;

  const { userLogin, error, loading, login } = userCtx;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.validate() || !password.validate()) return;

    await userLogin(email.value, password.value);

    // se o login deu certo, redireciona
    if (login) router.push("/dashboard");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Entre com seu e-mail abaixo para logar na conta
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* EMAIL */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="luiz@email.com"
                value={email.value}
                onChange={email.onChange}
                onBlur={email.onBlur}
                required
              />
              {email.error && (
                <p className="text-sm text-red-500">{email.error}</p>
              )}
            </div>

            {/* SENHA */}
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password.value}
                onChange={password.onChange}
                onBlur={password.onBlur}
                required
              />
              {password.error && (
                <p className="text-sm text-red-500">{password.error}</p>
              )}
            </div>

            {/* ERRO GLOBAL */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
