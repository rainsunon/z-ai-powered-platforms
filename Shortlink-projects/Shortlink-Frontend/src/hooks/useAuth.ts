'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { login as loginApi, register as registerApi, getCurrentUser, logout as logoutApi, queryUserInfo } from '@/src/api'
import { setToken, removeToken, getToken, setUsername, removeUsername, getUsername, clearAuth } from '@/src/lib/auth'
import type { LoginRequest, RegisterRequest, User } from '@/src/api/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface UseAuthReturn extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Check authentication status on mount
  useEffect(() => {
    // Migrate token from localStorage to cookies (matching Vue router.beforeEach)
    // Vue: setToken(localStorage.getItem('token'))
    // Vue: setUsername(localStorage.getItem('username'))
    if (typeof window !== 'undefined') {
      const tokenFromStorage = localStorage.getItem('token')
      const usernameFromStorage = localStorage.getItem('username')
      
      if (tokenFromStorage) {
        setToken(tokenFromStorage)
      }
      if (usernameFromStorage) {
        setUsername(usernameFromStorage)
      }
    }
    
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = getToken()
    
    if (!token) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
      return
    }

    try {
      // Fetch current user info
      const user = await getCurrentUser()
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      // Token is invalid, clear auth
      clearAuth()
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const apiResponse = await loginApi(credentials)
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Login API response:', apiResponse)
      }
      
      // API returns ApiResponse<LoginResponse>
      // Backend response structure: { code: "0", data: { token: "...", userInfo: {...} } }
      // Note: Backend uses "userInfo" not "user"
      const response = apiResponse.data as any // Use 'any' temporarily to handle both userInfo and user
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Login API response:', apiResponse)
        console.log('[Auth] Login response data:', response)
        console.log('[Auth] Token:', response.token ? `${response.token.substring(0, 10)}...` : 'missing')
        console.log('[Auth] UserInfo:', response.userInfo || response.user || 'missing')
      }
      
      // Backend returns userInfo, but we'll support both userInfo and user for compatibility
      const user = (response.userInfo || response.user) as User | undefined
      const username = user?.username
      
      // Save token and username
      if (response.token && username) {
      setToken(response.token, credentials.rememberMe || false)
        setUsername(username, credentials.rememberMe || false)
        
        // Verify token and username were saved
        if (process.env.NODE_ENV === 'development') {
          const savedToken = getToken()
          const savedUsername = getUsername()
          console.log('[Auth] ✅ Token and username saved:', {
            tokenSaved: !!savedToken,
            usernameSaved: !!savedUsername,
            tokenMatch: savedToken === response.token,
            usernameMatch: savedUsername === username,
          })
        }
      } else {
        console.error('[Auth] ❌ Missing token or username in response:', response)
        throw new Error('Login response missing token or username')
      }
      
      // Update state
      setState({
        user: user || null,
        isAuthenticated: true,
        isLoading: false,
      })

      // Redirect to dashboard or specified redirect URL
      // Default to /home/space (main dashboard page)
      // IMPORTANT: Always redirect to /home/space, not /home, to avoid RSC request issues
      const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/home/space'
      
      // Ensure redirect URL doesn't have query parameters that might cause issues
      const cleanRedirectUrl = redirectUrl.split('?')[0]
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] ✅ Login successful, preparing redirect...')
        console.log('[Auth] Redirect URL:', cleanRedirectUrl)
        console.log('[Auth] Token saved, cookie should be available:', {
          token: getToken() ? 'present' : 'missing',
          username: getUsername() ? 'present' : 'missing',
        })
      }
      
      // Use window.location.href for full page reload to ensure middleware can read the cookie
      // This is critical because:
      // 1. Cookie needs to be available on the server side for middleware to read
      // 2. Client-side navigation (router.replace) doesn't trigger a full page reload
      // 3. Middleware runs on the server and needs the cookie in the request headers
      // 4. A small delay ensures the cookie is fully set before navigation
      setTimeout(() => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Auth] 🚀 Executing redirect to:', cleanRedirectUrl)
          console.log('[Auth] Final token check:', {
            token: getToken() ? 'present' : 'missing',
            username: getUsername() ? 'present' : 'missing',
            cookieToken: typeof document !== 'undefined' ? document.cookie.includes('token=') : 'N/A',
          })
        }
        
        if (typeof window !== 'undefined') {
          // Use window.location.href for full page reload
          // This ensures the cookie is sent with the request and middleware can read it
          window.location.href = cleanRedirectUrl
        } else {
          router.replace(cleanRedirectUrl)
        }
      }, 300) // Increased delay to ensure cookie is fully set and synced
    } catch (error) {
      console.error('[Auth] Login error:', error)
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [router])

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Register request:', userData)
      }
      
      // API returns ApiResponse<User>, so we need to access .data
      const result = await registerApi(userData)
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Auth] Register response:', result)
      }
      
      // Clear any existing auth data before registration completes
      // This ensures a clean state
      removeToken()
      removeUsername()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
      }
      
      // Reset auth state
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
      
      // Note: Don't redirect here - let the calling component handle the redirect
      // This allows the login page to switch to login form instead of navigating away
    } catch (error) {
      console.error('[Auth] Register error:', error)
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      // Get token and username before clearing auth
      const token = getToken()
      const username = getUsername()
      
      // Call logout API with token and username (matching Vue implementation)
      if (token && username) {
        await logoutApi({ token, username }).catch(() => {
          // Ignore errors if logout API fails
        })
      }
    } finally {
      // Clear local auth data
      clearAuth()
      
      // Update state
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })

      // Redirect to login
      router.push('/login')
    }
  }, [router])

  const refreshUser = useCallback(async () => {
    try {
      const user = await getCurrentUser()
      setState((prev) => ({
        ...prev,
        user,
        isAuthenticated: true,
      }))
    } catch (error) {
      // If refresh fails, user might not be authenticated
      clearAuth()
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
      router.push('/login')
    }
  }, [router])

  return {
    ...state,
    login,
    register,
    logout,
    refreshUser,
  }
}
