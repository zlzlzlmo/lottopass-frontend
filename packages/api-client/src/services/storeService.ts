import { apiClient } from '../client';
import type { 
  Store, 
  StoreSearchParams,
  WinningRecord,
  ApiResponse,
  PaginatedResponse 
} from '@lottopass/shared';

export const storeService = {
  async searchStores(params: StoreSearchParams): Promise<PaginatedResponse<Store>> {
    const searchParams: Record<string, string> = {};
    if (params.sido) searchParams.sido = params.sido;
    if (params.sigungu) searchParams.sigungu = params.sigungu;
    if (params.keyword) searchParams.keyword = params.keyword;
    if (params.onlyWinners !== undefined) searchParams.onlyWinners = String(params.onlyWinners);
    if (params.limit !== undefined) searchParams.limit = String(params.limit);
    if (params.offset !== undefined) searchParams.offset = String(params.offset);
    
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Store>>>(
      'stores',
      { searchParams }
    );
    return response.data;
  },

  async getStoreById(id: string): Promise<Store> {
    const response = await apiClient.get<ApiResponse<Store>>(`stores/${id}`);
    return response.data;
  },

  async getWinningStores(params?: {
    drawNumber?: number;
    rank?: number;
    sido?: string;
    sigungu?: string;
    limit?: number;
  }): Promise<Store[]> {
    const response = await apiClient.get<ApiResponse<Store[]>>(
      'stores/winners',
      { searchParams: params }
    );
    return response.data;
  },

  async getStoreWinningHistory(storeId: string): Promise<WinningRecord[]> {
    const response = await apiClient.get<ApiResponse<WinningRecord[]>>(
      `stores/${storeId}/history`
    );
    return response.data;
  },

  async getNearbyStores(params: {
    latitude: number;
    longitude: number;
    radius?: number; // in meters, default 5000
    onlyWinners?: boolean;
  }): Promise<Store[]> {
    const response = await apiClient.get<ApiResponse<Store[]>>(
      'stores/nearby',
      { searchParams: params }
    );
    return response.data;
  },

  async getRegions(): Promise<{
    sido: string[];
    sigungu: Record<string, string[]>;
  }> {
    const response = await apiClient.get<ApiResponse<{
      sido: string[];
      sigungu: Record<string, string[]>;
    }>>('stores/regions');
    return response.data;
  },

  async getTopWinningStores(params?: {
    period?: 'all' | 'year' | 'month';
    limit?: number;
  }): Promise<Array<Store & { totalWins: number; totalPrize: number }>> {
    const response = await apiClient.get<
      ApiResponse<Array<Store & { totalWins: number; totalPrize: number }>>
    >('stores/top-winners', { searchParams: params });
    return response.data;
  },
};