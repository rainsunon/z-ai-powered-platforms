import { create } from "zustand";
import type {
  DashboardSummary,
  Medication,
  Appointment,
  DeviceSync,
  HealthLog,
  HealthMetric,
  HealthMetricType,
} from "../types";
import * as api from "../api";

interface DashboardState {
  summary: DashboardSummary | null;
  trendData: Record<string, { value: string; unit: string; recordedAt: string }[]>;
  isLoading: boolean;
  error: string | null;
  fetchSummary: () => Promise<void>;
  fetchTrend: (metricType: string, days?: number) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  summary: null,
  trendData: {},
  isLoading: false,
  error: null,
  fetchSummary: async () => {
    set({ isLoading: true, error: null });
    try {
      const summary = await api.dashboardApi.getSummary();
      set({ summary, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },
  fetchTrend: async (metricType: string, days = 30) => {
    try {
      const data = await api.healthMetricApi.getTrend(metricType, days);
      set((s) => ({ trendData: { ...s.trendData, [metricType]: data } }));
    } catch {}
  },
}));

interface MedicationState {
  medications: Medication[];
  total: number;
  page: number;
  isLoading: boolean;
  selectedMedication: Medication | null;
  fetchMedications: (params?: Record<string, unknown>) => Promise<void>;
  createMedication: (data: Partial<Medication>) => Promise<void>;
  updateMedication: (id: string, data: Partial<Medication>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  setSelectedMedication: (med: Medication | null) => void;
}

export const useMedicationStore = create<MedicationState>()((set, get) => ({
  medications: [],
  total: 0,
  page: 1,
  isLoading: false,
  selectedMedication: null,
  fetchMedications: async (params) => {
    set({ isLoading: true });
    try {
      const result = await api.medicationApi.list(params);
      set({ medications: result.items, total: result.total, page: result.page, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
  createMedication: async (data) => {
    await api.medicationApi.create(data);
    get().fetchMedications({ page: get().page });
  },
  updateMedication: async (id, data) => {
    await api.medicationApi.update(id, data);
    get().fetchMedications({ page: get().page });
  },
  deleteMedication: async (id) => {
    await api.medicationApi.delete(id);
    get().fetchMedications({ page: get().page });
  },
  setSelectedMedication: (med) => set({ selectedMedication: med }),
}));

interface AppointmentState {
  appointments: Appointment[];
  total: number;
  page: number;
  isLoading: boolean;
  selectedAppointment: Appointment | null;
  fetchAppointments: (params?: Record<string, unknown>) => Promise<void>;
  createAppointment: (data: Partial<Appointment>) => Promise<void>;
  batchCreateAppointments: (dates: string[], appointment: Partial<Appointment>) => Promise<void>;
  updateAppointment: (id: string, data: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  setSelectedAppointment: (apt: Appointment | null) => void;
}

export const useAppointmentStore = create<AppointmentState>()((set, get) => ({
  appointments: [],
  total: 0,
  page: 1,
  isLoading: false,
  selectedAppointment: null,
  fetchAppointments: async (params) => {
    set({ isLoading: true });
    try {
      const result = await api.appointmentApi.list(params);
      set({ appointments: result.items, total: result.total, page: result.page, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
  createAppointment: async (data) => {
    await api.appointmentApi.create(data);
    get().fetchAppointments({ page: get().page });
  },
  batchCreateAppointments: async (dates, appointment) => {
    await api.appointmentApi.batchCreate(dates, appointment);
    get().fetchAppointments({ page: get().page });
  },
  updateAppointment: async (id, data) => {
    await api.appointmentApi.update(id, data);
    get().fetchAppointments({ page: get().page });
  },
  deleteAppointment: async (id) => {
    await api.appointmentApi.delete(id);
    get().fetchAppointments({ page: get().page });
  },
  setSelectedAppointment: (apt) => set({ selectedAppointment: apt }),
}));

interface HealthLogState {
  logs: HealthLog[];
  total: number;
  page: number;
  isLoading: boolean;
  selectedLog: HealthLog | null;
  fetchLogs: (params?: Record<string, unknown>) => Promise<void>;
  createLog: (data: Partial<HealthLog>) => Promise<void>;
  updateLog: (id: string, data: Partial<HealthLog>) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  setSelectedLog: (log: HealthLog | null) => void;
}

export const useHealthLogStore = create<HealthLogState>()((set, get) => ({
  logs: [],
  total: 0,
  page: 1,
  isLoading: false,
  selectedLog: null,
  fetchLogs: async (params) => {
    set({ isLoading: true });
    try {
      const result = await api.healthLogApi.list(params);
      set({ logs: result.items, total: result.total, page: result.page, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
  createLog: async (data) => {
    await api.healthLogApi.create(data);
    get().fetchLogs({ page: get().page });
  },
  updateLog: async (id, data) => {
    await api.healthLogApi.update(id, data);
    get().fetchLogs({ page: get().page });
  },
  deleteLog: async (id) => {
    await api.healthLogApi.delete(id);
    get().fetchLogs({ page: get().page });
  },
  setSelectedLog: (log) => set({ selectedLog: log }),
}));

interface DeviceSyncState {
  devices: DeviceSync[];
  isLoading: boolean;
  fetchDevices: () => Promise<void>;
  addDevice: (data: Partial<DeviceSync>) => Promise<void>;
  syncDevice: (id: string) => Promise<void>;
  removeDevice: (id: string) => Promise<void>;
}

export const useDeviceStore = create<DeviceSyncState>()((set, get) => ({
  devices: [],
  isLoading: false,
  fetchDevices: async () => {
    set({ isLoading: true });
    try {
      const devices = await api.deviceApi.list();
      set({ devices, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
  addDevice: async (data) => {
    await api.deviceApi.create(data);
    get().fetchDevices();
  },
  syncDevice: async (id) => {
    await api.deviceApi.sync(id);
    get().fetchDevices();
  },
  removeDevice: async (id) => {
    await api.deviceApi.delete(id);
    get().fetchDevices();
  },
}));
