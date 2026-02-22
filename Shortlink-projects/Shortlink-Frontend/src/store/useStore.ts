import { create } from 'zustand'
import type { User, Group, ShortLink } from '@/src/api/types'

// Domain State (matching Vue store: state.domain)
interface DomainState {
  domain: string
  setDomain: (domain: string) => void
}

// UI State
interface UIState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

// User State
interface UserState {
  user: User | null
  setUser: (user: User | null) => void
}

// Group State
interface GroupState {
  groups: Group[]
  selectedGroupId: string | null
  setGroups: (groups: Group[]) => void
  setSelectedGroupId: (groupId: string | null) => void
  addGroup: (group: Group) => void
  updateGroup: (group: Group) => void
  removeGroup: (groupId: string) => void
}

// Modal State
interface ModalState {
  modals: Record<string, boolean>
  openModal: (modalName: string) => void
  closeModal: (modalName: string) => void
  isModalOpen: (modalName: string) => boolean
}

// Combine all states
interface AppState extends DomainState, UIState, UserState, GroupState, ModalState {}

// Create Zustand store (matching Vue store/index.js)
export const useStore = create<AppState>((set, get) => ({
  // Domain State (matching Vue: state.domain = 'shortlink.tus')
  // Default domain - can be updated via setDomain or should match backend configuration
  // Format: 'short.tus.org' or 'http://short.tus.org' (code will add http:// if missing)
  // Updated to match Postman request format: 'http://short.tus.org'
  domain: 'short.tus.org',
  setDomain: (domain) => set({ domain }),

  // UI State
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // User State
  user: null,
  setUser: (user) => set({ user }),

  // Group State
  groups: [],
  selectedGroupId: null,
  setGroups: (groups) => set({ groups }),
  setSelectedGroupId: (groupId) => set({ selectedGroupId: groupId }),
  addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
  updateGroup: (group) =>
    set((state) => ({
      groups: state.groups.map((g) => (g.id === group.id ? group : g)),
    })),
  removeGroup: (groupId) =>
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== groupId),
      selectedGroupId: state.selectedGroupId === groupId ? null : state.selectedGroupId,
    })),

  // Modal State
  modals: {},
  openModal: (modalName) =>
    set((state) => ({
      modals: { ...state.modals, [modalName]: true },
    })),
  closeModal: (modalName) =>
    set((state) => ({
      modals: { ...state.modals, [modalName]: false },
    })),
  isModalOpen: (modalName) => {
    const state = get()
    return state.modals[modalName] || false
  },
}))

// Selector hooks for better performance
export const useDomain = () => useStore((state) => ({
  domain: state.domain,
  setDomain: state.setDomain,
}))

export const useUI = () => useStore((state) => ({
  sidebarOpen: state.sidebarOpen,
  setSidebarOpen: state.setSidebarOpen,
  toggleSidebar: state.toggleSidebar,
}))

export const useUser = () => useStore((state) => ({
  user: state.user,
  setUser: state.setUser,
}))

export const useGroups = () => useStore((state) => ({
  groups: state.groups,
  selectedGroupId: state.selectedGroupId,
  setGroups: state.setGroups,
  setSelectedGroupId: state.setSelectedGroupId,
  addGroup: state.addGroup,
  updateGroup: state.updateGroup,
  removeGroup: state.removeGroup,
}))

export const useModals = () => useStore((state) => ({
  openModal: state.openModal,
  closeModal: state.closeModal,
  isModalOpen: state.isModalOpen,
}))
