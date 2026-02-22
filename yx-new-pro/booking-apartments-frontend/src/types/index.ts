// Auth types
export interface LoginRequest {
  email: string;
  password: string;
  deviceId?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresInSeconds: number;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface SessionResponse {
  id: string;
  deviceId: string;
  createdAt: string;
  lastUsedAt: string;
  revokedAt: string | null;
}

// Apartment types
export interface ApartmentCreateRequest {
  name: string;
  city: string;
  capacity: number;
}

export interface ApartmentResponse {
  id: string;
  name: string;
  city: string;
  capacity: number;
  createdAt: string;
}

export interface AvailabilityResponse {
  apartmentId: string;
  from: string;
  to: string;
  available: boolean;
}

// Booking types
export interface BookingHoldRequest {
  apartmentId: string;
  startDate: string;
  endDate: string;
}

export interface BookingResponse {
  id: string;
  apartmentId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConfirmBookingRequest {
  paymentRef: string;
}

export enum BookingStatus {
  HOLD = 'HOLD',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

// Common types
export interface PagedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  correlationId: string;
}

// Search params
export interface SearchParams {
  city?: string;
  capacity?: number;
  from: string;
  to: string;
  page?: number;
  size?: number;
}

// User authentication state
export interface User {
  id: string;
  email: string;
  roles: string[];
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
