import { NextRequest, NextResponse } from "next/server";

const PRIVATE_PREFIX = "/admin"; // tudo que começa com /admin é restrito
const REDIRECT_WHEN_NOT_AUTHENTICATED = "/auth/login";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("token");

  // 🔹 Só aplica regra se a rota começar com /admin
  if (pathname.startsWith(PRIVATE_PREFIX)) {
    // Se não estiver logado → manda pro login
    if (!authToken) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 🔹 Se não cair no caso acima → rota é pública
  return NextResponse.next();
}

export const config = {
  matcher: [
    // aplica em todas rotas exceto assets
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
