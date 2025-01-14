/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from "axios";
import { FindAllResponse } from "lottopass-shared";

export class BaseApiService {
  protected axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      withCredentials: true, // 필요하면 유지 (쿠키 기반 인증용)
    });

    // 요청 인터셉터 설정
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("JWT가 없습니다.");
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  protected async get<T>(
    url: string,
    params?: any
  ): Promise<FindAllResponse<T>> {
    try {
      const response = await this.axiosInstance.get(url, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "GET 요청 실패");
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
      throw new Error(error.response?.data?.message || "POST 요청 실패");
    }
  }

  protected async put<T>(url: string, body?: any): Promise<FindAllResponse<T>> {
    try {
      const response = await this.axiosInstance.put(url, body);
      return response.data;
    } catch (error: any) {
      console.log("PUT 요청 실패:", error.response?.data?.message);
      throw new Error(error.response?.data?.message || "PUT 요청 실패");
    }
  }

  protected async delete<T>(
    url: string,
    body?: any
  ): Promise<FindAllResponse<T>> {
    try {
      const response = await this.axiosInstance.delete(url, {
        data: body,
      });
      return response.data;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.response?.data?.message || "DELETE 요청 실패");
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
