import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/game"];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = !!accessToken && !!refreshToken;

  const pathname = request.nextUrl.pathname;

  // Redirect to signin if not authenticated
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  // TODO: Change redirect link
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}
