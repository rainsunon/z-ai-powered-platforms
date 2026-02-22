import apiClient from '../client'
import axios from 'axios'
import { getToken, getUsername } from '@/src/lib/auth'
import type {
  ApiResponse,
  ShortLink,
  CreateShortLinkRequest,
  BatchCreateShortLinkRequest,
  UpdateShortLinkRequest,
  ShortLinkListParams,
  RecycleBinListParams,
  PaginatedResponse,
  AnalyticsResponse,
} from '../types'

/**
 * Short Link API Module
 * Matches Vue implementation: api/modules/smallLinkPage.js
 */

// Query short links page (POST /api/shortlink/v1/links/page)
// Backend endpoint: POST /api/shortlink/v1/links/page (not GET)
// Backend expects: { gid, orderTag, pageNo, pageSize }
export const queryPage = async (params?: ShortLinkListParams): Promise<ApiResponse<PaginatedResponse<ShortLink>>> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const token = getToken()
  const username = getUsername()
  
  // Shortlink service uses different base path: /api/shortlink/v1
  // Extract base URL (remove /api/shortlink/admin/v1 suffix if present)
  const backendUrl = apiBaseUrl ? apiBaseUrl.replace(/\/api\/shortlink\/admin\/v1$/, '') : 'http://localhost:8080'
  const fullUrl = `${backendUrl}/api/shortlink/v1/links/page`
  
  // Map frontend params to backend format: current -> pageNo, size -> pageSize
  // Backend expects: { gid?, orderTag?, pageNo, pageSize, enableStatus? }
  const requestBody: any = {
    pageNo: params?.current ?? 1,  // Default to 1 if not provided
    pageSize: params?.size ?? 15,  // Default to 15 if not provided
  }
  
  // Only include gid if it's not null/undefined (backend may handle null differently)
  if (params?.gid !== null && params?.gid !== undefined) {
    requestBody.gid = params.gid
  }
  
  // Only include orderTag if provided
  if (params?.orderTag) {
    requestBody.orderTag = params.orderTag
  }
  
  // Filter out deleted items (enableStatus === 1) - only show active items (enableStatus === 0 or undefined)
  // If enableStatus is explicitly set, use it; otherwise default to 0 (active only)
  if (params?.enableStatus !== undefined) {
    requestBody.enableStatus = params.enableStatus
  } else {
    // Default to only show active items (enableStatus === 0)
    requestBody.enableStatus = 0
  }
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[API] Query page:', { url: fullUrl, originalParams: params, requestBody })
  }
  
  try {
    // Use POST method with body (matching Postman collection)
    const response = await axios.post<ApiResponse<PaginatedResponse<ShortLink>>>(fullUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Token: token || '',
        Username: username || '',
      },
      timeout: 15000,
    })
  return response.data
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Query page error:', {
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
export const getShortLinks = async (params?: ShortLinkListParams): Promise<PaginatedResponse<ShortLink>> => {
  const result = await queryPage(params)
  return result.data
}

// Create single short link (POST /api/shortlink/v1/links/create)
// Note: This endpoint has a different base path than the main API
export const addSmallLink = async (data: CreateShortLinkRequest): Promise<ApiResponse<ShortLink>> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const token = getToken()
  const username = getUsername()
  
  // If API base URL is set (using real backend), construct full URL
  // Otherwise, use relative path (will be intercepted by MSW)
  if (apiBaseUrl) {
    // Real backend: construct full URL
    // Extract base URL (remove /api/shortlink/admin/v1 suffix if present)
    const backendUrl = apiBaseUrl.replace(/\/api\/shortlink\/admin\/v1$/, '') || 'http://localhost:8080'
    const fullUrl = `${backendUrl}/api/shortlink/v1/links/create`
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[API] Creating short link:', {
        url: fullUrl,
        data,
        hasToken: !!token,
        username,
      })
    }
    
    try {
    // Use axios directly with full URL and auth headers
    const response = await axios.post<ApiResponse<ShortLink>>(fullUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        Token: token || '',
        Username: username || '',
      },
      timeout: 15000,
    })
    return response.data
    } catch (error: any) {
      // Enhanced error logging
      if (process.env.NODE_ENV === 'development') {
        console.error('[API] Create link error:', {
          url: fullUrl,
          error: error.message,
          response: error.response?.data,
          status: error.response?.status,
          code: error.code,
        })
      }
      
      // If it's a network error (ECONNREFUSED, etc.), provide helpful message
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || !error.response) {
        const errorMsg = `无法连接到后端服务器 ${backendUrl}。请确保后端服务正在运行。`
        throw new Error(errorMsg)
      }
      
      throw error
    }
  } else {
    // Mock Server: use relative path (MSW will intercept /api/shortlink/v1/links/create)
    if (process.env.NODE_ENV === 'development') {
      console.log('[API] Using MSW mock server for create link')
    }
    
    const response = await axios.post<ApiResponse<ShortLink>>('/api/shortlink/v1/links/create', data, {
      headers: {
        'Content-Type': 'application/json',
        Token: token || '',
        Username: username || '',
      },
      timeout: 15000,
    })
    return response.data
  }
}

// Alias for compatibility
export const createShortLink = async (data: CreateShortLinkRequest): Promise<ShortLink> => {
  const result = await addSmallLink(data)
  return result.data
}

// Batch create short links (POST /api/shortlink/v1/links/create/batch)
// Backend endpoint: POST /api/shortlink/v1/links/create/batch
export const addLinks = async (data: BatchCreateShortLinkRequest): Promise<ArrayBuffer> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const token = getToken()
  const username = getUsername()
  
  // Shortlink service uses different base path: /api/shortlink/v1
  const backendUrl = apiBaseUrl ? apiBaseUrl.replace(/\/api\/shortlink\/admin\/v1$/, '') : 'http://localhost:8080'
  const fullUrl = `${backendUrl}/api/shortlink/v1/links/create/batch`
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[API] Batch create links:', { url: fullUrl, data })
  }
  
  try {
    const response = await axios.post<ArrayBuffer>(fullUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        Token: token || '',
        Username: username || '',
      },
    responseType: 'arraybuffer',
      timeout: 30000, // Longer timeout for batch operations
  })
  return response.data
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Batch create error:', {
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
export const batchCreateShortLinks = async (data: BatchCreateShortLinkRequest): Promise<ArrayBuffer> => {
  return await addLinks(data)
}

// Update short link (PUT /api/shortlink/v1/links/update)
// Backend endpoint: PUT /api/shortlink/v1/links/update (not POST)
export const editSmallLink = async (data: UpdateShortLinkRequest): Promise<ApiResponse<ShortLink>> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const token = getToken()
  const username = getUsername()
  
  // Shortlink service uses different base path: /api/shortlink/v1
  const backendUrl = apiBaseUrl ? apiBaseUrl.replace(/\/api\/shortlink\/admin\/v1$/, '') : 'http://localhost:8080'
  const fullUrl = `${backendUrl}/api/shortlink/v1/links/update`
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[API] Update short link:', { url: fullUrl, data })
  }
  
  try {
    // Use PUT method (matching Postman collection)
    const response = await axios.put<ApiResponse<ShortLink>>(fullUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        Token: token || '',
        Username: username || '',
      },
      timeout: 15000,
    })
  return response.data
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Update link error:', {
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
export const updateShortLink = async (data: UpdateShortLinkRequest): Promise<ShortLink> => {
  const result = await editSmallLink(data)
  return result.data
}

// Query title by URL (GET /api/shortlink/v1/title?url=xxx)
// Backend endpoint: GET /api/shortlink/v1/title
export const queryTitle = async (params: { url: string }): Promise<ApiResponse<{ title?: string }>> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const token = getToken()
  const username = getUsername()
  
  // Shortlink service uses different base path: /api/shortlink/v1
  const backendUrl = apiBaseUrl ? apiBaseUrl.replace(/\/api\/shortlink\/admin\/v1$/, '') : 'http://localhost:8080'
  const fullUrl = `${backendUrl}/api/shortlink/v1/title`
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[API] Query title:', { url: fullUrl, params })
  }
  
  try {
    const response = await axios.get<ApiResponse<{ title?: string }>>(fullUrl, {
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
      console.error('[API] Query title error:', {
        url: fullUrl,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
    }
    throw error
  }
}

// Move to trash (POST /api/shortlink/v1/trash/save)
// Backend endpoint: POST /api/shortlink/v1/trash/save (not /recycle-bin/save)
export const toRecycleBin = async (data: { id?: string; gid?: string; fullShortUrl?: string }): Promise<void> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const token = getToken()
  const username = getUsername()
  
  // Shortlink service uses different base path: /api/shortlink/v1
  const backendUrl = apiBaseUrl ? apiBaseUrl.replace(/\/api\/shortlink\/admin\/v1$/, '') : 'http://localhost:8080'
  const fullUrl = `${backendUrl}/api/shortlink/v1/trash/save`
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[API] Save to trash:', { url: fullUrl, data })
  }
  
  try {
    await axios.post(fullUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        Token: token || '',
        Username: username || '',
      },
      timeout: 15000,
    })
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Save to trash error:', {
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
export const deleteShortLink = async (data: { id: string }): Promise<void> => {
  await toRecycleBin(data)
}

// Query trash list (GET /api/shortlink/v1/trash/list?pageNum=1&pageSize=20)
// Backend endpoint: GET /api/shortlink/v1/trash/list (not /recycle-bin/page)
// Query recycle bin (POST /api/shortlink/v1/trash/list)
// Backend expects: { gidList: string[], pageNum: number, pageSize: number }
export const queryRecycleBin = async (params?: RecycleBinListParams): Promise<ApiResponse<PaginatedResponse<ShortLink>>> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const token = getToken()
  const username = getUsername()
  
  // Shortlink service uses different base path: /api/shortlink/v1
  const backendUrl = apiBaseUrl ? apiBaseUrl.replace(/\/api\/shortlink\/admin\/v1$/, '') : 'http://localhost:8080'
  const fullUrl = `${backendUrl}/api/shortlink/v1/trash/list`
  
  // Map params: current -> pageNum, size -> pageSize, gidList -> gidList
  const requestBody: {
    gidList?: string[]
    pageNum: number
    pageSize: number
  } = {
    pageNum: params?.current || 1,
    pageSize: params?.size || 10,
  }
  
  // Include gidList if provided
  if (params?.gidList && params.gidList.length > 0) {
    requestBody.gidList = params.gidList
  }
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[API] Query trash list:', { url: fullUrl, requestBody })
  }
  
  try {
    // Use POST method with body (matching backend DTO)
    const response = await axios.post<ApiResponse<PaginatedResponse<ShortLink>>>(fullUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Token: token || '',
        Username: username || '',
      },
      timeout: 15000,
    })
    return response.data
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Query trash error:', {
        url: fullUrl,
        requestBody,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
    }
    throw error
  }
}

// Alias for compatibility
export const getRecycleBinLinks = async (params?: RecycleBinListParams): Promise<PaginatedResponse<ShortLink>> => {
  const result = await queryRecycleBin(params)
  return result.data
}

// Recover link from trash (PUT /api/shortlink/v1/trash/recover)
// Backend endpoint: PUT /api/shortlink/v1/trash/recover (not POST /recycle-bin/recover)
export const recoverLink = async (data: { id?: string; gid?: string; fullShortUrl?: string }): Promise<void> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const token = getToken()
  const username = getUsername()
  
  // Shortlink service uses different base path: /api/shortlink/v1
  const backendUrl = apiBaseUrl ? apiBaseUrl.replace(/\/api\/shortlink\/admin\/v1$/, '') : 'http://localhost:8080'
  const fullUrl = `${backendUrl}/api/shortlink/v1/trash/recover`
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[API] Recover from trash:', { url: fullUrl, data })
  }
  
  try {
    // Use PUT method (matching Postman collection)
    await axios.put(fullUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        Token: token || '',
        Username: username || '',
      },
      timeout: 15000,
    })
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Recover error:', {
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
export const restoreShortLink = async (data: { id: string }): Promise<void> => {
  await recoverLink(data)
}

// Permanently remove link (DELETE /api/shortlink/v1/trash/remove)
// Backend endpoint: DELETE /api/shortlink/v1/trash/remove (not POST /recycle-bin/remove)
export const removeLink = async (data: { id?: string; gid?: string; fullShortUrl?: string }): Promise<void> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const token = getToken()
  const username = getUsername()
  
  // Shortlink service uses different base path: /api/shortlink/v1
  const backendUrl = apiBaseUrl ? apiBaseUrl.replace(/\/api\/shortlink\/admin\/v1$/, '') : 'http://localhost:8080'
  const fullUrl = `${backendUrl}/api/shortlink/v1/trash/remove`
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[API] Remove permanently:', { url: fullUrl, data })
  }
  
  try {
    // Use DELETE method with body (matching Postman collection)
    await axios.delete(fullUrl, {
      data,
      headers: {
        'Content-Type': 'application/json',
        Token: token || '',
        Username: username || '',
      },
      timeout: 15000,
    })
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Remove error:', {
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
export const permanentlyDeleteShortLink = async (data: { id: string }): Promise<void> => {
  await removeLink(data)
}

// Query link statistics (GET /api/shortlink/v1/stats with params)
// Backend endpoint: GET /api/shortlink/v1/stats
export const queryLinkStats = async (params?: any): Promise<ApiResponse<AnalyticsResponse>> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const token = getToken()
  const username = getUsername()
  
  // Shortlink service uses different base path: /api/shortlink/v1
  const backendUrl = apiBaseUrl ? apiBaseUrl.replace(/\/api\/shortlink\/admin\/v1$/, '') : 'http://localhost:8080'
  const fullUrl = `${backendUrl}/api/shortlink/v1/stats`
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[API] Query link stats:', { url: fullUrl, params })
  }
  
  try {
    const response = await axios.get<ApiResponse<AnalyticsResponse>>(fullUrl, {
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
      console.error('[API] Query stats error:', {
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
export const getShortLinkAnalytics = async (params?: any): Promise<AnalyticsResponse> => {
  const result = await queryLinkStats(params)
  return result.data
}

// Query link access records (GET /api/shortlink/v1/stats/access with params)
// Backend endpoint: GET /api/shortlink/v1/stats/access (not /stats/access-record)
export const queryLinkTable = async (params?: any): Promise<ApiResponse<any>> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const token = getToken()
  const username = getUsername()
  
  // Shortlink service uses different base path: /api/shortlink/v1
  const backendUrl = apiBaseUrl ? apiBaseUrl.replace(/\/api\/shortlink\/admin\/v1$/, '') : 'http://localhost:8080'
  const fullUrl = `${backendUrl}/api/shortlink/v1/stats/access`
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[API] Query access records:', { url: fullUrl, params })
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
      console.error('[API] Query access records error:', {
        url: fullUrl,
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
    }
    throw error
  }
}
