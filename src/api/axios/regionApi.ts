// API 관련 코드
import {
  FindAllResponse,
  StoreInfo,
  UniqueRegion,
  WinningRegion,
} from "lottopass-shared";
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

export const getAllStores = async (
  province: string,
  city: string
): Promise<FindAllResponse<StoreInfo[]>> => {
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
