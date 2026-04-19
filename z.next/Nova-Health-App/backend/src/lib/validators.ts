import { z } from 'zod';

// ============================================
// Common Schemas
// ============================================

export const uuidSchema = z.string().uuid();

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const sortSchema = z.object({
  field: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================
// User Schemas
// ============================================

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  gender: z.enum(['male', 'female', 'other']),
  phone: z.string().regex(/^\+?[\d\s-()]{7,15}$/, 'Invalid phone number'),
  timezone: z.string().default('UTC'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  phone: z.string().regex(/^\+?[\d\s-()]{7,15}$/).optional(),
  timezone: z.string().optional(),
  profileData: z.object({
    bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().default('US'),
    }).optional(),
    memberSince: z.string().optional(),
  }).optional(),
  securitySettings: z.object({
    twoFactorEnabled: z.boolean().optional(),
    lastPasswordChange: z.string().optional(),
    activeSessions: z.number().optional(),
    dataPrivacy: z.object({
      shareWithProviders: z.boolean().optional(),
      anonymousAnalytics: z.boolean().optional(),
    }).optional(),
  }).optional(),
  preferences: z.object({
    language: z.string().default('en'),
    theme: z.enum(['light', 'dark', 'system']).default('light'),
    notifications: z.object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      sms: z.boolean().optional(),
    }).optional(),
    accessibility: z.object({
      highContrast: z.boolean().optional(),
      fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
    }).optional(),
  }).optional(),
});

export const emergencyContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  relationship: z.string().min(2, 'Relationship is required'),
  phone: z.string().regex(/^\+?[\d\s-()]{7,15}$/, 'Invalid phone number'),
  isPrimary: z.boolean().default(false),
});

// ============================================
// Appointment Schemas
// ============================================

export const appointmentSchema = z.object({
  title: z.string().min(5, 'Title is required'),
  providerId: uuidSchema.optional(),
  appointmentDate: z.string().datetime('Invalid date format'),
  durationMinutes: z.number().min(15).max(120).default(30),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'no_show']).default('scheduled'),
  appointmentData: z.object({
    type: z.enum(['in_person', 'telehealth', 'phone']),
    location: z.object({
      facility: z.string().optional(),
      room: z.string().optional(),
      address: z.string().optional(),
    }).optional(),
    specialty: z.string().optional(),
    notes: z.string().optional(),
    reminders: z.array(z.string()).optional(),
    videoLink: z.string().url().optional(),
  }).optional(),
});

// ============================================
// Medication Schemas
// ============================================

export const medicationSchema = z.object({
  name: z.string().min(2, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  medicationType: z.enum(['Tablet', 'Capsule', 'Liquid', 'Injection', 'Topical']),
  rxNumber: z.string().optional(),
  quantity: z.number().positive().optional(),
  refillsRemaining: z.number().min(0).default(0),
  prescribedBy: z.string().optional(),
  prescribedDate: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
  medicationData: z.object({
    interactions: z.array(z.object({
      medicationName: z.string(),
      severity: z.enum(['high', 'moderate', 'safe']),
      description: z.string(),
    })).optional(),
    sideEffects: z.object({
      common: z.array(z.string()).optional(),
      serious: z.array(z.string()).optional(),
    }).optional(),
    history: z.array(z.object({
      date: z.string().date(),
      change: z.string(),
      provider: z.string(),
      dosage: z.string(),
    })).optional(),
    nextRefill: z.string().date().optional(),
    adherenceRate: z.number().min(0).max(100).optional(),
  }).optional(),
});

// ============================================
// Family Schemas
// ============================================

export const familyMemberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  age: z.number().min(0).max(120),
  familyRole: z.string().min(2, 'Family role is required'),
  permissionLevel: z.enum(['full_access', 'limited_access', 'view_only']),
  healthSnapshot: z.object({
    bloodType: z.string().optional(),
    heartRate: z.number().optional(),
    sleep: z.number().optional(),
    steps: z.number().optional(),
    bloodPressure: z.string().optional(),
    wellness: z.number().min(0).max(100).optional(),
    lastSync: z.string().datetime().optional(),
    status: z.enum(['Excellent', 'Great', 'Good', 'Fair', 'Poor']).optional(),
    lastCheckup: z.string().date().optional(),
    vaccination: z.string().optional(),
  }).optional(),
  displaySettings: z.object({
    avatar: z.string().optional(),
    color: z.string().optional(),
    gradient: z.string().optional(),
  }).optional(),
});

export const familyInvitationSchema = z.object({
  inviteeName: z.string().min(2, 'Name is required'),
  inviteeEmail: z.string().email('Invalid email address'),
});

// ============================================
// Billing Schemas
// ============================================

export const paymentMethodSchema = z.object({
  methodType: z.enum(['credit_card', 'bank_account']),
  cardholderName: z.string().min(2).optional(),
  accountHolderName: z.string().min(2).optional(),
  lastFourDigits: z.string().regex(/^\d{4}$/).optional(),
  cardNetwork: z.enum(['Visa', 'Mastercard', 'Amex', 'Discover']).optional(),
  bankName: z.string().optional(),
  accountType: z.enum(['checking', 'savings']).optional(),
  routingLastFour: z.string().regex(/^\d{4}$/).optional(),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/).optional(),
  billingAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
  methodData: z.object({
    tokenRef: z.string().min(10),
  }).optional(),
});

export const subscriptionSchema = z.object({
  planId: z.string(),
  billingCycle: z.enum(['monthly', 'yearly']),
  autoRenew: z.boolean().default(true),
});

// ============================================
// Health Data Schemas
// ============================================

export const vitalReadingSchema = z.object({
  readingDate: z.string().date(),
  heartRate: z.number().min(30).max(220).optional(),
  systolic: z.number().min(70).max(200).optional(),
  diastolic: z.number().min(40).max(130).optional(),
  spo2: z.number().min(70).max(100).optional(),
  temperature: z.number().min(95).max(107).optional(),
  extendedData: z.object({
    bloodOxygen: z.object({
      value: z.number().min(70).max(100),
      trend: z.enum(['stable', 'improving', 'declining']),
      history: z.array(z.number()).optional(),
    }).optional(),
    hrv: z.object({
      value: z.number(),
      trend: z.string().optional(),
    }).optional(),
    respiratoryRate: z.number().optional(),
    source: z.enum(['apple_health', 'fitbit', 'google_fit', 'manual']),
  }).optional(),
});

export const symptomSchema = z.object({
  name: z.string().min(2, 'Symptom name is required'),
  severity: z.enum(['mild', 'moderate', 'severe']),
  isResolved: z.boolean().default(false),
  onsetDate: z.string().date(),
  resolvedDate: z.string().date().optional(),
  symptomData: z.object({
    description: z.string().optional(),
    triggers: z.array(z.string()).optional(),
    relatedConditions: z.array(z.string()).optional(),
    aiInsight: z.string().optional(),
    bodyArea: z.string().optional(),
  }).optional(),
});

// ============================================
// Communication Schemas
// ============================================

export const messageSchema = z.object({
  conversationId: uuidSchema,
  content: z.string().min(1, 'Message is required'),
  messageType: z.enum(['text', 'file', 'image']).default('text'),
  messageData: z.object({
    attachments: z.array(z.object({
      type: z.enum(['file', 'image']),
      name: z.string(),
      size: z.string(),
      url: z.string().url(),
      mimeType: z.string(),
    })).optional(),
  }).optional(),
});

export const notificationSchema = z.object({
  notificationType: z.enum(['critical', 'warning', 'info']),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  icon: z.string().optional(),
  notificationData: z.object({
    actions: z.array(z.object({
      label: z.string(),
      variant: z.enum(['primary', 'secondary']),
      href: z.string().url().optional(),
    })).optional(),
    relatedEntity: z.object({
      type: z.string(),
      id: z.string(),
    }).optional(),
    expiresAt: z.string().datetime().optional(),
  }).optional(),
});

export const documentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  docType: z.enum(['labs', 'prescriptions', 'imaging', 'reports']),
  status: z.enum(['reviewed', 'archived', 'pending']).default('pending'),
  addedBy: z.string().optional(),
  fileUrl: z.string().url().optional(),
  fileSize: z.string().optional(),
  fileFormat: z.enum(['pdf', 'DICOM', 'png', 'jpg', 'jpeg']).optional(),
  expirationDate: z.string().date().optional(),
  documentData: z.object({
    category: z.enum(['Lab Results', 'Prescriptions', 'Imaging (X-Ray/MRI)', 'Reports']),
    description: z.string().optional(),
    sharedWith: z.array(uuidSchema).optional(),
    isFavorite: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
    ocrExtracted: z.object({
      keyFindings: z.string().optional(),
    }).optional(),
  }).optional(),
});

// ============================================
// Support Schemas
// ============================================

export const supportTicketSchema = z.object({
  subject: z.string().min(5, 'Subject is required'),
  priority: z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
  ticketData: z.object({
    category: z.string().optional(),
    description: z.string().optional(),
    sla: z.string().optional(),
    responseTime: z.string().optional(),
    chatMessages: z.array(z.object({
      sender: z.enum(['patient', 'agent']),
      message: z.string(),
      timestamp: z.string().datetime(),
    })).optional(),
  }).optional(),
});

// ============================================
// Admin Schemas
// ============================================

export const accessRequestSchema = z.object({
  requestedRole: z.enum(['support', 'manager', 'admin']),
  department: z.string().optional(),
  requestJustification: z.string().min(10, 'Justification is required'),
});
