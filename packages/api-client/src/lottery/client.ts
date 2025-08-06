import type { 
  LottoDraw, 
  NumberStatistics,
  ApiResponse
} from '@lottopass/shared';

// Temporary types until shared package is refactored
export interface WinningStore {
  round: number;
  rank: number;
  storeName: string;
  address: string;
  method: '자동' | '수동' | '반자동';
  region: string;
  district: string;
}

export interface StoreSearchParams {
  region?: string;
  district?: string;
  round?: number;
  rank?: number;
}

// API 기본 설정
const API_BASE = '/api/lottery';

// API 클라이언트 클래스
export class LotteryApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * 최신 회차 정보 조회
   */
  async getLatestDraw(): Promise<LottoDraw> {
    const response = await fetch(`${this.baseUrl}${API_BASE}/draws/latest`);
    const data: ApiResponse<LottoDraw> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch latest draw');
    }
    
    return data.data;
  }
  
  /**
   * 특정 회차 정보 조회
   */
  async getDrawByRound(round: number): Promise<LottoDraw> {
    const response = await fetch(`${this.baseUrl}${API_BASE}/draws/${round}`);
    const data: ApiResponse<LottoDraw> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error || `Failed to fetch draw ${round}`);
    }
    
    return data.data;
  }
  
  /**
   * 여러 회차 정보 일괄 조회
   */
  async getMultipleDraws(rounds: number[]): Promise<LottoDraw[]> {
    const promises = rounds.map(round => 
      this.getDrawByRound(round).catch(() => null)
    );
    
    const results = await Promise.all(promises);
    return results.filter((draw): draw is LottoDraw => draw !== null);
  }
  
  /**
   * 회차 범위로 조회
   */
  async getDrawsByRange(startRound: number, endRound: number): Promise<LottoDraw[]> {
    const rounds: number[] = [];
    for (let i = startRound; i <= endRound; i++) {
      rounds.push(i);
    }
    
    return this.getMultipleDraws(rounds);
  }
  
  /**
   * 번호별 통계 조회
   */
  async getStatistics(recentCount: number = 100): Promise<{
    statistics: NumberStatistics[];
    meta: {
      analyzedDraws: number;
      latestRound: number;
      oldestRound: number;
    };
  }> {
    const response = await fetch(
      `${this.baseUrl}${API_BASE}/statistics?recent=${recentCount}`
    );
    const data = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch statistics');
    }
    
    return {
      statistics: data.data,
      meta: data.meta,
    };
  }
  
  /**
   * 당첨 판매점 조회
   */
  async getWinningStores(params?: StoreSearchParams): Promise<{
    stores: WinningStore[];
    meta: {
      round: number;
      rank: number;
      totalStores: number;
      regionalStats: Record<string, number>;
    };
  }> {
    const searchParams = new URLSearchParams();
    
    if (params?.round) searchParams.append('round', params.round.toString());
    if (params?.rank) searchParams.append('rank', params.rank.toString());
    if (params?.region) searchParams.append('region', params.region);
    if (params?.district) searchParams.append('district', params.district);
    
    const response = await fetch(
      `${this.baseUrl}${API_BASE}/stores?${searchParams.toString()}`
    );
    const data = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch winning stores');
    }
    
    return {
      stores: data.data,
      meta: data.meta,
    };
  }
  
  /**
   * 지역 목록 조회
   */
  async getRegions(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}${API_BASE}/stores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'getRegions' }),
    });
    const data = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch regions');
    }
    
    return data.data;
  }
  
  /**
   * 번호 조합이 당첨된 적이 있는지 확인
   */
  async checkWinningHistory(numbers: number[]): Promise<{
    hasWon: boolean;
    winningRounds: Array<{
      round: number;
      rank: number;
      drawDate: string;
    }>;
  }> {
    // 최근 1000회차 확인 (실제로는 DB에서 효율적으로 조회해야 함)
    const latest = await this.getLatestDraw();
    const startRound = Math.max(1, latest.drwNo - 1000);
    
    const winningRounds: Array<{
      round: number;
      rank: number;
      drawDate: string;
    }> = [];
    
    // 병렬로 여러 회차 확인
    const batchSize = 50;
    for (let i = latest.drwNo; i >= startRound; i -= batchSize) {
      const rounds: number[] = [];
      for (let j = 0; j < batchSize && i - j >= startRound; j++) {
        rounds.push(i - j);
      }
      
      const draws = await this.getMultipleDraws(rounds);
      
      draws.forEach(draw => {
        const drawNumbers = [
          draw.drwtNo1,
          draw.drwtNo2,
          draw.drwtNo3,
          draw.drwtNo4,
          draw.drwtNo5,
          draw.drwtNo6
        ];
        const matchCount = numbers.filter(num => 
          drawNumbers.includes(num)
        ).length;
        
        if (matchCount >= 3) {
          let rank = 0;
          if (matchCount === 6) rank = 1;
          else if (matchCount === 5 && numbers.includes(draw.bnusNo)) rank = 2;
          else if (matchCount === 5) rank = 3;
          else if (matchCount === 4) rank = 4;
          else if (matchCount === 3) rank = 5;
          
          if (rank > 0) {
            winningRounds.push({
              round: draw.drwNo,
              rank,
              drawDate: draw.drwNoDate,
            });
          }
        }
      });
    }
    
    return {
      hasWon: winningRounds.length > 0,
      winningRounds: winningRounds.sort((a, b) => b.round - a.round),
    };
  }
}

// 싱글톤 인스턴스
export const lotteryApi = new LotteryApiClient();