import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type Theme = 'light' | 'dark' | 'system';
type ModalType = 'login' | 'signup' | 'numberGeneration' | 'saveCombination' | null;

interface UIState {
  theme: Theme;
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  modalType: ModalType;
  modalData: any;
  toasts: Toast[];
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface UIActions {
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      immer((set) => ({
        // State
        theme: 'system',
        isSidebarOpen: false,
        isModalOpen: false,
        modalType: null,
        modalData: null,
        toasts: [],

        // Actions
        setTheme: (theme) =>
          set((state) => {
            state.theme = theme;
          }),

        toggleSidebar: () =>
          set((state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
          }),

        setSidebarOpen: (open) =>
          set((state) => {
            state.isSidebarOpen = open;
          }),

        openModal: (type, data) =>
          set((state) => {
            state.isModalOpen = true;
            state.modalType = type;
            state.modalData = data;
          }),

        closeModal: () =>
          set((state) => {
            state.isModalOpen = false;
            state.modalType = null;
            state.modalData = null;
          }),

        showToast: (toast) =>
          set((state) => {
            const id = `${Date.now()}-${Math.random()}`;
            state.toasts.push({
              ...toast,
              id,
              duration: toast.duration || 3000,
            });

            // 자동 제거
            setTimeout(() => {
              set((state) => {
                state.toasts = state.toasts.filter((t) => t.id !== id);
              });
            }, toast.duration || 3000);
          }),

        removeToast: (id) =>
          set((state) => {
            state.toasts = state.toasts.filter((toast) => toast.id !== id);
          }),

        clearToasts: () =>
          set((state) => {
            state.toasts = [];
          }),
      })),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          theme: state.theme,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
);