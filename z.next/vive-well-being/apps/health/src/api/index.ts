import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_HEALTH_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

import type {
  Medication,
  Appointment,
  DeviceSync,
  HealthLog,
  HealthMetric,
  HealthDocument,
  DashboardSummary,
  PaginatedResponse,
} from "../types";

export const dashboardApi = {
  getSummary: () => api.get<DashboardSummary>("/dashboard/summary").then((r) => r.data),
};

export const medicationApi = {
  list: (params?: Record<string, unknown>) => api.get<PaginatedResponse<Medication>>("/medications", { params }).then((r) => r.data),
  getById: (id: string) => api.get<Medication>(`/medications/${id}`).then((r) => r.data),
  create: (data: Partial<Medication>) => api.post<Medication>("/medications", data).then((r) => r.data),
  update: (id: string, data: Partial<Medication>) => api.patch<Medication>(`/medications/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/medications/${id}`).then((r) => r.data),
};

export const appointmentApi = {
  list: (params?: Record<string, unknown>) => api.get<PaginatedResponse<Appointment>>("/appointments", { params }).then((r) => r.data),
  getById: (id: string) => api.get<Appointment>(`/appointments/${id}`).then((r) => r.data),
  create: (data: Partial<Appointment>) => api.post<Appointment>("/appointments", data).then((r) => r.data),
  batchCreate: (dates: string[], appointment: Partial<Appointment>) => api.post<Appointment[]>("/appointments/batch", { dates, appointment }).then((r) => r.data),
  update: (id: string, data: Partial<Appointment>) => api.patch<Appointment>(`/appointments/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/appointments/${id}`).then((r) => r.data),
};

export const deviceApi = {
  list: () => api.get<DeviceSync[]>("/devices").then((r) => r.data),
  getById: (id: string) => api.get<DeviceSync>(`/devices/${id}`).then((r) => r.data),
  create: (data: Partial<DeviceSync>) => api.post<DeviceSync>("/devices", data).then((r) => r.data),
  update: (id: string, data: Partial<DeviceSync>) => api.patch<DeviceSync>(`/devices/${id}`, data).then((r) => r.data),
  sync: (id: string) => api.post<DeviceSync>(`/devices/${id}/sync`).then((r) => r.data),
  delete: (id: string) => api.delete(`/devices/${id}`).then((r) => r.data),
};

export const healthLogApi = {
  list: (params?: Record<string, unknown>) => api.get<PaginatedResponse<HealthLog>>("/health-logs", { params }).then((r) => r.data),
  getById: (id: string) => api.get<HealthLog>(`/health-logs/${id}`).then((r) => r.data),
  create: (data: Partial<HealthLog>) => api.post<HealthLog>("/health-logs", data).then((r) => r.data),
  update: (id: string, data: Partial<HealthLog>) => api.patch<HealthLog>(`/health-logs/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/health-logs/${id}`).then((r) => r.data),
};

export const healthMetricApi = {
  list: (params?: Record<string, unknown>) => api.get<PaginatedResponse<HealthMetric>>("/health-metrics", { params }).then((r) => r.data),
  create: (data: Partial<HealthMetric>) => api.post<HealthMetric>("/health-metrics", data).then((r) => r.data),
  delete: (id: string) => api.delete(`/health-metrics/${id}`).then((r) => r.data),
  getTrend: (metricType: string, days = 30) => api.get<{ value: string; unit: string; recordedAt: string }[]>(`/health-metrics/trend/${metricType}`, { params: { days } }).then((r) => r.data),
};

export const documentApi = {
  list: (params?: Record<string, unknown>) => api.get<PaginatedResponse<HealthDocument>>("/documents", { params }).then((r) => r.data),
  getById: (id: string) => api.get<HealthDocument>(`/documents/${id}`).then((r) => r.data),
  create: (data: Partial<HealthDocument>) => api.post<HealthDocument>("/documents", data).then((r) => r.data),
  update: (id: string, data: Partial<HealthDocument>) => api.patch<HealthDocument>(`/documents/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/documents/${id}`).then((r) => r.data),
  exportAll: () => api.get("/documents/export", { responseType: "blob" }).then((r) => r.data),
  exportReport: () => api.get("/documents/export-report", { responseType: "blob" }).then((r) => r.data),
};
