import { api } from '@/lib/api';

// Types
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface TwoFactorData {
  email: string;
  password: string;
  code: string;
  method: 'email' | 'sms';
}

export interface RequestTwoFactorData {
  email: string;
  method: 'email' | 'sms';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      role: string;
      isVerified: boolean;
    };
    accessToken: string;
    refreshToken: string;
    requiresTwoFactor?: boolean;
    requiresOTP?: boolean;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface VerifyEmailData {
  token: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface SendOTPData {
  email: string;
  purpose: 'login' | 'register' | 'password_reset';
}

export interface VerifyOTPData {
  email: string;
  code: string;
  purpose: 'login' | 'register' | 'password_reset';
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  return api<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Login user (step 1 - credentials)
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  return api<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Login with 2FA (step 2 - OTP verification)
 */
export async function loginWithTwoFactor(data: TwoFactorData): Promise<AuthResponse> {
  return api<AuthResponse>('/auth/login-2fa', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Request 2FA code
 */
export async function requestTwoFactorCode(data: RequestTwoFactorData): Promise<{ success: boolean; message: string }> {
  return api('/auth/request-2fa', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Send OTP code
 */
export async function sendOTP(data: SendOTPData): Promise<{ success: boolean; message: string }> {
  return api('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Verify OTP code
 */
export async function verifyOTP(data: VerifyOTPData): Promise<{ success: boolean; message: string; data?: any }> {
  return api('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
  return api<RefreshTokenResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

/**
 * Logout user
 */
export async function logout(refreshToken: string): Promise<{ success: boolean; message: string }> {
  return api('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

/**
 * Verify email address
 */
export async function verifyEmail(data: VerifyEmailData): Promise<{ success: boolean; message: string }> {
  return api('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Request password reset
 */
export async function forgotPassword(data: ForgotPasswordData): Promise<{ success: boolean; message: string }> {
  return api('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Reset password
 */
export async function resetPassword(data: ResetPasswordData): Promise<{ success: boolean; message: string }> {
  return api('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
