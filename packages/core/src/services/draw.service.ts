import axios from 'axios';
import { z } from 'zod';

// Schema definitions with Zod for runtime validation
export const DrawResultSchema = z.object({
  drwNo: z.number(),
  drwNoDate: z.string(),
  totSellamnt: z.number(),
  firstWinamnt: z.number(),
  firstPrzwnerCo: z.number(),
  firstAccumamnt: z.number(),
  drwtNo1: z.number(),
  drwtNo2: z.number(),
  drwtNo3: z.number(),
  drwtNo4: z.number(),
  drwtNo5: z.number(),
  drwtNo6: z.number(),
  bnusNo: z.number(),
  returnValue: z.string(),
});

export type DrawResult = z.infer<typeof DrawResultSchema>;

export interface LottoDraw {
  id: number;
  drwNo: number;
  drawNumber: number;
  drwtNo1: number;
  drwtNo2: number;
  drwtNo3: number;
  drwtNo4: number;
  drwtNo5: number;
  drwtNo6: number;
  bnusNo: number;
  bonusNumber: number;
  totSellamnt: number;
  firstAccumamnt: number;
  firstPrzwnerCo: number;
  firstWinamnt: number;
  drwNoDate: string;
  date: string;
  winningNumbers: number[];
  prizeStatistics: {
    firstPrizeWinnerCount: number;
    firstWinAmount: number;
    totalSalesAmount: number;
    firstAccumulatedAmount: number;
  };
}

export interface DetailDraw {
  rank: number;
  winnerCount: string;
  totalPrize: string;
  prizePerWinner: string;
}

// Simple in-memory cache for draw results
interface CacheEntry {
  data: DrawResult;
  timestamp: number;
}

export class DrawService {
  private static instance: DrawService;
  private readonly baseUrl: string;
  private readonly isServer: boolean;
  private readonly cache = new Map<number, CacheEntry>();
  private readonly cacheTTL = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {
    this.isServer = typeof window === 'undefined';
    
    // 환경별 URL 설정
    if (this.isServer) {
      this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    } else {
      // 클라이언트 사이드
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        this.baseUrl = '/dhlottery'; // 개발 환경 프록시
      } else {
        this.baseUrl = '/api/lottery'; // 프로덕션 서버리스 함수
      }
    }
  }

  static getInstance(): DrawService {
    if (!DrawService.instance) {
      DrawService.instance = new DrawService();
    }
    return DrawService.instance;
  }

  /**
   * 특정 회차의 로또 당첨 정보를 가져옵니다
   */
  async getDrawResult(drwNo: number): Promise<DrawResult> {
    // Check cache first
    const cached = this.cache.get(drwNo);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    try {
      const url = this.getLotteryUrl(drwNo);
      const response = await axios.get(url, { timeout: 10000 });

      // Runtime validation
      const result = DrawResultSchema.parse(response.data);
      
      // Cache the result
      this.cache.set(drwNo, { data: result, timestamp: Date.now() });
      
      return result;
    } catch (error) {
      console.error(`Failed to fetch draw result for round ${drwNo}:`, error);
      throw new Error(`당첨 정보를 가져오는데 실패했습니다. (회차: ${drwNo})`);
    }
  }

  /**
   * 특정 회차의 로또 당첨 정보를 LottoDraw 형식으로 가져옵니다
   */
  async getOneDraw(drawNumber: number): Promise<LottoDraw> {
    const result = await this.getDrawResult(drawNumber);
    return this.convertToLottoDraw(result);
  }

  /**
   * 최신 회차의 로또 당첨 정보를 가져옵니다
   */
  async getLatestDrawResult(): Promise<DrawResult> {
    try {
      // 최신 회차 찾기 - 대략적인 계산 (주차 기준)
      const baseDate = new Date(2002, 11, 7); // 2002년 12월 7일 (1회차)
      const currentDate = new Date();
      const weeksDiff = Math.floor((currentDate.getTime() - baseDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      const estimatedLatestRound = weeksDiff + 1;
      
      // 최신 회차부터 역순으로 찾기
      for (let round = estimatedLatestRound; round > estimatedLatestRound - 10; round--) {
        try {
          const result = await this.getDrawResult(round);
          if (result.returnValue === "success") {
            return result;
          }
        } catch {
          continue;
        }
      }
      
      throw new Error('Failed to fetch latest draw');
    } catch (error) {
      console.error('Failed to fetch latest draw result:', error);
      throw new Error('최신 당첨 정보를 가져오는데 실패했습니다.');
    }
  }

  /**
   * 최신 회차의 로또 당첨 정보를 LottoDraw 형식으로 가져옵니다
   */
  async getLatestDraw(): Promise<LottoDraw> {
    const result = await this.getLatestDrawResult();
    return this.convertToLottoDraw(result);
  }

  /**
   * 여러 회차의 로또 당첨 정보를 한번에 가져옵니다 (최적화된 버전)
   */
  async getMultipleDrawResults(drwNos: number[]): Promise<DrawResult[]> {
    try {
      // Separate cached and uncached rounds
      const results: DrawResult[] = [];
      const uncachedRounds: number[] = [];
      
      for (const drwNo of drwNos) {
        const cached = this.cache.get(drwNo);
        if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
          results.push(cached.data);
        } else {
          uncachedRounds.push(drwNo);
        }
      }
      
      // Fetch uncached rounds in batches
      const BATCH_SIZE = 10;
      for (let i = 0; i < uncachedRounds.length; i += BATCH_SIZE) {
        const batch = uncachedRounds.slice(i, i + BATCH_SIZE);
        const batchPromises = batch.map(drwNo => 
          this.getDrawResult(drwNo).catch(err => {
            console.error(`Failed to fetch round ${drwNo}:`, err);
            return null;
          })
        );
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.filter((r): r is DrawResult => r !== null));
      }
      
      // Sort by round number
      return results.sort((a, b) => a.drwNo - b.drwNo);
    } catch (error) {
      console.error('Failed to fetch multiple draw results:', error);
      throw new Error('다중 회차 정보를 가져오는데 실패했습니다.');
    }
  }

  /**
   * 특정 기간의 모든 회차 정보를 가져옵니다 (프로그레시브 로딩 지원)
   */
  async getDrawResultsInRange(
    startRound: number, 
    endRound: number,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<DrawResult[]> {
    const totalRounds = endRound - startRound + 1;
    if (totalRounds > 500) {
      throw new Error('범위가 너무 큽니다. 최대 500개까지 가능합니다.');
    }
    
    const rounds = Array.from({ length: totalRounds }, (_, i) => startRound + i);
    const results: DrawResult[] = [];
    let loaded = 0;
    
    // Process in smaller chunks for progress updates
    const CHUNK_SIZE = 20;
    for (let i = 0; i < rounds.length; i += CHUNK_SIZE) {
      const chunk = rounds.slice(i, i + CHUNK_SIZE);
      const chunkResults = await this.getMultipleDrawResults(chunk);
      results.push(...chunkResults);
      
      loaded += chunkResults.length;
      if (onProgress) {
        onProgress(loaded, totalRounds);
      }
    }
    
    return results;
  }

  /**
   * 모든 회차 정보를 가져옵니다 (최근 100개)
   */
  async getAllDraws(): Promise<LottoDraw[]> {
    const latest = await this.getLatestDraw();
    if (!latest) return [];
    
    // 최근 100개 회차만 가져오기 (필요시 조정)
    const startRound = Math.max(1, latest.drwNo - 99);
    const results = await this.getDrawResultsInRange(startRound, latest.drwNo);
    
    return results.map(result => this.convertToLottoDraw(result));
  }

  /**
   * 상세 당첨 정보를 가져옵니다
   */
  async getDetailOneDraw(drawNumber: number): Promise<DetailDraw[]> {
    const draw = await this.getOneDraw(drawNumber);
    
    if (!draw) return [];
    
    // 간단한 등수별 정보 계산 (실제 데이터가 없으므로 추정치)
    return [
      {
        rank: 1,
        winnerCount: draw.firstPrzwnerCo.toLocaleString(),
        totalPrize: `${draw.firstAccumamnt.toLocaleString()}원`,
        prizePerWinner: `${draw.firstWinamnt.toLocaleString()}원`,
      },
      // 2-5등은 동행복권 API에서 제공하지 않음
    ];
  }

  /**
   * 여러 회차의 데이터를 한번에 가져옵니다 (배치)
   */
  async getBatchDrawResults(rounds: number[], onProgress?: (loaded: number, total: number) => void): Promise<DrawResult[]> {
    try {
      // 캐시 확인
      const results: DrawResult[] = [];
      const uncachedRounds: number[] = [];
      
      for (const round of rounds) {
        const cached = this.getFromCache(round);
        if (cached) {
          results.push(cached);
        } else {
          uncachedRounds.push(round);
        }
      }
      
      // 진행률 업데이트
      if (onProgress) {
        onProgress(results.length, rounds.length);
      }
      
      // 캐시되지 않은 데이터 가져오기
      if (uncachedRounds.length > 0) {
        if (this.isServer) {
          // 서버에서는 병렬로 직접 가져오기
          const promises = uncachedRounds.map(round => this.getDrawResult(round));
          const newResults = await Promise.all(promises);
          results.push(...newResults);
        } else {
          // 클라이언트에서는 배치 API 사용
          const response = await axios.post('/api/lottery/draws/batch', {
            rounds: uncachedRounds
          });
          
          if (response.data.success && response.data.data) {
            for (const drawData of response.data.data) {
              this.saveToCache(drawData.drwNo, drawData);
              results.push(drawData);
            }
          }
        }
        
        // 최종 진행률 업데이트
        if (onProgress) {
          onProgress(rounds.length, rounds.length);
        }
      }
      
      // 요청한 순서대로 정렬
      const resultMap = new Map(results.map(r => [r.drwNo, r]));
      return rounds.map(round => resultMap.get(round)!).filter(Boolean);
    } catch (error) {
      console.error('Failed to fetch batch draw results:', error);
      throw new Error('배치 데이터를 가져오는데 실패했습니다.');
    }
  }
  
  /**
   * 범위로 여러 회차 데이터 가져오기
   */
  async getRangeDrawResults(startRound: number, endRound: number, onProgress?: (loaded: number, total: number) => void): Promise<DrawResult[]> {
    const rounds: number[] = [];
    for (let i = startRound; i <= endRound; i++) {
      rounds.push(i);
    }
    return this.getBatchDrawResults(rounds, onProgress);
  }

  /**
   * URL 생성 헬퍼
   */
  private getLotteryUrl(drawNumber: number): string {
    if (this.isServer) {
      // 서버 사이드에서는 직접 동행복권 API 호출
      return `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drawNumber}`;
    }
    
    // 클라이언트 사이드에서는 API 라우트 사용
    return `/api/lottery/draw/${drawNumber}`;
  }

  /**
   * DrawResult를 LottoDraw 형식으로 변환
   */
  private convertToLottoDraw(data: DrawResult): LottoDraw {
    return {
      id: data.drwNo,
      drwNo: data.drwNo,
      drawNumber: data.drwNo,
      drwtNo1: data.drwtNo1,
      drwtNo2: data.drwtNo2,
      drwtNo3: data.drwtNo3,
      drwtNo4: data.drwtNo4,
      drwtNo5: data.drwtNo5,
      drwtNo6: data.drwtNo6,
      bnusNo: data.bnusNo,
      bonusNumber: data.bnusNo,
      totSellamnt: data.totSellamnt,
      firstAccumamnt: data.firstAccumamnt,
      firstPrzwnerCo: data.firstPrzwnerCo,
      firstWinamnt: data.firstWinamnt,
      drwNoDate: data.drwNoDate,
      date: data.drwNoDate,
      winningNumbers: [
        data.drwtNo1,
        data.drwtNo2,
        data.drwtNo3,
        data.drwtNo4,
        data.drwtNo5,
        data.drwtNo6
      ],
      prizeStatistics: {
        firstPrizeWinnerCount: data.firstPrzwnerCo,
        firstWinAmount: data.firstWinamnt,
        totalSalesAmount: data.totSellamnt,
        firstAccumulatedAmount: data.firstAccumamnt
      }
    };
  }

  /**
   * 캐시 통계 정보를 가져옵니다
   */
  getCacheStats() {
    const validEntries = Array.from(this.cache.entries())
      .filter(([_, entry]) => Date.now() - entry.timestamp < this.cacheTTL);
    
    return {
      size: this.cache.size,
      validEntries: validEntries.length,
      hitRate: 0, // This would need tracking actual hits/misses
    };
  }

  /**
   * 캐시를 비웁니다
   */
  clearCache() {
    this.cache.clear();
  }
}