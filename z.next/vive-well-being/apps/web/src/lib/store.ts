import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'free' | 'pro' | 'premium';

interface AuthState {
  user: any | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (user: any, role?: UserRole) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: 'free',
      isAuthenticated: false,
      login: (user, role = 'free') => set({ user, role, isAuthenticated: true }),
      logout: () => set({ user: null, role: 'free', isAuthenticated: false }),
      setRole: (role) => set({ role }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'app-storage',
    }
  )
);
