import { useQuery } from '@tanstack/react-query';
import { useDrawResultsInRange } from './useDraws';
import { StatisticsService } from '../services/statistics.service';

const statisticsService = StatisticsService.getInstance();

/**
 * 로또 번호 통계를 계산합니다
 */
export function useStatistics(roundCount: number = 100) {
  const { data: draws } = useDrawResultsInRange(1, roundCount);

  return useQuery({
    queryKey: ['statistics', roundCount],
    queryFn: () => {
      if (!draws) throw new Error('No draw data available');
      return statisticsService.calculateStatistics(draws);
    },
    enabled: !!draws && draws.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * 번호 조합의 당첨 확률을 계산합니다
 */
export function useCombinationProbability(numbers: number[], roundCount: number = 100) {
  const { data: draws } = useDrawResultsInRange(1, roundCount);

  return useQuery({
    queryKey: ['combination-probability', numbers, roundCount],
    queryFn: () => {
      if (!draws) throw new Error('No draw data available');
      return statisticsService.calculateCombinationProbability(numbers, draws);
    },
    enabled: !!draws && draws.length > 0 && numbers.length === 6,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * 연속 번호 패턴을 분석합니다
 */
export function useConsecutivePatterns(roundCount: number = 100) {
  const { data: draws } = useDrawResultsInRange(1, roundCount);

  return useQuery({
    queryKey: ['consecutive-patterns', roundCount],
    queryFn: () => {
      if (!draws) throw new Error('No draw data available');
      return statisticsService.analyzeConsecutivePatterns(draws);
    },
    enabled: !!draws && draws.length > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}