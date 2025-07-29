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
    // Get the latest draw to determine the range
    const latestDraw = await this.getLatestDraw();
    const startRound = Math.max(1, latestDraw.drwNo - offset - limit + 1);
    const endRound = latestDraw.drwNo - offset;
    
    // Generate array of round numbers
    const rounds = Array.from(
      { length: Math.min(limit, endRound - startRound + 1) },
      (_, i) => endRound - i
    ).filter(round => round >= 1);
    
    const results = await this.drawService.getMultipleDrawResults(rounds);
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
    // Convert dates to round numbers
    // Lottery draws happen every Saturday
    const firstDrawDate = new Date('2002-12-07'); // First lottery draw in Korea
    const weeksFromFirst = (date: Date) => {
      const diff = date.getTime() - firstDrawDate.getTime();
      return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
    };
    
    const startRound = Math.max(1, weeksFromFirst(startDate));
    const endRound = weeksFromFirst(endDate);
    
    const results = await this.drawService.getDrawResultsInRange(startRound, endRound);
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