import { create } from 'zustand';

export type UserRole = 'client' | 'support' | 'manager' | 'admin';

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string; avatar: string; role: UserRole; title: string } | null;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const roleProfiles: Record<UserRole, { name: string; avatar: string; title: string }> = {
  client: { name: 'Elena Vance', avatar: 'https://i.pravatar.cc/150?u=elena', title: 'Premium Member' },
  support: { name: 'Sarah Jenkins', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHv3JFX_yTohVGyJZ5Fqnnsr3bNv1ww4cxZq7k8pZoSJHNt37ezgjwBIyARPElahS2Dv-r4rMYGxSyAGTof5EA4JidZZ3l4SO9ccGen2SSW9R9W8suc5og8gGQfdX49MqDejrBkS2_7bPnQvSbm404HBasXZJPYvIlPI20ggKaqvIE6swSBNopqNhkg_rXrezzdBqjjO-qGCHYLmD3F43de6TCEjDS2Uvq25udvwHUoPyFzPlHA8uqG6TVc2IclLwxu8ZaOMJmURQ', title: 'Senior Member' },
  manager: { name: 'Sarah Jenkins', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp3IEH8pEC7DzgM0EnqhMngTdG_9wC88FzsErEYouj65GALqLBloN2dJ_4h4gkDuZik_YsYqknfFKMihstm7EyVxoBBm9nqeucloaiGdksgneR3AZ2H__3Kd-byV4NiySKdXUxH3W5mx0kiMSdmxf8MG2ygU-gAsCtNA8ymKi1AoHqTsvq1cLrL9mUkWAB8ebQ7sNJNmYur9ni3sHSIY28Si7XUbl6gmzJj_dfy0wnmYARt7-jn-vZ5GVnVp9dFLYTRxQaKCekLeg', title: 'Strategic Manager' },
  admin: { name: 'Alex Rivera', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsMbYgjcq-4aK8KJXj-LhOc6rYWWbJ21IYCTkGvav2XGj71ptMcWBXtKK3yIUGoUAOFDyIiqNoOut7ek7Pl_B5uBcMDTmVWIFL8ZD-YKxiB4RHeHeanRZl90p7OvrWVGH6KsIa_hoVmi7CNodrS9FhsHkYTq45uJFd7rwxKjtYP4H-wGY_elStKjThw0L3Kna_Pe-KyHdBPkRlsygerXOMmbz5fwMbSIYJU0-xS7Nn18q1QshNa2qPAdEnwVT44gdXWWegvtTMJZo', title: 'System Admin' },
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (email, role = 'client') => {
    const profile = roleProfiles[role];
    set({
      isAuthenticated: true,
      user: { email, role, ...profile },
    });
  },
  logout: () => set({ isAuthenticated: false, user: null }),
  switchRole: (role) => set((state) => {
    if (!state.user) return state;
    const profile = roleProfiles[role];
    return { user: { ...state.user, role, ...profile } };
  }),
}));
