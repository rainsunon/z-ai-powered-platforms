import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authClient } from "@/lib/auth";

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User, token: string) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  refreshJwtToken: () => Promise<string | null>;
}

export async function fetchJwtToken(): Promise<string> {
  const res = await fetch("/api/auth/token", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch JWT token (HTTP ${res.status})`);
  }
  const data = await res.json();
  if (!data.token) {
    throw new Error("No token in response from /api/auth/token");
  }
  return data.token;
}

function isTokenExpiredOrStale(token: string | null): boolean {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" && payload.exp - Date.now() / 1000 < 60;
  } catch {
    return true;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user, token) =>
        set({ user, token, isAuthenticated: true, isLoading: false }),

      refreshJwtToken: async () => {
        try {
          const token = await fetchJwtToken();
          set({ token });
          return token;
        } catch {
          return null;
        }
      },

      login: async (email, password) => {
        try {
          const result = await authClient.signIn.email({ email, password });

          if (result.error) {
            return { success: false, error: result.error.message || "Login failed" };
          }

          const user: User = {
            id: result.data?.user?.id || "",
            email: result.data?.user?.email || email,
            name: result.data?.user?.name || "",
            image: result.data?.user?.image || undefined,
          };

          let token: string | null = null;
          try {
            token = await fetchJwtToken();
          } catch (e: any) {
            return { success: false, error: `Session created but token fetch failed: ${e.message}` };
          }

          set({ user, token, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.message || "Login failed" };
        }
      },

      register: async (name, email, password) => {
        try {
          const result = await authClient.signUp.email({ name, email, password });

          if (result.error) {
            return { success: false, error: result.error.message || "Registration failed" };
          }

          const user: User = {
            id: result.data?.user?.id || "",
            email: result.data?.user?.email || email,
            name: result.data?.user?.name || name,
          };

          let token: string | null = null;
          try {
            token = await fetchJwtToken();
          } catch (e: any) {
            return { success: false, error: `Account created but token fetch failed: ${e.message}` };
          }

          set({ user, token, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.message || "Registration failed" };
        }
      },

      logout: async () => {
        try {
          await authClient.signOut();
        } catch {}
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const session = await authClient.getSession();
          if (session.data?.user) {
            const user: User = {
              id: session.data.user.id,
              email: session.data.user.email,
              name: session.data.user.name || "",
              image: session.data.user.image || undefined,
            };

            let token = get().token;
            if (isTokenExpiredOrStale(token)) {
              try {
                token = await fetchJwtToken();
              } catch {
                token = null;
              }
            }

            set({ user, token, isAuthenticated: true, isLoading: false });
          } else {
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
          }
        } catch {
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: "novastone-auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
