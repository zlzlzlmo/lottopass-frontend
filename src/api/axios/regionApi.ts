// API 관련 코드
import { FindAllResponse, UniqueRegion, WinningRegion } from "lottopass-shared";
import { API_URLS } from "../../constants/apiUrls";
import axiosInstance from "./axiosConfig";

export const getUniqueRegions = async (): Promise<
  FindAllResponse<UniqueRegion[]>
> => {
  try {
    const response = await axiosInstance.get(API_URLS.ALL_UNIQUE_REGIONS);
    return response.data;
  } catch (error) {
    return {
      status: "error",
      message: (error as Error).message || "Failed to fetch all rounds",
    };
  }
};
export const getWinningRegionsByLocation = async (
  province: string,
  city?: string
): Promise<FindAllResponse<WinningRegion[]>> => {
  try {
    const params: Record<string, string> = { province };
    if (city) {
      params.city = city;
    }

    const response = await axiosInstance.get(API_URLS.WINNING_REGIONS, {
      params,
    });
    return { status: "success", data: response.data };
  } catch (error) {
    return {
      status: "error",
      message: (error as Error).message || "Failed to fetch winning regions",
    };
  }
};

export const getWinningRegionsByDrawNumber = async (
  drawNumber: number
): Promise<FindAllResponse<WinningRegion[]>> => {
  try {
    const response = await axiosInstance.get(
      `${API_URLS.WINNING_REGIONS}/${drawNumber}`
    );
    return { status: "success", data: response.data };
  } catch (error) {
    return {
      status: "error",
      message: (error as Error).message || "Failed to fetch winning regions",
    };
  }
};

export interface Store {
  BPLCLOCPLC1: string; // 도/시
  BPLCLOCPLC2: string; // 시/구
  BPLCLOCPLC3: string; // 동/읍/면
  BPLCLOCPLC4?: string | null; // 추가 주소 (선택적)
  FIRMNM: string; // 매장 이름
  DEALSPEETO: string; // 스피또 판매 여부 ("Y" or "N")
  LONGITUDE: number; // 경도
  LATITUDE: number; // 위도
  RECORDNO: number; // 레코드 번호
  BPLCLOCPLCDTLADRES: string; // 상세 주소
  RTLRID: string; // 매장 ID
  RTLRSTRTELNO: string | null; // 전화번호
  DEAL645: string; // 로또 645 판매 여부 ("1": 판매, "3": 폐점)
  DEAL520: string; // 연금복권 판매 여부 ("Y" or "N")
  BPLCDORODTLADRES: string; // 도로명 주소
  DISTANCE?: number;
}

export const getAllStores = async (
  province: string,
  city: string
): Promise<FindAllResponse<Store[]>> => {
  try {
    const response = await axiosInstance.get(API_URLS.ALL_STORES, {
      params: { province, city },
    });
    return response.data;
  } catch (error) {
    return {
      status: "error",
      message: (error as Error).message || "Failed to fetch stores",
    };
  }
};
