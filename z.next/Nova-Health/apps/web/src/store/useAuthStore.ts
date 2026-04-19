import { create } from 'zustand';
import {
  login as loginApi,
  loginWithTwoFactor,
  requestTwoFactorCode,
  logout as logoutApi,
  register as registerApi,
  sendOTP,
  verifyOTP,
} from '@/services/auth.service';
import { setAccessToken, setRefreshToken, clearAuthData, getUserData, setUserData, isAuthenticated as checkAuth } from '@/lib/auth-utils';
import { getCurrentUser } from '@/services/user.service';

export type UserRole = 'client' | 'support' | 'manager' | 'admin';

export type TwoFactorMethod = 'email' | 'sms';

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string; avatar: string; role: UserRole; title: string; id?: number } | null;
  isLoading: boolean;
  requiresTwoFactor: boolean;
  twoFactorMethod: TwoFactorMethod | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithTwoFactor: (code: string) => Promise<void>;
  requestTwoFactorCode: (method: TwoFactorMethod) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  pendingEmail: string | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  requiresTwoFactor: false,
  twoFactorMethod: null,
  pendingEmail: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, pendingEmail: email });
    try {
      const response = await loginApi({ email, password });
      
      // Check if 2FA is required
      if (response.data.requiresTwoFactor) {
        set({
          requiresTwoFactor: true,
          isLoading: false,
        });
        return;
      }
      
      const { user, accessToken, refreshToken } = response.data;
      
      // Store tokens
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      
      // Fetch user profile data
      try {
        const profileResponse = await getCurrentUser();
        const profileData = profileResponse.data;
        
        const userData = {
          id: user.id,
          email: user.email,
          role: user.role as UserRole,
          name: `${profileData.profileData.firstName} ${profileData.profileData.lastName}`,
          avatar: `https://i.pravatar.cc/150?u=${user.email}`,
          title: user.role === 'admin' ? 'System Admin' : user.role === 'manager' ? 'Manager' : 'Member',
        };
        
        setUserData(userData);
        set({
          isAuthenticated: true,
          user: userData,
          isLoading: false,
          requiresTwoFactor: false,
        });
      } catch (profileError) {
        // If profile fetch fails, use basic user data
        const userData = {
          id: user.id,
          email: user.email,
          role: user.role as UserRole,
          name: user.email.split('@')[0],
          avatar: `https://i.pravatar.cc/150?u=${user.email}`,
          title: 'Member',
        };
        
        setUserData(userData);
        set({
          isAuthenticated: true,
          user: userData,
          isLoading: false,
          requiresTwoFactor: false,
        });
      }
    } catch (error) {
      set({ isLoading: false, pendingEmail: null });
      throw error;
    }
  },
  
  loginWithTwoFactor: async (code: string) => {
    const { pendingEmail } = get();
    if (!pendingEmail) {
      throw new Error('No pending login. Please start login process again.');
    }
    
    set({ isLoading: true });
    try {
      const response = await loginWithTwoFactor({
        email: pendingEmail,
        password: '', // Already verified in step 1
        code,
        method: get().twoFactorMethod || 'email',
      });
      
      const { user, accessToken, refreshToken } = response.data;
      
      // Store tokens
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      
      // Fetch user profile data
      try {
        const profileResponse = await getCurrentUser();
        const profileData = profileResponse.data;
        
        const userData = {
          id: user.id,
          email: user.email,
          role: user.role as UserRole,
          name: `${profileData.profileData.firstName} ${profileData.profileData.lastName}`,
          avatar: `https://i.pravatar.cc/150?u=${user.email}`,
          title: user.role === 'admin' ? 'System Admin' : user.role === 'manager' ? 'Manager' : 'Member',
        };
        
        setUserData(userData);
        set({
          isAuthenticated: true,
          user: userData,
          isLoading: false,
          requiresTwoFactor: false,
          pendingEmail: null,
        });
      } catch (profileError) {
        const userData = {
          id: user.id,
          email: user.email,
          role: user.role as UserRole,
          name: user.email.split('@')[0],
          avatar: `https://i.pravatar.cc/150?u=${user.email}`,
          title: 'Member',
        };
        
        setUserData(userData);
        set({
          isAuthenticated: true,
          user: userData,
          isLoading: false,
          requiresTwoFactor: false,
          pendingEmail: null,
        });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  requestTwoFactorCode: async (method: TwoFactorMethod) => {
    const { pendingEmail } = get();
    if (!pendingEmail) {
      throw new Error('No pending login. Please start login process again.');
    }
    
    set({ isLoading: true });
    try {
      await requestTwoFactorCode({ email: pendingEmail, method });
      set({ 
        twoFactorMethod: method,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  register: async (data: any) => {
    set({ isLoading: true, pendingEmail: data.email });
    try {
      const response = await registerApi(data);
      
      // Check if OTP verification is required
      if (response.data.requiresOTP) {
        set({
          requiresTwoFactor: true,
          twoFactorMethod: 'email',
          isLoading: false,
        });
        return;
      }
      
      const { user, accessToken, refreshToken } = response.data;
      
      // Store tokens
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      
      const userData = {
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
        name: `${data.firstName} ${data.lastName}`,
        avatar: `https://i.pravatar.cc/150?u=${user.email}`,
        title: 'Member',
      };
      
      setUserData(userData);
      set({
        isAuthenticated: true,
        user: userData,
        isLoading: false,
        requiresTwoFactor: false,
        pendingEmail: null,
      });
    } catch (error) {
      set({ isLoading: false, pendingEmail: null });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('nova_refresh_token');
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      set({ 
        isAuthenticated: false, 
        user: null,
        requiresTwoFactor: false,
        twoFactorMethod: null,
        pendingEmail: null,
      });
    }
  },
  
  initializeAuth: async () => {
    if (!checkAuth()) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    
    const userData = getUserData();
    if (userData) {
      set({
        isAuthenticated: true,
        user: userData,
      });
    }
  },
  
  switchRole: (role) => set((state) => {
    if (!state.user) return state;
    const title = role === 'admin' ? 'System Admin' : role === 'manager' ? 'Manager' : 'Member';
    return { user: { ...state.user, role, title } };
  }),
}));
