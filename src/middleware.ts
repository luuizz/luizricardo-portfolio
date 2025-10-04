import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PRIVATE_PREFIX = "/dashboard";
const REDIRECT_WHEN_NOT_AUTHENTICATED = "/auth/login";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) =>
          request.cookies.set({ name, value, ...options }),
        remove: (name: string, options: any) =>
          request.cookies.set({ name, value: "", ...options }),
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (pathname.startsWith(PRIVATE_PREFIX)) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;

      request.cookies.delete("sb-access-token");
      request.cookies.delete("sb-refresh-token");
      request.cookies.delete("sb-auth-token");

      return NextResponse.redirect(redirectUrl);
    }
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
