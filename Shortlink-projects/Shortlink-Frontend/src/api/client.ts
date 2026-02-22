import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { getToken, getUsername, removeToken } from '@/src/lib/auth'
import { isNotEmpty } from '@/src/lib/utils'
import { message } from 'antd'

// Get API base URL from environment variable
// Match Vue implementation: baseURL should be '/api/shortlink/admin/v1'
// If NEXT_PUBLIC_API_BASE_URL is set, it should include the full path
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/shortlink/admin/v1'

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds (matching Vue implementation)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json', // Explicitly set Accept header for Next.js rewrites
  },
})

// Request interceptor - Add token and username to requests (matching Vue implementation)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    const username = getUsername()
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      const fullUrl = config.baseURL ? `${config.baseURL}${config.url}` : config.url
      console.log('[API Client] Request interceptor:', {
        baseURL: config.baseURL,
        url: config.url,
        fullURL: fullUrl,
        method: config.method?.toUpperCase(),
        hasToken: !!token,
        hasUsername: !!username,
        token: token ? `${token.substring(0, 10)}...` : 'missing',
        username: username || 'missing',
        headers: {
          'Content-Type': config.headers?.['Content-Type'],
          'Accept': config.headers?.['Accept'],
          'Token': config.headers?.Token ? 'present' : 'missing',
          'Username': config.headers?.Username ? 'present' : 'missing',
        },
        data: config.data ? (typeof config.data === 'string' ? config.data : JSON.stringify(config.data)) : undefined,
      })
    }
    
    // Add Token and Username headers (matching Vue implementation)
    if (config.headers) {
      config.headers.Token = isNotEmpty(token) ? token : ''
      config.headers.Username = isNotEmpty(username) ? username : ''
      
      // Warn if missing auth headers
      if (process.env.NODE_ENV === 'development' && (!token || !username)) {
        console.warn('[API Client] ⚠️ Missing authentication:', {
          hasToken: !!token,
          hasUsername: !!username,
          url: config.url,
        })
      }
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle responses and errors (matching Vue implementation)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Check if status is 0 or 200 (matching Vue implementation)
    // Vue checks: res.status == 0 || res.status == 200
    const status = response.status || response.data?.status
    
    if (status === 0 || status === 200) {
      // Request successful - return the response
      return Promise.resolve(response)
    }
    
    // If status doesn't match, reject
    return Promise.reject(response)
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login (matching Vue implementation)
    if (error.response?.status === 401) {
      // Clear auth data (matching Vue: localStorage.removeItem('token'))
      removeToken()
      
      // Redirect to login page (only in browser)
      // Vue uses: router.push('/login')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    
    // Handle network errors
    if (!error.response) {
      message.error('Network error. Please check your connection.')
      return Promise.reject(new Error('Network error. Please check your connection.'))
    }
    
    // Handle other errors
    const errorData = error.response?.data as any
    const errorMessage = errorData?.message || error.message || 'An error occurred'
    message.error(errorMessage)
    return Promise.reject(error)
  }
)

export default apiClient
