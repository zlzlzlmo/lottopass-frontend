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

export class DrawService {
  private static instance: DrawService;
  private readonly baseUrl: string;

  private constructor() {
    // @ts-ignore - import.meta.env is available in Vite environment
    this.baseUrl = typeof import.meta.env !== 'undefined' && import.meta.env?.VITE_API_BASE_URL || '';
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
    try {
      const response = await axios.get(
        `/api/draw?drwNo=${drwNo}`,
        {
          baseURL: this.baseUrl,
          timeout: 10000,
        }
      );

      // Runtime validation
      const result = DrawResultSchema.parse(response.data);
      return result;
    } catch (error) {
      console.error(`Failed to fetch draw result for round ${drwNo}:`, error);
      throw new Error(`당첨 정보를 가져오는데 실패했습니다. (회차: ${drwNo})`);
    }
  }

  /**
   * 최신 회차의 로또 당첨 정보를 가져옵니다
   */
  async getLatestDrawResult(): Promise<DrawResult> {
    try {
      const response = await axios.get(
        '/api/draw/latest',
        {
          baseURL: this.baseUrl,
          timeout: 10000,
        }
      );

      const result = DrawResultSchema.parse(response.data);
      return result;
    } catch (error) {
      console.error('Failed to fetch latest draw result:', error);
      throw new Error('최신 당첨 정보를 가져오는데 실패했습니다.');
    }
  }

  /**
   * 여러 회차의 로또 당첨 정보를 한번에 가져옵니다
   */
  async getMultipleDrawResults(drwNos: number[]): Promise<DrawResult[]> {
    try {
      const promises = drwNos.map(drwNo => this.getDrawResult(drwNo));
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error('Failed to fetch multiple draw results:', error);
      throw new Error('다중 회차 정보를 가져오는데 실패했습니다.');
    }
  }

  /**
   * 특정 기간의 모든 회차 정보를 가져옵니다
   */
  async getDrawResultsInRange(startRound: number, endRound: number): Promise<DrawResult[]> {
    const rounds = Array.from(
      { length: endRound - startRound + 1 },
      (_, i) => startRound + i
    );
    return this.getMultipleDrawResults(rounds);
  }
}