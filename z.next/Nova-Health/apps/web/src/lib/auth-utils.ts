// Token storage keys
const ACCESS_TOKEN_KEY = 'nova_access_token';
const REFRESH_TOKEN_KEY = 'nova_refresh_token';
const USER_DATA_KEY = 'nova_user_data';

/**
 * Store access token in localStorage
 */
export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Remove access token from localStorage
 */
export function removeAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

/**
 * Store refresh token in localStorage
 */
export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Remove refresh token from localStorage
 */
export function removeRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Store user data in localStorage
 */
export function setUserData(data: any): void {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
}

/**
 * Get user data from localStorage
 */
export function getUserData(): any | null {
  const data = localStorage.getItem(USER_DATA_KEY);
  return data ? JSON.parse(data) : null;
}

/**
 * Remove user data from localStorage
 */
export function removeUserData(): void {
  localStorage.removeItem(USER_DATA_KEY);
}

/**
 * Clear all auth data from localStorage
 */
export function clearAuthData(): void {
  removeAccessToken();
  removeRefreshToken();
  removeUserData();
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
