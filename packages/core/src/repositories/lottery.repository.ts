import { LotteryRepository, DrawResult } from './interfaces';
import { DrawService } from '../services/draw.service';

export class HttpLotteryRepository implements LotteryRepository {
  private drawService: DrawService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheStats = { hits: 0, misses: 0 };
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.drawService = DrawService.getInstance();
  }

  async getLatestDraw(): Promise<DrawResult> {
    const cacheKey = 'latest';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      this.cacheStats.hits++;
      return cached;
    }

    this.cacheStats.misses++;
    const result = await this.drawService.getLatestDrawResult();
    this.setCache(cacheKey, result);
    return result;
  }

  async getDrawByNumber(drwNo: number): Promise<DrawResult | null> {
    const cacheKey = `draw-${drwNo}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      this.cacheStats.hits++;
      return cached;
    }

    this.cacheStats.misses++;
    try {
      const result = await this.drawService.getDrawResult(drwNo);
      this.setCache(cacheKey, result);
      return result;
    } catch {
      return null;
    }
  }

  async getDrawHistory(limit: number, offset = 0): Promise<DrawResult[]> {
    const cacheKey = `history-${limit}-${offset}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      this.cacheStats.hits++;
      return cached;
    }

    this.cacheStats.misses++;
    const results = await this.drawService.getMultipleDrawResults(limit, offset);
    this.setCache(cacheKey, results);
    return results;
  }

  async getDrawsInRange(startDate: Date, endDate: Date): Promise<DrawResult[]> {
    const cacheKey = `range-${startDate.toISOString()}-${endDate.toISOString()}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      this.cacheStats.hits++;
      return cached;
    }

    this.cacheStats.misses++;
    const results = await this.drawService.getDrawResultsInRange(startDate, endDate);
    this.setCache(cacheKey, results);
    return results;
  }

  invalidateCache(): void {
    this.cache.clear();
  }

  getCacheStatus() {
    return {
      size: this.cache.size,
      hits: this.cacheStats.hits,
      misses: this.cacheStats.misses,
    };
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}

// Mock implementation for testing
export class MockLotteryRepository implements LotteryRepository {
  private draws: DrawResult[] = [];

  constructor(initialDraws: DrawResult[] = []) {
    this.draws = initialDraws;
  }

  async getLatestDraw(): Promise<DrawResult> {
    if (this.draws.length === 0) {
      throw new Error('No draws available');
    }
    return this.draws.sort((a, b) => b.drwNo - a.drwNo)[0];
  }

  async getDrawByNumber(drwNo: number): Promise<DrawResult | null> {
    return this.draws.find(d => d.drwNo === drwNo) || null;
  }

  async getDrawHistory(limit: number, offset = 0): Promise<DrawResult[]> {
    return this.draws
      .sort((a, b) => b.drwNo - a.drwNo)
      .slice(offset, offset + limit);
  }

  async getDrawsInRange(startDate: Date, endDate: Date): Promise<DrawResult[]> {
    return this.draws.filter(d => {
      const drawDate = new Date(d.drwNoDate);
      return drawDate >= startDate && drawDate <= endDate;
    });
  }

  invalidateCache(): void {
    // No-op for mock
  }

  getCacheStatus() {
    return { size: 0, hits: 0, misses: 0 };
  }

  // Test helpers
  addDraw(draw: DrawResult): void {
    this.draws.push(draw);
  }

  clearDraws(): void {
    this.draws = [];
  }
}