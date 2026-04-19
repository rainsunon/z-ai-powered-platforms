import { createAuthClient } from 'better-auth/react';

// Create better-auth client
export const authClient = createAuthClient({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000',
});

// Export auth hooks
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  useUser,
} = authClient;

// Types
export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: AuthUser;
  expiresAt: Date;
  token: string;
}

// Helper functions
export const isAuthenticated = () => {
  const session = authClient.useSession();
  return !!session.data;
};

export const getCurrentUser = () => {
  const session = authClient.useSession();
  return session.data?.user || null;
};
