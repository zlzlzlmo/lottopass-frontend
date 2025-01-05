import { BaseApiService } from "./baseAPI";

export class LocationService extends BaseApiService {
  constructor() {
    super(`${import.meta.env.VITE_API_BASE_URL}/location`);
  }

  // 모든 회차 가져오기
  async getCurrentMyLocation({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) {
    return await this.handleResponse(
      this.get<string>("/current", { latitude, longitude })
    );
  }
}
