import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

// Cheap redirect based on cookie presence only — this is a UX shortcut,
// not the authorization boundary. The api/ service re-checks the real
// session on every request regardless, since proxy can't see whether
// the cookie is actually still valid.
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const { pathname } = request.nextUrl

  if (!sessionCookie && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (sessionCookie && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
}
