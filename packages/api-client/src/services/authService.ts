import { apiClient } from '../client';
import type { 
  User, 
  AuthTokens, 
  LoginCredentials, 
  SignupData,
  ApiResponse 
} from '@lottopass/shared';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      'auth/login',
      credentials
    );
    return response.data;
  },

  async signup(data: SignupData): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      'auth/signup',
      data
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('auth/me');
    return response.data;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>('auth/profile', updates);
    return response.data;
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await apiClient.post('auth/change-password', data);
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post('auth/reset-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('auth/reset-password/confirm', { token, newPassword });
  },

  async deleteAccount(password: string): Promise<void> {
    await apiClient.delete('auth/account', { json: { password } });
  },

  async verifyEmail(code: string): Promise<void> {
    await apiClient.post('auth/verify-email', { code });
  },

  async resendVerificationEmail(): Promise<void> {
    await apiClient.post('auth/resend-verification');
  },
};