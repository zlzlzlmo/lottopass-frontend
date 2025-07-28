import { StoreInfo, UniqueRegion, WinningRegion } from "@/types";
import { BaseApiService } from "./baseAPI";
import axios from "axios";

interface WinningStoreResponse {
  drawNumber: number;
  stores: Array<{
    rank: number;
    storeName: string;
    type?: string;
    address: string;
  }>;
}

export class RegionService extends BaseApiService {
  private winningStoresApiUrl = import.meta.env.DEV 
    ? "/api/winning-stores" // 개발 환경
    : "/api/winning-stores"; // 프로덕션 서버리스 함수
  
  constructor() {
    super(`${import.meta.env.VITE_API_BASE_URL}/region`);
  }

  // 1등 당첨이 나왔던 모든 지역들 불러오기
  async getAllRegions() {
    return await this.handleResponse(this.get<UniqueRegion[]>("/unique/all"));
  }

  async getWinningStoresByRegion(province: string, city: string = "") {
    const res = await this.handleResponse(
      this.get<WinningRegion[]>("/stores/winning", {
        province,
        city,
      })
    );
    return res;
  }

  async getAllStoresByRegion(province: string, city: string = "") {
    const res = await this.handleResponse(
      this.get<StoreInfo[]>("/all-stores", {
        province,
        city,
      })
    );
    return res;
  }

  async getWinningStoresByDrawNumber(drawNumber: number) {
    try {
      const response = await axios.get<WinningStoreResponse>(
        `${this.winningStoresApiUrl}?drwNo=${drawNumber}`
      );
      
      // 서버리스 함수 응답을 기존 타입으로 변환
      const winningRegions: WinningRegion[] = response.data.stores.map((store, index) => ({
        id: index + 1,
        drwNo: response.data.drawNumber,
        rank: store.rank,
        no: index + 1,
        bplcdorodtladres: store.address,
        bplclocplc1: store.address.split(' ')[0] || '', // 시/도
        bplclocplc2: store.address.split(' ')[1] || '', // 구/군
        bplclocplc3: store.address.split(' ')[2] || '', // 동
        bplclocplc4: '',
        bplcnm: store.storeName,
        rtlrid: '',
        latitude: 0,
        longitude: 0,
        bplclocplcdtladres: store.address,
        grdtotalcnt: '',
        ntrupslgnbyyn: store.type === '자동' ? 'A' : store.type === '반자동' ? 'S' : 'M'
      } as WinningRegion));
      
      return winningRegions;
    } catch (error) {
      // 실패 시 기존 백엔드 API 사용 (폴백)
      try {
        const res = await this.handleResponse(
          this.get<WinningRegion[]>(`/winning/${drawNumber}`)
        );
        return res;
      } catch {
        console.error('Failed to fetch winning stores:', error);
        return [];
      }
    }
  }
}
