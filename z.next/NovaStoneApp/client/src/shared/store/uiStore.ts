import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ModalState {
  isOpen: boolean;
  type: string | null;
  data: any;
}

interface UIState {
  modal: ModalState;
  sidebarOpen: boolean;
  theme: "light" | "dark";
  lang: string;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark") => void;
  setLang: (lang: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      modal: { isOpen: false, type: null, data: null },
      sidebarOpen: true,
      theme: "light",
      lang: "en",
      openModal: (type, data = null) => 
        set({ modal: { isOpen: true, type, data } }),
      closeModal: () => 
        set({ modal: { isOpen: false, type: null, data: null } }),
      toggleSidebar: () => 
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      setLang: (lang) => set({ lang })
    }),
    {
      name: "novastone-ui-storage",
    }
  )
);
