import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/apiClient';
import { getDeviceId, getErrorMessage } from '@/lib/utils';
import {
  AuthState,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  SessionResponse,
} from '@/types';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  sub: string;
  email: string;
  roles: string[];
  exp: number;
}

const initialState: AuthState = {
  user: null,
  accessToken: apiClient.getAccessToken(),
  refreshToken: apiClient.getRefreshToken(),
  isAuthenticated: !!apiClient.getAccessToken(),
  loading: false,
  error: null,
};

// Parse user from JWT token
function parseUserFromToken(token: string) {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return {
      id: decoded.sub,
      email: decoded.email,
      roles: decoded.roles || [],
    };
  } catch {
    return null;
  }
}

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterRequest, { rejectWithValue }) => {
    try {
      await apiClient.post('/api/auth/register', credentials);
      return credentials.email;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: Omit<LoginRequest, 'deviceId'>, { rejectWithValue }) => {
    try {
      const deviceId = getDeviceId();
      const response = await apiClient.post<TokenResponse>('/api/auth/login', {
        ...credentials,
        deviceId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = apiClient.getRefreshToken();
    await apiClient.post('/api/auth/logout', { refreshToken });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  } finally {
    apiClient.clearTokens();
  }
});

export const fetchSessions = createAsyncThunk(
  'auth/fetchSessions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<SessionResponse[]>('/api/auth/sessions');
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const revokeSession = createAsyncThunk(
  'auth/revokeSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      await apiClient.post(`/api/auth/sessions/${sessionId}/revoke`);
      return sessionId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    restoreSession: (state) => {
      const token = apiClient.getAccessToken();
      if (token) {
        state.user = parseUserFromToken(token);
        state.accessToken = token;
        state.refreshToken = apiClient.getRefreshToken();
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<TokenResponse>) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = parseUserFromToken(action.payload.accessToken);
        state.isAuthenticated = true;
        apiClient.setTokens(action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError, restoreSession } = authSlice.actions;
export default authSlice.reducer;
