import { API_URLS } from '../../constants/apiUrls';
import axiosInstance from './axiosConfig';

// 직전 5개의 회차
export const getLatestRounds = async (): Promise<number[]> => {
  const response = await axiosInstance.get(API_URLS.LATEST_ROUNDS);
  return response.data;
};

export const getLatestRoundsNumbers = async (drwNos: string[]): Promise<number[]> => {
  const response = await axiosInstance.post(API_URLS.LATEST_ROUNDS_NUMBERS, {
    drwNos
  });
  return response.data;
};