import type { StoreSearchParams, StoreSearchResponse } from '../types';

class WinningStoresService {
  private baseUrl = '/api/lottery/winning-stores';

  async searchStores(params: StoreSearchParams): Promise<StoreSearchResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.region) queryParams.append('region', params.region);
    if (params.district) queryParams.append('district', params.district);
    if (params.round) queryParams.append('round', params.round.toString());
    if (params.rank) queryParams.append('rank', params.rank.toString());
    if (params.keyword) queryParams.append('keyword', params.keyword);
    
    const response = await fetch(`${this.baseUrl}?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch winning stores');
    }
    
    return response.json();
  }

  async getLatestRoundStores(): Promise<StoreSearchResponse> {
    const response = await fetch(`${this.baseUrl}/latest`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch latest round stores');
    }
    
    return response.json();
  }
}

export const winningStoresService = new WinningStoresService();