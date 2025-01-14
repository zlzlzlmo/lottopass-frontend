import { UserProfile } from "lottopass-shared";
import { BaseApiService } from "./baseAPI";

export class AuthService extends BaseApiService {
  constructor() {
    super(`${import.meta.env.VITE_API_BASE_URL}/auth`);
  }

  async requestEmailVerification(email: string) {
    return this.handleResponse(
      this.post<boolean>("/request-verification", { email })
    );
  }

  async verifyEmailCode(email: string, verificationCode: string) {
    return this.handleResponse(
      this.post<boolean>("/verify-code", {
        email,
        verificationCode,
      })
    );
  }

  async getMe(): Promise<UserProfile> {
    return this.handleResponse(this.get<UserProfile>("/me"));
  }

  async login(email: string, password: string) {
    return this.handleResponse(
      this.post<{ token: string }>("/login", {
        email,
        password,
      })
    );
  }
}
