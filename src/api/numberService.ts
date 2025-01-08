/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApiService } from "./baseAPI";

export class NumberService extends BaseApiService {
  constructor() {
    super(`${import.meta.env.VITE_API_BASE_URL}/lotto-combination`);
  }

  async setNumberCombination(combination: number[]): Promise<any> {
    return this.handleResponse(this.post("/save", { combination }));
  }
}
