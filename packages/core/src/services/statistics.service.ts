import { DrawResult } from './draw.service';

export interface NumberFrequency {
  number: number;
  frequency: number;
  percentage: number;
  lastAppearance?: number;
}

export interface StatisticsResult {
  totalDraws: number;
  numberFrequencies: NumberFrequency[];
  mostFrequent: number[];
  leastFrequent: number[];
  averageFrequency: number;
  hotNumbers: number[]; // 최근 자주 나온 번호
  coldNumbers: number[]; // 최근 안 나온 번호
}

export class StatisticsService {
  private static instance: StatisticsService;

  private constructor() {}

  static getInstance(): StatisticsService {
    if (!StatisticsService.instance) {
      StatisticsService.instance = new StatisticsService();
    }
    return StatisticsService.instance;
  }

  /**
   * 로또 번호 통계를 계산합니다
   */
  calculateStatistics(draws: DrawResult[]): StatisticsResult {
    const frequencyMap = new Map<number, { count: number; lastRound: number }>();

    // Initialize frequency map
    for (let i = 1; i <= 45; i++) {
      frequencyMap.set(i, { count: 0, lastRound: 0 });
    }

    // Count frequencies
    draws.forEach((draw) => {
      const numbers = [
        draw.drwtNo1,
        draw.drwtNo2,
        draw.drwtNo3,
        draw.drwtNo4,
        draw.drwtNo5,
        draw.drwtNo6,
      ];

      numbers.forEach((num) => {
        const current = frequencyMap.get(num)!;
        frequencyMap.set(num, {
          count: current.count + 1,
          lastRound: Math.max(current.lastRound, draw.drwNo),
        });
      });
    });

    // Convert to array and calculate percentages
    const numberFrequencies: NumberFrequency[] = Array.from(frequencyMap.entries())
      .map(([number, { count, lastRound }]) => ({
        number,
        frequency: count,
        percentage: (count / draws.length) * 100,
        lastAppearance: lastRound || undefined,
      }))
      .sort((a, b) => b.frequency - a.frequency);

    // Calculate statistics
    const frequencies = numberFrequencies.map(nf => nf.frequency);
    const averageFrequency = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;

    // Get most and least frequent
    const mostFrequent = numberFrequencies
      .slice(0, 7)
      .map(nf => nf.number);

    const leastFrequent = numberFrequencies
      .slice(-7)
      .map(nf => nf.number);

    // Calculate hot and cold numbers (based on recent appearance)
    const recentDraws = draws.slice(0, 10); // Last 10 draws
    const recentNumbers = new Set<number>();
    
    recentDraws.forEach(draw => {
      [draw.drwtNo1, draw.drwtNo2, draw.drwtNo3, draw.drwtNo4, draw.drwtNo5, draw.drwtNo6]
        .forEach(num => recentNumbers.add(num));
    });

    const hotNumbers = Array.from(recentNumbers).slice(0, 7);
    const coldNumbers = numberFrequencies
      .filter(nf => !recentNumbers.has(nf.number))
      .slice(0, 7)
      .map(nf => nf.number);

    return {
      totalDraws: draws.length,
      numberFrequencies,
      mostFrequent,
      leastFrequent,
      averageFrequency,
      hotNumbers,
      coldNumbers,
    };
  }

  /**
   * 번호 조합의 당첨 확률을 계산합니다
   */
  calculateCombinationProbability(numbers: number[], draws: DrawResult[]): number {
    let matchCount = 0;

    draws.forEach(draw => {
      const drawNumbers = [
        draw.drwtNo1,
        draw.drwtNo2,
        draw.drwtNo3,
        draw.drwtNo4,
        draw.drwtNo5,
        draw.drwtNo6,
      ];

      const matches = numbers.filter(num => drawNumbers.includes(num)).length;
      if (matches >= 3) {
        matchCount++;
      }
    });

    return (matchCount / draws.length) * 100;
  }

  /**
   * 연속 번호 패턴을 분석합니다
   */
  analyzeConsecutivePatterns(draws: DrawResult[]): {
    noConsecutive: number;
    oneConsecutive: number;
    twoOrMoreConsecutive: number;
  } {
    const patterns = {
      noConsecutive: 0,
      oneConsecutive: 0,
      twoOrMoreConsecutive: 0,
    };

    draws.forEach(draw => {
      const numbers = [
        draw.drwtNo1,
        draw.drwtNo2,
        draw.drwtNo3,
        draw.drwtNo4,
        draw.drwtNo5,
        draw.drwtNo6,
      ].sort((a, b) => a - b);

      let consecutiveCount = 0;
      for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] - numbers[i - 1] === 1) {
          consecutiveCount++;
        }
      }

      if (consecutiveCount === 0) {
        patterns.noConsecutive++;
      } else if (consecutiveCount === 1) {
        patterns.oneConsecutive++;
      } else {
        patterns.twoOrMoreConsecutive++;
      }
    });

    return patterns;
  }
}