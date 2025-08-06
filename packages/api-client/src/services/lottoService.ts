import { apiClient } from '../client';
import type { 
  LottoDraw, 
  GeneratedNumbers,
  SavedCombination,
  DrawStatistics,
  ApiResponse,
  PaginatedResponse,
  GenerateNumbersInput,
  SaveCombinationInput
} from '@lottopass/shared';

export const lottoService = {
  async getLatestDraw(): Promise<LottoDraw> {
    const response = await apiClient.get<ApiResponse<LottoDraw>>('api/lottery/draws/latest');
    return response.data;
  },

  async getAllDraws(params?: {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<LottoDraw>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<LottoDraw>>>(
      'lotto/draws',
      { searchParams: params }
    );
    return response.data;
  },

  async getDrawByNumber(drawNumber: number): Promise<LottoDraw> {
    const response = await apiClient.get<ApiResponse<LottoDraw>>(
      `api/lottery/draws/${drawNumber}`
    );
    return response.data;
  },

  async generateNumbers(input: GenerateNumbersInput): Promise<GeneratedNumbers> {
    const response = await apiClient.post<ApiResponse<GeneratedNumbers>>(
      'lotto/generate',
      input
    );
    return response.data;
  },

  async getStatistics(params?: {
    startDraw?: number;
    endDraw?: number;
  }): Promise<DrawStatistics> {
    const response = await apiClient.get<ApiResponse<DrawStatistics>>(
      'lotto/statistics',
      { searchParams: params }
    );
    return response.data;
  },

  async saveCombination(input: SaveCombinationInput): Promise<SavedCombination> {
    const response = await apiClient.post<ApiResponse<SavedCombination>>(
      'lotto/combinations',
      input
    );
    return response.data;
  },

  async getSavedCombinations(): Promise<SavedCombination[]> {
    const response = await apiClient.get<ApiResponse<SavedCombination[]>>(
      'lotto/combinations'
    );
    return response.data;
  },

  async updateCombination(
    id: string,
    updates: Partial<SaveCombinationInput>
  ): Promise<SavedCombination> {
    const response = await apiClient.patch<ApiResponse<SavedCombination>>(
      `lotto/combinations/${id}`,
      updates
    );
    return response.data;
  },

  async deleteCombination(id: string): Promise<void> {
    await apiClient.delete(`lotto/combinations/${id}`);
  },

  async checkCombinationResult(
    combinationId: string,
    drawNumber: number
  ): Promise<{
    matchedNumbers: number[];
    rank: number | null;
    prize: number | null;
  }> {
    const response = await apiClient.get<ApiResponse<{
      matchedNumbers: number[];
      rank: number | null;
      prize: number | null;
    }>>(`lotto/combinations/${combinationId}/check/${drawNumber}`);
    return response.data;
  },

  async simulateDraw(numbers: number[], iterations: number = 1000): Promise<{
    results: Array<{
      rank: number | null;
      count: number;
      totalPrize: number;
    }>;
    totalCost: number;
    netProfit: number;
    roi: number;
  }> {
    const response = await apiClient.post<ApiResponse<{
      results: Array<{
        rank: number | null;
        count: number;
        totalPrize: number;
      }>;
      totalCost: number;
      netProfit: number;
      roi: number;
    }>>('lotto/simulate', { numbers, iterations });
    return response.data;
  },
};