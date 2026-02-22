import apiClient from '../client'
import axios from 'axios'
import { getToken, getUsername } from '@/src/lib/auth'
import type {
  ApiResponse,
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
  PaginatedResponse,
} from '../types'

/**
 * Group API Module
 * Matches Vue implementation: api/modules/group.js
 */

// Query groups (GET /group with params)
export const queryGroup = async (params?: any): Promise<ApiResponse<Group[]>> => {
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Group API] Querying groups with params:', params)
  }
  
  try {
    const response = await apiClient.get<ApiResponse<Group[]>>('/group', { params })
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Group API] Query groups response:', response.data)
    }
    
    return response.data
  } catch (error: any) {
    // Enhanced error logging
    if (process.env.NODE_ENV === 'development') {
      console.error('[Group API] Query groups error:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
      })
    }
    throw error
  }
}

// Alias for compatibility
export const getGroups = async (params?: any): Promise<Group[]> => {
  const result = await queryGroup(params)
  return result.data
}

// Create group (POST /group)
export const addGroup = async (data: CreateGroupRequest): Promise<ApiResponse<Group>> => {
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Group API] Creating group:', data)
  }
  
  try {
    const response = await apiClient.post<ApiResponse<Group>>('/group', data)
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Group API] Create group response:', response.data)
    }
    
    return response.data
  } catch (error: any) {
    // Enhanced error logging
    if (process.env.NODE_ENV === 'development') {
      console.error('[Group API] Create group error:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
      })
    }
    throw error
  }
}

// Alias for compatibility
export const createGroup = async (data: CreateGroupRequest): Promise<Group> => {
  const result = await addGroup(data)
  return result.data
}

// Update group (PUT /group)
export const editGroup = async (data: UpdateGroupRequest): Promise<ApiResponse<Group>> => {
  const response = await apiClient.put<ApiResponse<Group>>('/group', data)
  return response.data
}

// Alias for compatibility
export const updateGroup = async (data: UpdateGroupRequest): Promise<Group> => {
  const result = await editGroup(data)
  return result.data
}

// Delete group (DELETE /group with params)
export const deleteGroup = async (data: { id?: string }): Promise<void> => {
  await apiClient.delete('/group', { params: data })
}

// Sort groups (POST /group/sort)
export const sortGroup = async (data: any): Promise<void> => {
  await apiClient.post('/group/sort', data)
}

// Alias for compatibility
export const updateGroupSortOrder = async (data: any): Promise<void> => {
  await sortGroup(data)
}

// Query group statistics (GET /api/shortlink/v1/stats/group with params)
// Backend endpoint: GET /api/shortlink/v1/stats/group
export const queryGroupStats = async (params?: any): Promise<ApiResponse<any>> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const token = getToken()
  const username = getUsername()
  
  // Shortlink service uses different base path: /api/shortlink/v1
  const backendUrl = apiBaseUrl ? apiBaseUrl.replace(/\/api\/shortlink\/admin\/v1$/, '') : 'http://localhost:8080'
  const fullUrl = `${backendUrl}/api/shortlink/v1/stats/group`
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Group API] Query group stats:', { url: fullUrl, params })
  }
  
  try {
    const response = await axios.get<ApiResponse<any>>(fullUrl, {
      params,
      headers: {
        Token: token || '',
        Username: username || '',
      },
      timeout: 15000,
    })
    return response.data
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Group API] Query group stats error:', {
        url: fullUrl,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
    }
    throw error
  }
}

// Alias for compatibility
export const getGroupStatistics = async (params?: any): Promise<any> => {
  const result = await queryGroupStats(params)
  return result.data
}

// Query group access records (GET /api/shortlink/v1/stats/group/access with params)
// Backend endpoint: GET /api/shortlink/v1/stats/group/access (not /stats/access-record/group)
export const queryGroupTable = async (params?: any): Promise<ApiResponse<any>> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const token = getToken()
  const username = getUsername()
  
  // Shortlink service uses different base path: /api/shortlink/v1
  const backendUrl = apiBaseUrl ? apiBaseUrl.replace(/\/api\/shortlink\/admin\/v1$/, '') : 'http://localhost:8080'
  const fullUrl = `${backendUrl}/api/shortlink/v1/stats/group/access`
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Group API] Query group access records:', { url: fullUrl, params })
  }
  
  try {
    const response = await axios.get<ApiResponse<any>>(fullUrl, {
      params,
      headers: {
        Token: token || '',
        Username: username || '',
      },
      timeout: 15000,
    })
    return response.data
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Group API] Query group access error:', {
        url: fullUrl,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
    }
    throw error
  }
}
