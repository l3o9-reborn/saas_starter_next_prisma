import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const adminOnlyPaths = ["/dashboard"]
const protectedPaths = ["/", "/profile", "/settings"] // Add any general protected pages here

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only run middleware on matching routes
  const isAdminPath = adminOnlyPaths.some(path => pathname.startsWith(path))
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path)) || isAdminPath

  if (!isProtectedPath) return NextResponse.next()

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // Not authenticated
  if (!token) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Admin-only route, but user is not admin
  if (isAdminPath && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", req.url)) // Or "/"
  }

  // Authenticated (and admin if needed)
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/profile/:path*", "/settings/:path*", "/dashboard/:path*"], // extend with more
}
