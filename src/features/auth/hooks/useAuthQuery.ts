import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { Tables } from '@/lib/supabase/database.types';
import { Session, User } from '@supabase/supabase-js';

type Profile = Tables<'profiles'>;

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  profile: (userId?: string) => [...authKeys.all, 'profile', userId] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// 세션 조회
export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
    staleTime: 1000 * 60 * 5, // 5분
  });
}

// 사용자 정보 조회
export function useUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
    staleTime: 1000 * 60 * 5, // 5분
  });
}

// 프로필 조회
export function useProfile(userId?: string) {
  const { data: user } = useUser();
  const id = userId || user?.id;
  
  return useQuery({
    queryKey: authKeys.profile(id),
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

// 로그인 Mutation
export function useSignIn() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // 캐시 업데이트
      queryClient.setQueryData(authKeys.session(), data.session);
      queryClient.setQueryData(authKeys.user(), data.user);
      
      // 프로필 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

// 회원가입 Mutation
export function useSignUp() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      email, 
      password, 
      nickname 
    }: { 
      email: string; 
      password: string; 
      nickname?: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname },
        },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // 인증 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

// 로그아웃 Mutation
export function useSignOut() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      // 모든 인증 관련 캐시 제거
      queryClient.removeQueries({ queryKey: authKeys.all });
      
      // 다른 사용자 관련 쿼리도 제거
      queryClient.removeQueries({ queryKey: ['records'] });
      queryClient.removeQueries({ queryKey: ['savedNumbers'] });
    },
  });
}

// 프로필 업데이트 Mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  
  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // 프로필 캐시 업데이트
      queryClient.setQueryData(authKeys.profile(data.id), data);
    },
  });
}

// 비밀번호 변경 Mutation
export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
    },
  });
}

// 비밀번호 재설정 요청 Mutation
export function useResetPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
    },
  });
}

// 인증 상태 구독 Hook
export function useAuthStateSubscription() {
  const queryClient = useQueryClient();
  
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          queryClient.setQueryData(authKeys.session(), session);
          queryClient.setQueryData(authKeys.user(), session.user);
          queryClient.invalidateQueries({ queryKey: authKeys.profile() });
        } else if (event === 'SIGNED_OUT') {
          queryClient.removeQueries({ queryKey: authKeys.all });
        } else if (event === 'TOKEN_REFRESHED' && session) {
          queryClient.setQueryData(authKeys.session(), session);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
}