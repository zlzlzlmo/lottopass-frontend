import ky from 'ky';
import type { KyInstance } from 'ky';
import { API_BASE_URL, STORAGE_KEYS } from '@lottopass/shared';

class ApiClient {
  private client: KyInstance;

  constructor() {
    this.client = ky.create({
      prefixUrl: API_BASE_URL,
      timeout: 30000,
      retry: {
        limit: 2,
        methods: ['get', 'put', 'delete'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504],
      },
      hooks: {
        beforeRequest: [
          (request) => {
            const token = this.getToken();
            if (token) {
              request.headers.set('Authorization', `Bearer ${token}`);
            }
          },
        ],
        afterResponse: [
          async (_request, _options, response) => {
            if (response.status === 401) {
              // Token expired, try to refresh
              const refreshToken = this.getRefreshToken();
              if (refreshToken) {
                try {
                  const newTokens = await this.refreshTokens(refreshToken);
                  this.setTokens(newTokens);
                  // Retry the original request
                  return ky(_request);
                } catch {
                  // Refresh failed, redirect to login
                  this.clearTokens();
                  window.location.href = '/login';
                }
              }
            }
            return response;
          },
        ],
      },
    });
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  private setTokens(tokens: { accessToken: string; refreshToken: string }) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  }

  private clearTokens() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  private async refreshTokens(refreshToken: string) {
    const response = await ky.post(`${API_BASE_URL}/auth/refresh`, {
      json: { refreshToken },
    }).json<{ accessToken: string; refreshToken: string }>();
    return response;
  }

  // HTTP Methods
  async get<T>(url: string, options?: any): Promise<T> {
    return this.client.get(url, options).json<T>();
  }

  async post<T>(url: string, data?: any, options?: any): Promise<T> {
    return this.client.post(url, { json: data, ...options }).json<T>();
  }

  async put<T>(url: string, data?: any, options?: any): Promise<T> {
    return this.client.put(url, { json: data, ...options }).json<T>();
  }

  async patch<T>(url: string, data?: any, options?: any): Promise<T> {
    return this.client.patch(url, { json: data, ...options }).json<T>();
  }

  async delete<T>(url: string, options?: any): Promise<T> {
    return this.client.delete(url, options).json<T>();
  }
}

export const apiClient = new ApiClient();