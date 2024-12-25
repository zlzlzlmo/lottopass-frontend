// import { FindAllResponse } from "lottopass-shared";
import { FindAllResponse } from "lottopass-shared";
import { API_URLS } from "../../constants/apiUrls";
import axiosInstance from "./axiosConfig";

export const getAllRounds = async (): Promise<FindAllResponse> => {
  const response = await axiosInstance.get(API_URLS.ALL_ROUNDS);
  return response.data;
};
