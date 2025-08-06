// Services
export { DrawService } from './services/draw.service';
export type { DrawResult, LottoDraw, DetailDraw } from './services/draw.service';

export { StatisticsService } from './services/statistics.service';
export type { NumberFrequency, StatisticsResult } from './services/statistics.service';

// Repositories
export {
  RepositoryManager,
  getRepository,
  type LotteryRepository,
  type UserRepository,
  type StoreRepository,
  type UserStats,
  type Store,
} from './repositories';

// Hooks
export {
  useDrawResult,
  useLatestDrawResult,
  useMultipleDrawResults,
  useDrawResultsInRange,
  usePrefetchDrawResult,
  drawKeys,
} from './hooks/useDraws';

export {
  useStatistics,
  useCombinationProbability,
  useConsecutivePatterns,
} from './hooks/useStatistics';

// Utils
export const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const generateLottoNumbers = (count: number = 6): number[] => {
  const numbers: number[] = [];
  while (numbers.length < count) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers.sort((a, b) => a - b);
};

export const validateLottoNumbers = (numbers: number[]): boolean => {
  if (numbers.length !== 6) return false;
  const uniqueNumbers = new Set(numbers);
  if (uniqueNumbers.size !== 6) return false;
  return numbers.every(num => num >= 1 && num <= 45);
};

// Constants
export const LOTTO_CONSTANTS = {
  MIN_NUMBER: 1,
  MAX_NUMBER: 45,
  NUMBERS_PER_DRAW: 6,
  BONUS_NUMBER_COUNT: 1,
  FIRST_DRAW_DATE: new Date(2002, 11, 7), // 2002년 12월 7일
} as const;