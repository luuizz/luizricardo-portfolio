import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  { path: "/", whenAuthenticated: "next" }, // raiz pública
  { path: "/login", whenAuthenticated: "redirect" },
  { path: "/sign-in", whenAuthenticated: "redirect" },
];

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/"; // agora manda pra raiz

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);

  const authToken = request.cookies.get("token");

  // 🔹 Se NÃO estiver logado e tentando acessar rota pública → deixa passar
  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  // 🔹 Se NÃO estiver logado e rota NÃO for pública → redireciona pra raiz
  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  // 🔹 Se estiver logado e acessar rota pública (login/sign-in) → manda pra raiz
  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === "redirect"
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  // 🔹 Se estiver logado em rota privada → segue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
