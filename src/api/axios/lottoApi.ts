// API 관련 코드
import { FindAllResponse, LottoDraw } from "lottopass-shared";
import { API_URLS } from "../../constants/apiUrls";
import axiosInstance from "./axiosConfig";

export const getAllRounds = async (): Promise<FindAllResponse<LottoDraw[]>> => {
  try {
    const response = await axiosInstance.get(API_URLS.ALL_ROUNDS);
    return response.data;
  } catch (error) {
    return {
      status: "error",
      message: (error as Error).message || "Failed to fetch all rounds",
    };
  }
};

export const getLatestRound = async (): Promise<FindAllResponse<LottoDraw>> => {
  try {
    const response = await axiosInstance.get(API_URLS.LATEST);
    return response.data;
  } catch (error) {
    return {
      status: "error",
      message: (error as Error).message || "Failed to fetch the latest round",
    };
  }
};

export const getDrawDetail = async (
  drawNumber: string | number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<FindAllResponse<any[]>> => {
  if (isNaN(Number(drawNumber))) throw new Error("Not Allowd DrawNumber Type");
  try {
    const response = await axiosInstance.get(
      `${API_URLS.DRAW_DETAIL}/${drawNumber}`
    );
    return response.data;
  } catch (error) {
    return {
      status: "error",
      message: (error as Error).message || "Failed to fetch the latest round",
    };
  }
};
