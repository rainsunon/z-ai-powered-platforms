// ============================================
// API Types
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// User Types
// ============================================

export interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'family_member' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  avatar?: string;
  bio?: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  lastPasswordChange?: string;
  passwordHistory: string[];
  loginAttempts: number;
  lockedUntil?: string;
}

export interface UserPreferences {
  language?: string;
  timezone?: string;
  theme?: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    appointmentReminders: boolean;
    medicationReminders: boolean;
    healthAlerts: boolean;
  };
  privacy: {
    shareHealthData: boolean;
    shareWithFamily: boolean;
    allowResearch: boolean;
  };
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  isPrimary: boolean;
}

// ============================================
// Appointment Types
// ============================================

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export type AppointmentType = 'checkup' | 'consultation' | 'followup' | 'procedure' | 'emergency' | 'therapy' | 'lab_work';

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  type: AppointmentType;
  status: AppointmentStatus;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  notes?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentData {
  type: AppointmentType;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  notes?: string;
}

// ============================================
// Medication Types
// ============================================

export type MedicationType = 'prescription' | 'over_the_counter' | 'supplement' | 'herbal';

export interface Medication {
  id: string;
  userId: string;
  name: string;
  type: MedicationType;
  dosage: string;
  frequency: string;
  instructions?: string;
  startDate: string;
  endDate?: string;
  active: boolean;
  prescribedBy?: string;
  pharmacyId?: string;
  refillInfo?: {
    remaining: number;
    nextRefillDate?: string;
  };
  sideEffects?: string[];
  interactions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicationData {
  name: string;
  type: MedicationType;
  dosage: string;
  frequency: string;
  instructions?: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  pharmacyId?: string;
  sideEffects?: string[];
  interactions?: string[];
}

// ============================================
// Family Types
// ============================================

export interface FamilyMember {
  id: string;
  userId: string;
  familyId: string;
  role: 'primary' | 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
  permissions: FamilyPermission;
  healthData: {
    conditions?: string[];
    allergies?: string[];
    medications?: string[];
    bloodType?: string;
  };
  emergencyContact: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyInvitation {
  id: string;
  familyId: string;
  invitedBy: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: string;
  createdAt: string;
}

export type FamilyPermission = 'view' | 'edit' | 'admin';

// ============================================
// Billing Types
// ============================================

export type PaymentMethodStatus = 'active' | 'inactive' | 'expired' | 'cancelled';

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'credit_card' | 'debit_card' | 'bank_account';
  isDefault: boolean;
  status: PaymentMethodStatus;
  cardDetails?: {
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  };
  bankDetails?: {
    last4: string;
    bankName: string;
    routingNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'past_due' | 'cancelled' | 'expired';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  features: string[];
}

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  dueDate: string;
  paidAt?: string;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  invoiceId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethodId: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Health Data Types
// ============================================

export interface VitalReading {
  id: string;
  userId: string;
  type: 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'weight' | 'temperature' | 'oxygen_saturation';
  value: number;
  unit: string;
  timestamp: string;
  notes?: string;
  deviceId?: string;
}

export type SymptomSeverity = 'mild' | 'moderate' | 'severe';

export interface Symptom {
  id: string;
  userId: string;
  name: string;
  severity: SymptomSeverity;
  description?: string;
  startDate: string;
  endDate?: string;
  triggers?: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Communication Types
// ============================================

export interface Conversation {
  id: string;
  participants: string[];
  type: 'doctor' | 'family' | 'support';
  subject?: string;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  attachments?: string[];
  readAt?: string;
  createdAt: string;
}

export type MessageType = 'text' | 'image' | 'document' | 'system';

export type NotificationType = 'appointment' | 'medication' | 'health_alert' | 'family' | 'system' | 'billing';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export type DocumentType = 'lab_result' | 'prescription' | 'imaging' | 'discharge_summary' | 'insurance' | 'other';

export type DocumentStatus = 'uploading' | 'processing' | 'available' | 'failed';

export interface Document {
  id: string;
  userId: string;
  type: DocumentType;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: DocumentStatus;
  storagePath: string;
  tags?: string[];
  sharedWith?: string[];
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Support Types
// ============================================

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'medical' | 'account' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

export interface SecurityLog {
  id: string;
  userId: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: any;
  createdAt: string;
}

export interface SystemAlert {
  id: string;
  type: 'maintenance' | 'security' | 'feature' | 'emergency';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  active: boolean;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccessRequest {
  id: string;
  requesterId: string;
  targetUserId: string;
  type: 'health_data' | 'appointments' | 'medications' | 'documents';
  reason: string;
  status: AccessRequestStatus;
  expiresAt?: string;
  createdAt: string;
  respondedAt?: string;
}

export type AccessRequestStatus = 'pending' | 'approved' | 'denied' | 'expired';

// ============================================
// Admin Types
// ============================================

export type UserRole = 'user' | 'family_member' | 'doctor' | 'nurse' | 'admin' | 'super_admin';

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
  permissions: string[];
  department?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Auth Types
// ============================================

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
