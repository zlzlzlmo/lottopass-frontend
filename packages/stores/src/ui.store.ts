import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type Language = 'ko' | 'en';

interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface Modal {
  id: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

interface UIState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // Language
  language: Language;
  setLanguage: (language: Language) => void;
  
  // Loading
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  
  // Toast notifications
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
  
  // Modal management
  modals: Modal[];
  openModal: (modal: Omit<Modal, 'id'>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Mobile menu
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      // Initial state
      theme: 'system',
      language: 'ko',
      isGlobalLoading: false,
      toasts: [],
      modals: [],
      isSidebarOpen: true,
      isMobileMenuOpen: false,

      // Theme actions
      setTheme: (theme: Theme) => {
        set({ theme });
        
        // Apply theme to document
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      // Language actions
      setLanguage: (language: Language) => {
        set({ language });
        document.documentElement.lang = language;
      },

      // Loading actions
      setGlobalLoading: (isGlobalLoading: boolean) => {
        set({ isGlobalLoading });
      },

      // Toast actions
      showToast: (toast: Omit<Toast, 'id'>) => {
        const id = `toast-${Date.now()}`;
        const newToast = { ...toast, id };
        
        set(state => ({
          toasts: [...state.toasts, newToast],
        }));

        // Auto remove toast after duration
        if (toast.duration !== 0) {
          setTimeout(() => {
            get().hideToast(id);
          }, toast.duration || 5000);
        }
      },

      hideToast: (id: string) => {
        set(state => ({
          toasts: state.toasts.filter(toast => toast.id !== id),
        }));
      },

      clearToasts: () => {
        set({ toasts: [] });
      },

      // Modal actions
      openModal: (modal: Omit<Modal, 'id'>) => {
        const id = `modal-${Date.now()}`;
        set(state => ({
          modals: [...state.modals, { ...modal, id }],
        }));
      },

      closeModal: (id: string) => {
        set(state => ({
          modals: state.modals.filter(modal => modal.id !== id),
        }));
      },

      closeAllModals: () => {
        set({ modals: [] });
      },

      // Sidebar actions
      toggleSidebar: () => {
        set(state => ({ isSidebarOpen: !state.isSidebarOpen }));
      },

      setSidebarOpen: (isSidebarOpen: boolean) => {
        set({ isSidebarOpen });
      },

      // Mobile menu actions
      toggleMobileMenu: () => {
        set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
      },

      setMobileMenuOpen: (isMobileMenuOpen: boolean) => {
        set({ isMobileMenuOpen });
      },
    }),
    {
      name: 'UIStore',
    }
  )
);