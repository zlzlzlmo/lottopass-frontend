export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  favoriteNumbers: number[];
  excludedNumbers: number[];
  notificationEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  nickname: string;
  confirmPassword: string;
}

export interface SavedCombination {
  id: string;
  userId: string;
  numbers: number[];
  name?: string;
  createdAt: string;
  drawResults: DrawResult[];
}

export interface DrawResult {
  drawNumber: number;
  matchedNumbers: number[];
  rank?: 1 | 2 | 3 | 4 | 5;
  prize?: number;
}