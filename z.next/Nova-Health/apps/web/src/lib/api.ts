import { getAccessToken, setAccessToken, setRefreshToken, getRefreshToken } from './auth-utils';
import { refreshToken as refreshTokenApi } from '@/services/auth.service';

const BASE_URL = '/api';
const TIMEOUT = 10000;

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Add a callback to be executed when token refresh completes
 */
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

/**
 * Notify all subscribers that token refresh completed
 */
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

/**
 * Refresh the access token
 */
async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await refreshTokenApi(refreshToken);
    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken;
    
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    
    return newAccessToken;
  } catch (error) {
    // If refresh fails, clear tokens
    localStorage.removeItem('nova_access_token');
    localStorage.removeItem('nova_refresh_token');
    throw error;
  }
}

// Fetch wrapper with timeout and base URL
export async function api<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  // Get access token and add to headers
  const accessToken = getAccessToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    signal: controller.signal,
    headers,
    credentials: 'include', // send cookies for auth
  });

  clearTimeout(timeoutId);

  // Handle 401 Unauthorized - try to refresh token
  if (response.status === 401 && accessToken && !isRefreshing) {
    isRefreshing = true;
    
    try {
      const newToken = await refreshAccessToken();
      isRefreshing = false;
      onTokenRefreshed(newToken);
      
      // Retry the original request with new token
      return api<T>(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        },
      });
    } catch (error) {
      isRefreshing = false;
      // If refresh fails, redirect to login or throw error
      // For now, we'll throw the error
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json() as Promise<T>;
}
