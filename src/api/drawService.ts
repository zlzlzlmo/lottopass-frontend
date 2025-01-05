import { LottoDraw } from "lottopass-shared";
import { BaseApiService } from "./baseAPI";

export class DrawService extends BaseApiService {
  constructor() {
    super(`${import.meta.env.VITE_API_BASE_URL}/draw`);
  }

  // 모든 회차 가져오기
  async getAllRounds() {
    return await this.get<LottoDraw[]>("/all");
  }

  // 최신 회차 가져오기
  async getLatestRound() {
    return await this.get<LottoDraw>("/latest");
  }
}
