import { UniqueRegion, WinningRegion } from "lottopass-shared";
import { BaseApiService } from "./baseAPI";

export class RegionService extends BaseApiService {
  constructor() {
    super(`${import.meta.env.VITE_API_BASE_URL}/region`);
  }

  // 1등 당첨이 나왔던 모든 지역들 불러오기
  async getAllRegions() {
    return await this.get<UniqueRegion[]>("/unique/all");
  }

  async getWinningStoresByRegion(province: string, city: string = "") {
    const res = await this.get<WinningRegion[]>("/stores/winning", {
      province,
      city,
    });
    console.log("safsdaf111 : ", res);
    return res;
  }
}
