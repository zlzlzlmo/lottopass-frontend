import { UserProfile } from "@/types";
import { supabase } from "@/lib/supabase/client";

export class SupabaseAuthService {
  async requestEmailVerification(email: string): Promise<boolean> {
    // Supabase는 이메일 인증을 signUp 과정에서 자동으로 처리
    // 여기서는 이메일이 이미 존재하는지 확인
    const { data } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single();

    return !data; // 이메일이 없으면 true (사용 가능)
  }

  async verifyEmailCode(email: string, verificationCode: string): Promise<boolean> {
    // Supabase는 OTP 검증을 다르게 처리
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: verificationCode,
      type: 'email',
    });

    return !error;
  }

  async getMe(): Promise<UserProfile> {
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

  async login(email: string, password: string): Promise<{ token: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { token: data.session?.access_token || '' };
  }

  async checkEmail(email: string): Promise<boolean> {
    const { data } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email);

    return data && data.length > 0;
  }
}