import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isPublicRoute, hasValidToken } from '@/src/lib/middleware-utils'

/**
 * Next.js Middleware
 * Matches Vue router.beforeEach logic:
 * - Migrates token from localStorage to cookies (done in client-side)
 * - Allows /login route
 * - Checks if token exists - if yes, allow; if no, redirect to /login
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow /login route (matching Vue: if (to.path === '/login') next())
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Check if token exists (matching Vue: if (isNotEmpty(token)) next())
  if (hasValidToken(request)) {
    return NextResponse.next()
  }

  // Redirect to login if no token (matching Vue: else next('/login'))
  return NextResponse.redirect(new URL('/login', request.url))
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
