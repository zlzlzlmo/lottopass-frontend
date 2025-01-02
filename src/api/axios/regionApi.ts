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
  city: string
): Promise<FindAllResponse<WinningRegion[]>> => {
  try {
    const response = await axiosInstance.get(API_URLS.WINNING_REGIONS, {
      params: { province, city },
    });
    return { status: "success", data: response.data };
  } catch (error) {
    return {
      status: "error",
      message: (error as Error).message || "Failed to fetch winning regions",
    };
  }
};
