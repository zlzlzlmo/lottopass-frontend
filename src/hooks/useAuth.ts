import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUser, clearUser } from '@/features/auth/authSlice';
import { Tables } from '@/lib/supabase/database.types';

type Profile = Tables<'profiles'>;

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

export function useAuth() {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector(state => state.auth.user);
  
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    // 초기 세션 확인
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user && mounted) {
          // 프로필 정보 가져오기
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Profile fetch error:', profileError);
          }
          
          setAuthState({
            user: session.user,
            profile: profile || null,
            session,
            loading: false,
            error: null,
          });
          
          // Redux 업데이트
          if (profile) {
            dispatch(setUser({
              id: profile.id,
              email: profile.email,
              nickname: profile.nickname || undefined,
            }));
          }
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        if (mounted) {
          setAuthState(prev => ({
            ...prev,
            loading: false,
            error: error as Error,
          }));
        }
      }
    };

    initAuth();

    // 인증 상태 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth event:', event);
        
        if (event === 'SIGNED_IN' && session) {
          // 프로필 정보 가져오기
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          setAuthState({
            user: session.user,
            profile: profile || null,
            session,
            loading: false,
            error: null,
          });
          
          if (profile) {
            dispatch(setUser({
              id: profile.id,
              email: profile.email,
              nickname: profile.nickname || undefined,
            }));
          }
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            profile: null,
            session: null,
            loading: false,
            error: null,
          });
          
          dispatch(clearUser());
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setAuthState(prev => ({
            ...prev,
            session,
          }));
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [dispatch]);

  // 로그인 함수
  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
      throw error;
    }
  };

  // 회원가입 함수
  const signUp = async (email: string, password: string, nickname?: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname },
        },
      });
      
      if (error) throw error;
      
      // 프로필 생성은 trigger가 처리
      
      return data;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
      throw error;
    }
  };

  // 로그아웃 함수
  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
      throw error;
    }
  };

  // 프로필 업데이트
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!authState.user) throw new Error('Not authenticated');
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', authState.user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setAuthState(prev => ({
        ...prev,
        profile: data,
      }));
      
      // Redux 업데이트
      dispatch(setUser({
        id: data.id,
        email: data.email,
        nickname: data.nickname || undefined,
      }));
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  return {
    ...authState,
    isAuthenticated: !!authState.user,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
}