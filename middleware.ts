import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionId = request.cookies.get("auth-session")?.value;

  if (!sessionId) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // For API routes, we'll let the API handle session validation
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // For regular pages, validate session by calling our API
  try {
    const meUrl = new URL("/api/auth/me", request.url);
    const response = await fetch(meUrl, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (!response.ok) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    console.error("Session validation error:", error);
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$|manifest.json|browserconfig.xml).*)",
  ],
};
