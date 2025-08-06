import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lotteryApi } from './client';
import type { 
  LottoDraw
} from '@lottopass/shared';

// Temporary types until shared package is refactored
export interface WinningStore {
  round: number;
  rank: number;
  storeName: string;
  address: string;
  method: '자동' | '수동' | '반자동';
  region: string;
  district: string;
}

export interface StoreSearchParams {
  region?: string;
  district?: string;
  round?: number;
  rank?: number;
}

// Query Keys
export const lotteryKeys = {
  all: ['lottery'] as const,
  draws: () => [...lotteryKeys.all, 'draws'] as const,
  draw: (round: number) => [...lotteryKeys.draws(), round] as const,
  latest: () => [...lotteryKeys.draws(), 'latest'] as const,
  statistics: (recentCount?: number) => [...lotteryKeys.all, 'statistics', recentCount] as const,
  stores: (params?: StoreSearchParams) => [...lotteryKeys.all, 'stores', params] as const,
  regions: () => [...lotteryKeys.all, 'regions'] as const,
};

/**
 * 최신 회차 조회 Hook
 */
export function useLatestDraw() {
  return useQuery({
    queryKey: lotteryKeys.latest(),
    queryFn: () => lotteryApi.getLatestDraw(),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분
  });
}

/**
 * 특정 회차 조회 Hook
 */
export function useDrawByRound(round: number, enabled = true) {
  return useQuery({
    queryKey: lotteryKeys.draw(round),
    queryFn: () => lotteryApi.getDrawByRound(round),
    enabled: enabled && round > 0,
    staleTime: Infinity, // 과거 데이터는 변경되지 않음
    gcTime: 1000 * 60 * 60 * 24, // 24시간
  });
}

/**
 * 여러 회차 조회 Hook
 */
export function useMultipleDraws(rounds: number[]) {
  return useQuery({
    queryKey: [...lotteryKeys.draws(), 'multiple', rounds],
    queryFn: () => lotteryApi.getMultipleDraws(rounds),
    enabled: rounds.length > 0,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
  });
}

/**
 * 번호별 통계 조회 Hook
 */
export function useNumberStatistics(recentCount = 100) {
  return useQuery({
    queryKey: lotteryKeys.statistics(recentCount),
    queryFn: () => lotteryApi.getStatistics(recentCount),
    staleTime: 1000 * 60 * 60, // 1시간
    gcTime: 1000 * 60 * 60 * 6, // 6시간
  });
}

/**
 * 당첨 판매점 조회 Hook
 */
export function useWinningStores(params?: StoreSearchParams) {
  return useQuery({
    queryKey: lotteryKeys.stores(params),
    queryFn: () => lotteryApi.getWinningStores(params),
    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 60 * 2, // 2시간
  });
}

/**
 * 지역 목록 조회 Hook
 */
export function useRegions() {
  return useQuery({
    queryKey: lotteryKeys.regions(),
    queryFn: () => lotteryApi.getRegions(),
    staleTime: Infinity, // 지역 정보는 거의 변경되지 않음
    gcTime: Infinity,
  });
}

/**
 * 번호 조합 당첨 이력 확인 Hook
 */
export function useCheckWinningHistory(numbers: number[], enabled = false) {
  return useQuery({
    queryKey: [...lotteryKeys.all, 'winningHistory', numbers],
    queryFn: () => lotteryApi.checkWinningHistory(numbers),
    enabled: enabled && numbers.length === 6,
    staleTime: 1000 * 60 * 60, // 1시간
    gcTime: 1000 * 60 * 60 * 24, // 24시간
  });
}

/**
 * 최신 데이터 프리페치 Hook
 */
export function usePrefetchLatestData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // 최신 회차 프리페치
      await queryClient.prefetchQuery({
        queryKey: lotteryKeys.latest(),
        queryFn: () => lotteryApi.getLatestDraw(),
      });
      
      // 통계 프리페치
      await queryClient.prefetchQuery({
        queryKey: lotteryKeys.statistics(),
        queryFn: () => lotteryApi.getStatistics(),
      });
      
      // 당첨 판매점 프리페치
      await queryClient.prefetchQuery({
        queryKey: lotteryKeys.stores(),
        queryFn: () => lotteryApi.getWinningStores(),
      });
    },
  });
}

// 유틸리티 함수들

/**
 * 당첨 등수 계산
 */
export function calculateWinningRank(
  userNumbers: number[],
  draw: LottoDraw
): number | null {
  // Extract draw numbers from LottoDraw type
  const drawNumbers = [
    draw.drwtNo1,
    draw.drwtNo2,
    draw.drwtNo3,
    draw.drwtNo4,
    draw.drwtNo5,
    draw.drwtNo6
  ];
  
  const matchCount = userNumbers.filter(num => 
    drawNumbers.includes(num)
  ).length;
  
  const bonusMatch = userNumbers.includes(draw.bnusNo);
  
  if (matchCount === 6) return 1;
  if (matchCount === 5 && bonusMatch) return 2;
  if (matchCount === 5) return 3;
  if (matchCount === 4) return 4;
  if (matchCount === 3) return 5;
  
  return null;
}

/**
 * 예상 당첨금 계산 (평균 기준)
 */
export function estimateWinningAmount(rank: number): string {
  const averageAmounts: Record<number, number> = {
    1: 2_000_000_000, // 20억
    2: 50_000_000, // 5천만원
    3: 1_500_000, // 150만원
    4: 50_000, // 5만원
    5: 5_000, // 5천원
  };
  
  const amount = averageAmounts[rank] || 0;
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}