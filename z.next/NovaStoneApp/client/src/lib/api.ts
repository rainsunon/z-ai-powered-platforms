import { useAuthStore } from "@/features/auth/store/authStore";

const API_BASE = "/api";

class ApiClient {
  private refreshTokenPromise: Promise<string | null> | null = null;

  private getToken(): string | null {
    return useAuthStore.getState().token;
  }

  private async refreshJwtToken(): Promise<string | null> {
    if (this.refreshTokenPromise) return this.refreshTokenPromise;

    this.refreshTokenPromise = useAuthStore.getState().refreshJwtToken();
    this.refreshTokenPromise.finally(() => {
      this.refreshTokenPromise = null;
    });

    return this.refreshTokenPromise;
  }

  private buildHeaders(token?: string): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const t = token ?? this.getToken();
    if (t) headers["Authorization"] = `Bearer ${t}`;
    return headers;
  }

  private handleAuthError<T>(
    method: string,
    url: string,
    body?: unknown
  ): Promise<T> {
    return this.refreshJwtToken().then((newToken) => {
      if (!newToken) {
        useAuthStore.getState().logout();
        throw new Error("Session expired");
      }
      return fetch(url, {
        method,
        headers: this.buildHeaders(newToken),
        body: body ? JSON.stringify(body) : undefined,
      }).then((retryRes) => {
        if (retryRes.status === 401) {
          useAuthStore.getState().logout();
          throw new Error("Session expired");
        }
        if (!retryRes.ok) {
          return retryRes
            .json()
            .catch(() => ({ error: retryRes.statusText }))
            .then((err) => {
              throw new Error(err.error || `Request failed: ${retryRes.status}`);
            });
        }
        return retryRes.json() as Promise<T>;
      });
    });
  }

  private async request<T>(
    method: string,
    url: string,
    body?: unknown
  ): Promise<T> {
    const res = await fetch(url, {
      method,
      headers: this.buildHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
      if (this.getToken()) {
        return this.handleAuthError<T>(method, url, body);
      }
      useAuthStore.getState().logout();
      throw new Error("Session expired");
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `Request failed: ${res.status}`);
    }

    return res.json();
  }

  async get<T>(
    path: string,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    const url = new URL(`${API_BASE}${path}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) url.searchParams.set(k, String(v));
      });
    }
    return this.request<T>("GET", url.toString());
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", `${API_BASE}${path}`, body);
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("PATCH", `${API_BASE}${path}`, body);
  }

  async del<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", `${API_BASE}${path}`);
  }
}

export const api = new ApiClient();
