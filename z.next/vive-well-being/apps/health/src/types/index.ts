export type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: "DAILY" | "TWICE_DAILY" | "WEEKLY" | "AS_NEEDED" | "CUSTOM";
  startDate: string;
  endDate: string | null;
  timeOfDay: string[];
  notes: string | null;
  isActive: boolean;
  prescribedBy: string | null;
  refillsRemaining: number;
  createdAt: string;
  updatedAt: string;
};

export type Appointment = {
  id: string;
  title: string;
  description: string | null;
  providerName: string | null;
  location: string | null;
  appointmentDate: string;
  startTime: string;
  endTime: string | null;
  status: "SCHEDULED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  reminderMinutesBefore: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DeviceSync = {
  id: string;
  deviceName: string;
  deviceType: string;
  manufacturer: string | null;
  lastSyncedAt: string | null;
  syncStatus: "SYNCED" | "SYNCING" | "ERROR" | "DISCONNECTED";
  firmwareVersion: string | null;
  batteryLevel: number | null;
  isConnected: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type HealthLog = {
  id: string;
  title: string;
  logType: HealthMetricType;
  value: string | null;
  unit: string | null;
  notes: string | null;
  tags: string[];
  mood: number | null;
  symptoms: string[];
  loggedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type HealthMetric = {
  id: string;
  metricType: HealthMetricType;
  value: string;
  unit: string;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type HealthDocument = {
  id: string;
  title: string;
  documentType: "LAB_RESULT" | "PRESCRIPTION" | "IMAGING" | "VISIT_SUMMARY" | "REFERRAL" | "VACCINATION" | "OTHER";
  fileName: string;
  filePath: string;
  fileSizeBytes: number | null;
  mimeType: string | null;
  description: string | null;
  tags: string[];
  issuedDate: string | null;
  providerName: string | null;
  isShared: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type HealthMetricType =
  | "HEART_RATE"
  | "BLOOD_PRESSURE"
  | "BLOOD_SUGAR"
  | "WEIGHT"
  | "HEIGHT"
  | "STEPS"
  | "SLEEP"
  | "CALORIES"
  | "WATER_INTAKE"
  | "EXERCISE"
  | "OTHER";

export type DashboardSummary = {
  metricsRecorded30d: number;
  logsThisWeek: number;
  activeMedications: number;
  upcomingAppointments: number;
  activitiesThisWeek: number;
  caloriesBurnedThisWeek: string;
  connectedDevices: number;
  totalDocuments: number;
  recentMetrics: Record<string, { value: string; unit: string; recordedAt: Date }[]>;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};
