import apiClient from '../client'
import { getUsername } from '@/src/lib/auth'
import type { ApiResponse, LoginRequest, LoginResponse, RegisterRequest, User } from '../types'

/**
 * User API Module
 * Matches Vue implementation: api/modules/user.js
 */

// Register user (POST /api/shortlink/admin/v1/user)
// Backend endpoint: POST /api/shortlink/admin/v1/user
export const addUser = async (data: RegisterRequest): Promise<ApiResponse<User>> => {
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[User API] Register request:', {
      username: data.username,
      hasPassword: !!data.password,
      email: data.email,
      baseURL: apiClient.defaults.baseURL,
      fullURL: `${apiClient.defaults.baseURL}/user`,
    })
  }
  
  try {
    const response = await apiClient.post<ApiResponse<User>>('/user', data)
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[User API] Register response:', response.data)
    }
    
    return response.data
  } catch (error: any) {
    // Enhanced error logging
    if (process.env.NODE_ENV === 'development') {
      console.error('[User API] Register error:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          data: error.config?.data,
        },
      })
    }
    throw error
  }
}

// Alias for compatibility
export const register = async (data: RegisterRequest): Promise<User> => {
  const result = await addUser(data)
  return result.data
}

// Update user info (PUT /user)
export const editUser = async (data: Partial<User>): Promise<ApiResponse<User>> => {
  const response = await apiClient.put<ApiResponse<User>>('/user', data)
  return response.data
}

// Alias for compatibility
export const updateUser = async (data: Partial<User>): Promise<User> => {
  const result = await editUser(data)
  return result.data
}

// Login (POST /user/login)
export const login = async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    const fullUrl = `${apiClient.defaults.baseURL}/user/login`
    console.log('[User API] Login request:', { 
      username: data.username, 
      hasPassword: !!data.password,
      baseURL: apiClient.defaults.baseURL,
      fullURL: fullUrl,
      expectedProxy: 'http://localhost:8080/api/shortlink/admin/v1/user/login',
    })
  }
  
  try {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/user/login', data)
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[User API] Login response:', response.data)
    }
    
    return response.data
  } catch (error: any) {
    // Enhanced error logging
    if (process.env.NODE_ENV === 'development') {
      const fullUrl = `${apiClient.defaults.baseURL}/user/login`
      console.error('[User API] Login error:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
        requestURL: fullUrl,
        actualRequestURL: error.config?.url,
        actualBaseURL: error.config?.baseURL,
        headers: error.config?.headers,
      })
    }
    throw error
  }
}

// Logout (DELETE /user/logout?token=...&username=...)
export const logout = async (data: { token: string; username: string }): Promise<void> => {
  await apiClient.delete(`/user/logout?token=${data.token}&username=${data.username}`)
}

// Check if username is available (GET /user/isUsernameValidForRegistration with params)
// Backend endpoint: /api/shortlink/admin/v1/user/isUsernameValidForRegistration?username=xxx
// Returns ApiResponse<Boolean> - true if username is valid (not exists), false if exists
export const hasUsername = async (params: { username: string }): Promise<ApiResponse<boolean>> => {
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[User API] Check username availability:', params)
  }
  
  try {
    const response = await apiClient.get<ApiResponse<boolean>>('/user/isUsernameValidForRegistration', { params })
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[User API] Username availability response:', response.data)
    }
    
    return response.data
  } catch (error: any) {
    // Enhanced error logging
    if (process.env.NODE_ENV === 'development') {
      console.error('[User API] Check username error:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
      })
    }
    throw error
  }
}

// Query user info by username (GET /actual/{username})
// Backend endpoint: GET /api/shortlink/admin/v1/user/actual/{username}
export const queryUserInfo = async (username: string): Promise<ApiResponse<User>> => {
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[User API] Query user info by username:', username)
  }
  
  try {
    const response = await apiClient.get<ApiResponse<User>>(`/user/actual/${username}`)
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[User API] Query user info response:', response.data)
    }
    
    return response.data
  } catch (error: any) {
    // Enhanced error logging
    if (process.env.NODE_ENV === 'development') {
      console.error('[User API] Query user info error:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        username,
      })
    }
    throw error
  }
}

// Get current logged-in user info (GET /user/info)
// Backend endpoint: GET /api/shortlink/admin/v1/user/info
// Note: Backend should define /user/info BEFORE /user/{username} to avoid route conflict
// The endpoint extracts user info from Token header
export const getCurrentUser = async (): Promise<User> => {
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[User API] Getting current user info from /user/info')
  }
  
  try {
    // Call /user/info endpoint - backend will extract user from Token header
    const response = await apiClient.get<ApiResponse<User>>('/user/info')
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[User API] Current user response:', response.data)
    }
    
    // Backend returns ApiResponse<User>, extract the user data
    return response.data.data || response.data
  } catch (error: any) {
    // Enhanced error logging
    if (process.env.NODE_ENV === 'development') {
      console.error('[User API] Get current user error:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
    }
    throw error
  }
}
