import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(
  request: NextRequest
) {

  const token =
    request.cookies.get("token");

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/auth");

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/user");

  /*
    If user is logged in and tries to visit auth page
  */
  if (token && isAuthPage) {

    return NextResponse.redirect(
      new URL("/user/home", request.url)
    );
  }

  /*
    If user is NOT logged in and tries protected routes
  */
  if (!token && isProtectedRoute) {

    return NextResponse.redirect(
      new URL("/auth", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/user/:path*",
  ],
};
