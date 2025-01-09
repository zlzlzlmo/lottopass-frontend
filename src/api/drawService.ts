import { DetailDraw, LottoDraw } from "lottopass-shared";
import { BaseApiService } from "./baseAPI";
import { formatNumberWithCommas } from "@/utils/number";

export class DrawService extends BaseApiService {
  constructor() {
    super(`${import.meta.env.VITE_API_BASE_URL}/draw`);
  }

  async getAllDraws(): Promise<LottoDraw[]> {
    const response = await this.handleResponse(this.get<LottoDraw[]>("/all"));

    return response.map((draw) => ({
      ...draw,
      winningNumbers: draw.winningNumbers.map(Number),
    }));
  }

  async getLatestDraw(): Promise<LottoDraw> {
    return this.handleResponse(this.get<LottoDraw>("/latest"));
  }

  async getOneDraw(drawNumber: number): Promise<LottoDraw> {
    return this.handleResponse(this.get<LottoDraw>(`/${drawNumber}`));
  }

  async getDetailOneDraw(drawNumber: number): Promise<DetailDraw[]> {
    const response = await this.handleResponse(
      this.get<DetailDraw[]>(`/detail/${drawNumber}`)
    );

    // 데이터를 가공하여 반환
    const formatted = response.map((detail) => ({
      ...detail,
      winnerCount: formatNumberWithCommas(Number(detail.winnerCount)),
      totalPrize: `${Number(detail.totalPrize).toLocaleString()}원`,
      prizePerWinner: `${Number(detail.prizePerWinner).toLocaleString()}원`,
    }));

    return formatted;
  }
}
