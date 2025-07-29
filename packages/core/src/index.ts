// Services
export { DrawService } from './services/draw.service';
export type { DrawResult } from './services/draw.service';

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