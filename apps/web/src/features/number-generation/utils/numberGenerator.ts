import { GenerationMethod } from '@lottopass/shared';
import { GenerationConfig, GeneratorResult } from '../types';

const LOTTO_MIN = 1;
const LOTTO_MAX = 45;
const LOTTO_COUNT = 6;

export class NumberGeneratorService {
  static generate(config: GenerationConfig): GeneratorResult {
    let numbers: number[];

    switch (config.method) {
      case 'random':
        numbers = this.generateRandom(config);
        break;
      case 'statistical':
        numbers = this.generateStatistical(config);
        break;
      case 'evenOdd':
        numbers = this.generateEvenOdd(config);
        break;
      case 'highLow':
        numbers = this.generateHighLow(config);
        break;
      case 'pattern':
        numbers = this.generatePattern(config);
        break;
      case 'consecutive':
        numbers = this.generateConsecutive(config);
        break;
      default:
        numbers = this.generateRandom(config);
    }

    return {
      numbers,
      method: config.method,
      statistics: this.calculateStatistics(numbers),
    };
  }

  private static generateRandom(config: GenerationConfig): number[] {
    const availableNumbers = this.getAvailableNumbers(config);
    const selected: number[] = [];

    while (selected.length < LOTTO_COUNT) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const number = availableNumbers[randomIndex];
      
      if (!selected.includes(number)) {
        selected.push(number);
      }
    }

    return selected.sort((a, b) => a - b);
  }

  private static generateStatistical(config: GenerationConfig): number[] {
    // 통계적 빈도 기반 생성 (실제 통계 데이터 필요)
    const hotNumbers = [1, 7, 12, 17, 27, 43]; // 예시: 자주 나오는 번호
    const coldNumbers = [9, 25, 32, 41]; // 예시: 잘 안 나오는 번호
    
    const pool = [...hotNumbers.slice(0, 4), ...coldNumbers.slice(0, 2)];
    const availableNumbers = this.getAvailableNumbers(config);
    
    while (pool.length < LOTTO_COUNT) {
      const num = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
      if (!pool.includes(num)) {
        pool.push(num);
      }
    }

    return pool.slice(0, LOTTO_COUNT).sort((a, b) => a - b);
  }

  private static generateEvenOdd(config: GenerationConfig): number[] {
    const ratio = config.oddEvenRatio || { odd: 3, even: 3 };
    const availableNumbers = this.getAvailableNumbers(config);
    
    const oddNumbers = availableNumbers.filter(n => n % 2 === 1);
    const evenNumbers = availableNumbers.filter(n => n % 2 === 0);
    
    const selected: number[] = [];
    
    // 홀수 선택
    for (let i = 0; i < ratio.odd && selected.length < LOTTO_COUNT; i++) {
      const idx = Math.floor(Math.random() * oddNumbers.length);
      const num = oddNumbers.splice(idx, 1)[0];
      if (num) selected.push(num);
    }
    
    // 짝수 선택
    for (let i = 0; i < ratio.even && selected.length < LOTTO_COUNT; i++) {
      const idx = Math.floor(Math.random() * evenNumbers.length);
      const num = evenNumbers.splice(idx, 1)[0];
      if (num) selected.push(num);
    }
    
    // 부족한 수 채우기
    while (selected.length < LOTTO_COUNT) {
      const remaining = [...oddNumbers, ...evenNumbers];
      const idx = Math.floor(Math.random() * remaining.length);
      selected.push(remaining[idx]);
      remaining.splice(idx, 1);
    }

    return selected.sort((a, b) => a - b);
  }

  private static generateHighLow(config: GenerationConfig): number[] {
    const ratio = config.highLowRatio || { high: 3, low: 3 };
    const availableNumbers = this.getAvailableNumbers(config);
    
    const lowNumbers = availableNumbers.filter(n => n <= 22);
    const highNumbers = availableNumbers.filter(n => n > 22);
    
    const selected: number[] = [];
    
    // 저구간 선택
    for (let i = 0; i < ratio.low && selected.length < LOTTO_COUNT; i++) {
      const idx = Math.floor(Math.random() * lowNumbers.length);
      const num = lowNumbers.splice(idx, 1)[0];
      if (num) selected.push(num);
    }
    
    // 고구간 선택
    for (let i = 0; i < ratio.high && selected.length < LOTTO_COUNT; i++) {
      const idx = Math.floor(Math.random() * highNumbers.length);
      const num = highNumbers.splice(idx, 1)[0];
      if (num) selected.push(num);
    }
    
    // 부족한 수 채우기
    while (selected.length < LOTTO_COUNT) {
      const remaining = [...lowNumbers, ...highNumbers];
      const idx = Math.floor(Math.random() * remaining.length);
      selected.push(remaining[idx]);
      remaining.splice(idx, 1);
    }

    return selected.sort((a, b) => a - b);
  }

  private static generatePattern(config: GenerationConfig): number[] {
    // 패턴 기반 생성 (예: 대각선, 가로/세로 등)
    const patterns = [
      [1, 8, 15, 22, 29, 36], // 대각선 패턴
      [5, 10, 15, 20, 25, 30], // 5의 배수
      [3, 7, 13, 19, 31, 37], // 소수 기반
    ];
    
    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    const availableNumbers = this.getAvailableNumbers(config);
    
    // 패턴에서 사용 가능한 번호만 필터링
    const validPatternNumbers = selectedPattern.filter(n => 
      availableNumbers.includes(n)
    );
    
    // 부족한 수 랜덤하게 채우기
    const selected = [...validPatternNumbers];
    while (selected.length < LOTTO_COUNT) {
      const remaining = availableNumbers.filter(n => !selected.includes(n));
      const idx = Math.floor(Math.random() * remaining.length);
      selected.push(remaining[idx]);
    }

    return selected.slice(0, LOTTO_COUNT).sort((a, b) => a - b);
  }

  private static generateConsecutive(config: GenerationConfig): number[] {
    const limit = config.consecutiveLimit || 2;
    const availableNumbers = this.getAvailableNumbers(config);
    const selected: number[] = [];
    
    // 연속 번호 쌍 생성
    const consecutiveStart = Math.floor(Math.random() * (LOTTO_MAX - limit));
    for (let i = 0; i < limit && selected.length < LOTTO_COUNT; i++) {
      const num = consecutiveStart + i;
      if (availableNumbers.includes(num)) {
        selected.push(num);
      }
    }
    
    // 나머지 번호 랜덤 선택
    while (selected.length < LOTTO_COUNT) {
      const remaining = availableNumbers.filter(n => 
        !selected.includes(n) && 
        !selected.some(s => Math.abs(s - n) === 1) // 추가 연속 방지
      );
      const idx = Math.floor(Math.random() * remaining.length);
      selected.push(remaining[idx]);
    }

    return selected.sort((a, b) => a - b);
  }

  private static getAvailableNumbers(config: GenerationConfig): number[] {
    const all = Array.from({ length: LOTTO_MAX }, (_, i) => i + 1);
    const excluded = config.excludeNumbers || [];
    const included = config.includeNumbers || [];
    
    return all.filter(n => 
      !excluded.includes(n) || included.includes(n)
    );
  }

  private static calculateStatistics(numbers: number[]): GeneratorResult['statistics'] {
    const sum = numbers.reduce((a, b) => a + b, 0);
    const oddCount = numbers.filter(n => n % 2 === 1).length;
    const evenCount = numbers.length - oddCount;
    const highCount = numbers.filter(n => n > 22).length;
    const lowCount = numbers.length - highCount;
    
    let consecutivePairs = 0;
    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i + 1] - numbers[i] === 1) {
        consecutivePairs++;
      }
    }
    
    return {
      sum,
      oddCount,
      evenCount,
      highCount,
      lowCount,
      consecutivePairs,
    };
  }
}