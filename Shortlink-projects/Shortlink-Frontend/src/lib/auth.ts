import Cookies from 'js-cookie'

/**
 * Auth Utilities
 * Additional helper functions for React/Next.js
 */

// Cookie keys 
const TokenKey = 'token'
const USERNAME_KEY = 'username'

export function getToken(): string | undefined {
  return Cookies.get(TokenKey)
}

export function setToken(token: string, rememberMe?: boolean): void {
  // Set cookie with SameSite=None and Secure for cross-site requests
  // But for localhost, use SameSite=Lax to ensure middleware can read it
  const cookieOptions: Cookies.CookieAttributes = {
    sameSite: 'lax', // Allow cookie to be sent with same-site requests
    path: '/', // Make cookie available for all paths
  }
  
  if (rememberMe) {
    cookieOptions.expires = 7 // 7 days
  }
  
  Cookies.set(TokenKey, token, cookieOptions)
}

export function removeToken(): void {
  Cookies.remove(TokenKey)
}

export function removeKey(): void {
  removeToken()
}

// Username management 
export function getUsername(): string | undefined {
  return Cookies.get(USERNAME_KEY)
}

export function setUsername(username: string, rememberMe?: boolean): void {
  // Set cookie with SameSite=Lax to ensure middleware can read it
  const cookieOptions: Cookies.CookieAttributes = {
    sameSite: 'lax', // Allow cookie to be sent with same-site requests
    path: '/', // Make cookie available for all paths
  }
  
  if (rememberMe) {
    cookieOptions.expires = 7 // 7 days
  }
  
  Cookies.set(USERNAME_KEY, username, cookieOptions)
}

export function removeUsername(): void {
  Cookies.remove(USERNAME_KEY)
}

/**
 * Clear all auth data (token and username)
 */
export function clearAuth(): void {
  removeToken()
  removeUsername()
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken()
}
