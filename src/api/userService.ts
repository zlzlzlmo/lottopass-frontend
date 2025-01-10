/* eslint-disable @typescript-eslint/no-explicit-any */
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

  async signup(userData: CreateUser) {
    try {
      return this.handleResponse(this.post<string>("/signup", userData));
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
