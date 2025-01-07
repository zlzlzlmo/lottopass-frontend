import { UserProfile } from "lottopass-shared";
import { BaseApiService } from "./baseAPI";

export class AuthService extends BaseApiService {
  constructor() {
    super(`${import.meta.env.VITE_API_BASE_URL}/auth`);
  }

  async getMe(): Promise<UserProfile> {
    return this.handleResponse(this.get<UserProfile>("/me"));
  }

  async getLogout() {
    return await this.get("/logout");
  }
}
