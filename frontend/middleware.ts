import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protect routes that belong to the authenticated route-group. We base protection
// on the presence of the HTTP-only refresh cookie. If the refresh cookie is
// missing we redirect to /login. If it's present we allow the request and the
// client will perform a silent refresh to obtain an access token.

const PROTECTED_PATHS = ["/dashboard"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow next internals, api and static
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // if path is protected, check refresh cookie
  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!isProtected) return NextResponse.next();

  const refresh = req.cookies.get("refreshToken")?.value;
  if (!refresh) {
    const loginUrl = new URL("/login", req.url);
    // preserve original path so we can redirect after login if desired
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
