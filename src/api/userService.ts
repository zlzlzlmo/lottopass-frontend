import { BaseApiService } from "./baseAPI";

export interface CreateUser {
  email: string;
  nickname: string;
  password: string;
}

export class UserService extends BaseApiService {
  constructor() {
    super(`${import.meta.env.VITE_API_BASE_URL}/users`);
  }

  // 회원가입 메서드
  async signup(userData: CreateUser) {
    return this.handleResponse(this.post<string>("/signup", userData));
  }
}
