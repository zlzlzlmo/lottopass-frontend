import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './auth.store';

// Supabase 모킹
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
    },
  })),
}));

describe('AuthStore', () => {
  beforeEach(() => {
    // 스토어 초기화
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    // localStorage 모킹 초기화
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    const state = useAuthStore.getState();
    
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it('updates user data', () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: '홍길동',
    };

    // 먼저 사용자 설정
    useAuthStore.setState({ 
      user: mockUser, 
      isAuthenticated: true 
    });
    
    // 사용자 업데이트
    useAuthStore.getState().updateUser({ name: '김철수' });
    
    const state = useAuthStore.getState();
    expect(state.user?.name).toBe('김철수');
    expect(state.user?.email).toBe('test@example.com');
  });

  it('handles sign out', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: '홍길동',
    };

    // 초기 상태 설정
    useAuthStore.setState({ 
      user: mockUser, 
      isAuthenticated: true 
    });
    
    // Supabase 모킹 설정
    const mockSignOut = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(require('@supabase/supabase-js').createClient).mockReturnValue({
      auth: { signOut: mockSignOut },
    });
    
    // 실제 signOut 호출
    await useAuthStore.getState().signOut();
    
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('manages loading state during auth operations', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ 
      data: { 
        user: { 
          id: '123', 
          email: 'test@example.com',
          user_metadata: { name: '홍길동' }
        } 
      }, 
      error: null 
    });
    
    vi.mocked(require('@supabase/supabase-js').createClient).mockReturnValue({
      auth: { signInWithPassword: mockSignIn },
    });
    
    // 로그인 시작
    const signInPromise = useAuthStore.getState().signIn('test@example.com', 'password');
    
    // 로딩 상태 확인
    expect(useAuthStore.getState().isLoading).toBe(true);
    
    // 로그인 완료 대기
    await signInPromise;
    
    // 로딩 종료 확인
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('does not update user when no user is set', () => {
    // user가 null일 때 updateUser 호출
    useAuthStore.getState().updateUser({ name: '김철수' });
    
    // user가 여전히 null인지 확인
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('handles checkAuth when not authenticated', async () => {
    const mockGetUser = vi.fn().mockResolvedValue({ 
      data: { user: null }, 
      error: null 
    });
    
    vi.mocked(require('@supabase/supabase-js').createClient).mockReturnValue({
      auth: { getUser: mockGetUser },
    });
    
    await useAuthStore.getState().checkAuth();
    
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });
});