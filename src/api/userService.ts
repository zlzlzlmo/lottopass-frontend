import { UserProfile } from "lottopass-shared";
import { BaseApiService } from "./baseAPI";
import { Record } from "./recordService";

export interface CreateUser {
  email: string;
  nickname: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  nickname: string;
  password: string;
  createdAt: Date;
  records: Record[];
}

export class UserService extends BaseApiService {
  constructor() {
    super(`${import.meta.env.VITE_API_BASE_URL}/users`);
  }

  async signup(userData: CreateUser) {
    return this.handleResponse(this.post<string>("/signup", userData));
  }

  async updateProfile(user: Partial<UserProfile>) {
    return this.handleResponse(
      this.put<{ user: UserProfile; token: string }>("/update-profile", user)
    );
  }

  async getProfile() {
    return this.handleResponse(
      this.get<{ id: string } & UserProfile>("/profile")
    );
  }

  async resetPassword(param: { email: string; newPassword: string }) {
    return this.handleResponse(this.post<boolean>("/reset-password", param));
  }

  async checkEmail(email: string) {
    return this.handleResponse(
      this.post<boolean>("/check-email", {
        email,
      })
    );
  }

  async deleteUser(password: string) {
    return this.handleResponse(
      this.delete<boolean>("/delete", {
        password,
      })
    );
  }
}
