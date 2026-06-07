import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PRIVATE_PREFIX = "/dashboard";
const REDIRECT_WHEN_NOT_AUTHENTICATED = "/auth/login";
const REDIRECT_WHEN_AUTHENTICATED = "/dashboard";
const AUTH_PATHS = ["/auth/login", "/auth/sign-in"];

export default async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // getUser() valida o JWT no servidor Supabase e renova cookies de sessão
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redireciona usuários não autenticados para fora das rotas privadas
  if (pathname.startsWith(PRIVATE_PREFIX) && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
    redirectUrl.searchParams.set("redirectTo", pathname);

    response.cookies.delete("sb-access-token");
    response.cookies.delete("sb-refresh-token");
    response.cookies.delete("sb-auth-token");

    return NextResponse.redirect(redirectUrl);
  }

  // Redireciona usuários autenticados para fora das páginas de auth
  if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && user) {
    return NextResponse.redirect(
      new URL(REDIRECT_WHEN_AUTHENTICATED, request.url),
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
