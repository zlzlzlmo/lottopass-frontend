/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from "axios";
import { FindAllResponse } from "lottopass-shared";

export class BaseApiService {
  protected axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
    });
  }

  protected async get<T>(
    url: string,
    params?: any
  ): Promise<FindAllResponse<T>> {
    try {
      const response = await this.axiosInstance.get(url, { params });
      if (!response.status)
        throw new Error(
          "Not proper data structure, Check controller return type"
        );
      return response.data as FindAllResponse<T>;
    } catch (error) {
      throw new Error((error as Error).message || "GET request failed");
    }
  }

  protected async post<T>(
    url: string,
    body?: any
  ): Promise<FindAllResponse<T>> {
    try {
      const response = await this.axiosInstance.post(url, body);
      return response.data as FindAllResponse<T>;
    } catch (error) {
      throw new Error((error as Error).message || "POST request failed");
    }
  }
}
