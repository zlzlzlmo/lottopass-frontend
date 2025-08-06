export * from './services';
export * from './hooks';
export { ApiProvider } from './provider';
export { apiClient } from './client';

// Lottery API exports with prefixed names to avoid conflicts
export { lotteryApi } from './lottery/client';
export {
  lotteryKeys,
  useLatestDraw as useLotteryLatestDraw,
  useDrawByRound,
  useMultipleDraws,
  useNumberStatistics,
  useWinningStores as useLotteryWinningStores,
  useRegions as useLotteryRegions,
  useCheckWinningHistory,
  usePrefetchLatestData,
  calculateWinningRank,
  estimateWinningAmount,
} from './lottery/hooks';

// Note: Types should be imported directly from '@lottopass/shared'