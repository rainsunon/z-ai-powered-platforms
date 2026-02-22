import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
export const publicRoutes = ['/login', '/register']

/**
 * Check if a route is public (doesn't require authentication)
 * @param pathname - The route pathname
 * @returns true if the route is public
 */
export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname.startsWith(route))
}

/**
 * Check if user has a valid token in cookies
 * @param request - Next.js request object
 * @returns true if token exists
 */
export function hasValidToken(request: NextRequest): boolean {
  const token = request.cookies.get('token')
  return !!token?.value
}
