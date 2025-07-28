import { UserProfile } from "@/types";
import { supabase } from "@/lib/supabase/client";

export interface CreateUser {
  email: string;
  nickname: string;
  password: string;
}

export class SupabaseUserService {
  async signup(userData: CreateUser): Promise<string> {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) throw error;

    if (data.user) {
      // 프로필 생성
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: userData.email,
          nickname: userData.nickname,
        });

      if (profileError) throw profileError;
    }

    return data.user?.id || '';
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<{ user: UserProfile; token: string }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');

    // 프로필 업데이트
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        nickname: updates.nickname,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    // 현재 세션 토큰 가져오기
    const { data: { session } } = await supabase.auth.getSession();

    return {
      user: {
        id: profile.id,
        email: profile.email,
        nickname: profile.nickname || undefined,
      },
      token: session?.access_token || '',
    };
  }

  async getProfile(): Promise<UserProfile & { id: string }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    return {
      id: profile.id,
      email: profile.email,
      nickname: profile.nickname || undefined,
    };
  }

  async resetPassword(param: { email: string; newPassword: string }): Promise<boolean> {
    // Supabase에서는 resetPasswordForEmail로 이메일을 보내고
    // 사용자가 링크를 클릭한 후 updateUser로 비밀번호 변경
    const { error } = await supabase.auth.updateUser({
      password: param.newPassword,
    });

    return !error;
  }

  async deleteUser(password: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');

    // 먼저 비밀번호 확인을 위해 재로그인
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password,
    });

    if (signInError) throw new Error('Invalid password');

    // 프로필 삭제 (cascade로 관련 데이터도 삭제됨)
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (deleteError) throw deleteError;

    // 계정 삭제
    await supabase.auth.signOut();

    return true;
  }
}