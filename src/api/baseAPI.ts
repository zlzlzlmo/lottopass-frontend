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
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "GET 요청 실패");
    }
  }

  protected async post<T>(
    url: string,
    body?: any
  ): Promise<FindAllResponse<T>> {
    try {
      const response = await this.axiosInstance.post(url, body);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "POST 요청 실패");
    }
  }

  protected async handleResponse<T>(
    promise: Promise<FindAllResponse<T>>
  ): Promise<T> {
    const response = await promise;
    if (response.status === "success") {
      return response.data;
    } else {
      throw new Error(response.message || "API 요청 실패");
    }
  }
}
