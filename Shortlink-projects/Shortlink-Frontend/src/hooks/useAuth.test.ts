/// <reference types="jest" />
import { renderHook, waitFor, act } from '@testing-library/react'
import { useAuth } from './useAuth'
import * as auth from '@/src/lib/auth'
import * as api from '@/src/api'
import type { User } from '@/src/api/types'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock auth utilities
jest.mock('@/src/lib/auth', () => ({
  getToken: jest.fn(),
  setToken: jest.fn(),
  removeToken: jest.fn(),
  getUsername: jest.fn(),
  setUsername: jest.fn(),
  removeUsername: jest.fn(),
  clearAuth: jest.fn(),
}))

// Mock API functions
jest.mock('@/src/api', () => ({
  login: jest.fn(),
  register: jest.fn(),
  getCurrentUser: jest.fn(),
  logout: jest.fn(),
  queryUserInfo: jest.fn(),
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('useAuth Hook', () => {
  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    phone: '1234567890',
    realName: 'Test User',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.clear()
    mockPush.mockClear()
    ;(auth.getToken as jest.Mock).mockReturnValue(undefined)
    ;(auth.getUsername as jest.Mock).mockReturnValue(undefined)
  })

  // ============================================
  // Initial State and Authentication Check
  // ============================================
  describe('Initial State', () => {
    it('returns initial state', () => {
      const { result } = renderHook(() => useAuth())

      // Initial state checks
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
      // isLoading might be true initially, but useEffect runs async
      // So we just verify it exists
      expect(typeof result.current.isLoading).toBe('boolean')
    })

    it('checks authentication on mount when token exists', async () => {
      ;(auth.getToken as jest.Mock).mockReturnValue('valid-token')
      ;(api.getCurrentUser as jest.Mock).mockResolvedValue(mockUser)

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(mockUser)
      expect(api.getCurrentUser).toHaveBeenCalled()
    })

    it('sets unauthenticated when no token exists', async () => {
      ;(auth.getToken as jest.Mock).mockReturnValue(undefined)

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
      expect(api.getCurrentUser).not.toHaveBeenCalled()
    })

    it('clears auth and sets unauthenticated when token is invalid', async () => {
      ;(auth.getToken as jest.Mock).mockReturnValue('invalid-token')
      ;(api.getCurrentUser as jest.Mock).mockRejectedValue(new Error('Invalid token'))

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
      expect(auth.clearAuth).toHaveBeenCalled()
    })

    it('migrates token from localStorage to cookies on mount', async () => {
      localStorageMock.setItem('token', 'storage-token')
      localStorageMock.setItem('username', 'storage-user')
      ;(auth.getToken as jest.Mock).mockReturnValue(undefined)

      renderHook(() => useAuth())

      await waitFor(() => {
        expect(auth.setToken).toHaveBeenCalledWith('storage-token')
        expect(auth.setUsername).toHaveBeenCalledWith('storage-user')
      })
    })
  })

  // ============================================
  // Login Function
  // ============================================
  describe('Login', () => {
    it('logs in successfully and updates state', async () => {
      const loginResponse = {
        data: {
          token: 'new-token',
          user: mockUser,
        },
      }
      ;(api.login as jest.Mock).mockResolvedValue(loginResponse)

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.login({
          username: 'testuser',
          password: 'password',
          rememberMe: false,
        })
      })

      expect(auth.setToken).toHaveBeenCalledWith('new-token', false)
      expect(auth.setUsername).toHaveBeenCalledWith('testuser', false)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(mockUser)
      expect(mockPush).toHaveBeenCalledWith('/space')
    })

    it('saves token with expiration when rememberMe is true', async () => {
      const loginResponse = {
        data: {
          token: 'new-token',
          user: mockUser,
        },
      }
      ;(api.login as jest.Mock).mockResolvedValue(loginResponse)

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.login({
          username: 'testuser',
          password: 'password',
          rememberMe: true,
        })
      })

      expect(auth.setToken).toHaveBeenCalledWith('new-token', true)
      expect(auth.setUsername).toHaveBeenCalledWith('testuser', true)
    })

    it('redirects to specified redirect URL from query params', async () => {
      // Mock window.location.search
      Object.defineProperty(window, 'location', {
        value: {
          search: '?redirect=/custom',
        },
        writable: true,
      })

      const loginResponse = {
        data: {
          token: 'new-token',
          user: mockUser,
        },
      }
      ;(api.login as jest.Mock).mockResolvedValue(loginResponse)

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.login({
          username: 'testuser',
          password: 'password',
        })
      })

      expect(mockPush).toHaveBeenCalledWith('/custom')
    })

    it('handles login errors and throws', async () => {
      const error = new Error('Login failed')
      ;(api.login as jest.Mock).mockRejectedValue(error)

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await expect(
        act(async () => {
          await result.current.login({
            username: 'testuser',
            password: 'wrong',
          })
        })
      ).rejects.toThrow('Login failed')

      expect(result.current.isLoading).toBe(false)
    })
  })

  // ============================================
  // Register Function
  // ============================================
  describe('Register', () => {
    it('registers successfully and redirects to login', async () => {
      ;(api.register as jest.Mock).mockResolvedValue({ data: mockUser })

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.register({
          username: 'newuser',
          password: 'password',
          email: 'new@example.com',
        })
      })

      expect(api.register).toHaveBeenCalledWith({
        username: 'newuser',
        password: 'password',
        email: 'new@example.com',
      })
      expect(mockPush).toHaveBeenCalledWith('/login')
    })

    it('handles register errors and throws', async () => {
      const error = new Error('Registration failed')
      ;(api.register as jest.Mock).mockRejectedValue(error)

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await expect(
        act(async () => {
          await result.current.register({
            username: 'existinguser',
            password: 'password',
          })
        })
      ).rejects.toThrow('Registration failed')
    })
  })

  // ============================================
  // Logout Function
  // ============================================
  describe('Logout', () => {
    it('logs out successfully and clears auth', async () => {
      ;(auth.getToken as jest.Mock).mockReturnValue('token')
      ;(auth.getUsername as jest.Mock).mockReturnValue('user')
      ;(api.logout as jest.Mock).mockResolvedValue({})

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.logout()
      })

      expect(api.logout).toHaveBeenCalledWith({ token: 'token', username: 'user' })
      expect(auth.clearAuth).toHaveBeenCalled()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
      expect(mockPush).toHaveBeenCalledWith('/login')
    })

    it('clears auth even if logout API fails', async () => {
      ;(auth.getToken as jest.Mock).mockReturnValue('token')
      ;(auth.getUsername as jest.Mock).mockReturnValue('user')
      ;(api.logout as jest.Mock).mockRejectedValue(new Error('API failed'))

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.logout()
      })

      expect(auth.clearAuth).toHaveBeenCalled()
      expect(result.current.isAuthenticated).toBe(false)
      expect(mockPush).toHaveBeenCalledWith('/login')
    })

    it('does not call logout API if token or username missing', async () => {
      ;(auth.getToken as jest.Mock).mockReturnValue(undefined)
      ;(auth.getUsername as jest.Mock).mockReturnValue(undefined)

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.logout()
      })

      expect(api.logout).not.toHaveBeenCalled()
      expect(auth.clearAuth).toHaveBeenCalled()
    })
  })

  // ============================================
  // RefreshUser Function
  // ============================================
  describe('RefreshUser', () => {
    it('refreshes user data successfully', async () => {
      ;(api.getCurrentUser as jest.Mock).mockResolvedValue(mockUser)

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.refreshUser()
      })

      expect(api.getCurrentUser).toHaveBeenCalled()
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
    })

    it('redirects to login and clears auth when refresh fails', async () => {
      ;(api.getCurrentUser as jest.Mock).mockRejectedValue(new Error('Unauthorized'))

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.refreshUser()
      })

      expect(auth.clearAuth).toHaveBeenCalled()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })
})
