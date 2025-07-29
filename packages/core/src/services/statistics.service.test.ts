import { describe, it, expect, beforeEach } from 'vitest';
import { StatisticsService } from './statistics.service';
import { DrawResult } from './draw.service';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let mockDraws: DrawResult[];

  beforeEach(() => {
    service = StatisticsService.getInstance();
    mockDraws = [
      {
        drwNo: 1,
        drwNoDate: '2024-01-01',
        totSellamnt: 1000000,
        firstWinamnt: 500000,
        firstPrzwnerCo: 2,
        firstAccumamnt: 1000000,
        drwtNo1: 1,
        drwtNo2: 2,
        drwtNo3: 3,
        drwtNo4: 4,
        drwtNo5: 5,
        drwtNo6: 6,
        bnusNo: 7,
        returnValue: 'success',
      },
      {
        drwNo: 2,
        drwNoDate: '2024-01-08',
        totSellamnt: 1200000,
        firstWinamnt: 600000,
        firstPrzwnerCo: 1,
        firstAccumamnt: 600000,
        drwtNo1: 1,
        drwtNo2: 8,
        drwtNo3: 15,
        drwtNo4: 22,
        drwtNo5: 29,
        drwtNo6: 36,
        bnusNo: 43,
        returnValue: 'success',
      },
    ];
  });

  describe('calculateStatistics', () => {
    it('should calculate correct number frequencies', () => {
      const result = service.calculateStatistics(mockDraws);

      expect(result.totalDraws).toBe(2);
      expect(result.numberFrequencies).toHaveLength(45);

      // Number 1 appeared in both draws
      const number1 = result.numberFrequencies.find(nf => nf.number === 1);
      expect(number1?.frequency).toBe(2);
      expect(number1?.percentage).toBe(100);

      // Number 10 never appeared
      const number10 = result.numberFrequencies.find(nf => nf.number === 10);
      expect(number10?.frequency).toBe(0);
      expect(number10?.percentage).toBe(0);
    });

    it('should identify most and least frequent numbers', () => {
      const result = service.calculateStatistics(mockDraws);

      expect(result.mostFrequent).toContain(1); // Appeared twice
      expect(result.leastFrequent).toHaveLength(7);
    });

    it('should calculate hot and cold numbers', () => {
      const result = service.calculateStatistics(mockDraws);

      // Hot numbers should be from recent draws
      expect(result.hotNumbers).toBeDefined();
      expect(result.hotNumbers.length).toBeGreaterThan(0);

      // Cold numbers should be numbers that haven't appeared recently
      expect(result.coldNumbers).toBeDefined();
      expect(result.coldNumbers.length).toBeGreaterThan(0);
    });
  });

  describe('calculateCombinationProbability', () => {
    it('should calculate probability for matching numbers', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const probability = service.calculateCombinationProbability(numbers, mockDraws);

      // First draw has all 6 numbers matching (3+ match)
      // Second draw has only 1 number matching (less than 3)
      expect(probability).toBe(50); // 1 out of 2 draws
    });

    it('should return 0 for no matches', () => {
      const numbers = [40, 41, 42, 43, 44, 45];
      const probability = service.calculateCombinationProbability(numbers, mockDraws);

      expect(probability).toBe(0);
    });
  });

  describe('analyzeConsecutivePatterns', () => {
    it('should analyze consecutive number patterns', () => {
      const patterns = service.analyzeConsecutivePatterns(mockDraws);

      expect(patterns.noConsecutive).toBe(1); // Second draw has no consecutive
      expect(patterns.oneConsecutive).toBe(0);
      expect(patterns.twoOrMoreConsecutive).toBe(1); // First draw has 1-2-3-4-5-6
    });
  });
});