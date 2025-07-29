import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isLoading: false,
        isAuthenticated: false,

        signIn: async (email: string, password: string) => {
          set({ isLoading: true });
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) throw error;

            if (data.user) {
              const user: User = {
                id: data.user.id,
                email: data.user.email || '',
                name: data.user.user_metadata?.name,
                avatar: data.user.user_metadata?.avatar_url,
              };
              
              set({ 
                user, 
                isAuthenticated: true, 
                isLoading: false 
              });
            }
          } catch (error) {
            console.error('Sign in error:', error);
            set({ isLoading: false });
            throw error;
          }
        },

        signUp: async (email: string, password: string, name?: string) => {
          set({ isLoading: true });
          try {
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: { name },
              },
            });

            if (error) throw error;

            if (data.user) {
              const user: User = {
                id: data.user.id,
                email: data.user.email || '',
                name: name,
              };
              
              set({ 
                user, 
                isAuthenticated: true, 
                isLoading: false 
              });
            }
          } catch (error) {
            console.error('Sign up error:', error);
            set({ isLoading: false });
            throw error;
          }
        },

        signOut: async () => {
          set({ isLoading: true });
          try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
          } catch (error) {
            console.error('Sign out error:', error);
            set({ isLoading: false });
            throw error;
          }
        },

        checkAuth: async () => {
          set({ isLoading: true });
          try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            
            if (authUser) {
              const user: User = {
                id: authUser.id,
                email: authUser.email || '',
                name: authUser.user_metadata?.name,
                avatar: authUser.user_metadata?.avatar_url,
              };
              
              set({ 
                user, 
                isAuthenticated: true, 
                isLoading: false 
              });
            } else {
              set({ 
                user: null, 
                isAuthenticated: false, 
                isLoading: false 
              });
            }
          } catch (error) {
            console.error('Check auth error:', error);
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
          }
        },

        updateUser: (data: Partial<User>) => {
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: { ...currentUser, ...data },
            });
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      }
    ),
    {
      name: 'AuthStore',
    }
  )
);