import { BaseApiService } from "./baseAPI";

export interface LottoCombination {
  id: string;
  combination: number[];
  user: {
    id: string;
    email: string;
    name: string;
    picture: string;
  };
  createdAt: string;
}

export class NumberService extends BaseApiService {
  constructor() {
    super(`${import.meta.env.VITE_API_BASE_URL}/lotto-combination`);
  }

  async getUserCombinations(): Promise<LottoCombination[]> {
    return this.handleResponse(this.get("/"));
  }

  async setNumberCombination(combination: number[]): Promise<LottoCombination> {
    return this.handleResponse(this.post("/save", { combination }));
  }

  async deleteCombination(id: string): Promise<boolean> {
    return this.handleResponse(this.delete(`/${id}`));
  }
}
