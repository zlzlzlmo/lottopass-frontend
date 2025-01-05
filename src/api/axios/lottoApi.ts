// API 관련 코드
import { FindAllResponse, LottoDraw, DetailDraw } from "lottopass-shared";
import { API_URLS } from "../../constants/apiUrls";
import axiosInstance from "./axiosConfig";

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
): Promise<FindAllResponse<DetailDraw[]>> => {
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
