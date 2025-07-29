import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DrawService } from '../services/draw.service';

const drawService = DrawService.getInstance();

// Query Keys
export const drawKeys = {
  all: ['draws'] as const,
  lists: () => [...drawKeys.all, 'list'] as const,
  list: (filters: string) => [...drawKeys.lists(), { filters }] as const,
  details: () => [...drawKeys.all, 'detail'] as const,
  detail: (id: number) => [...drawKeys.details(), id] as const,
  latest: () => [...drawKeys.all, 'latest'] as const,
};

/**
 * 특정 회차의 당첨 정보를 가져옵니다
 */
export function useDrawResult(drwNo: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: drawKeys.detail(drwNo),
    queryFn: () => drawService.getDrawResult(drwNo),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * 최신 회차의 당첨 정보를 가져옵니다
 */
export function useLatestDrawResult() {
  return useQuery({
    queryKey: drawKeys.latest(),
    queryFn: () => drawService.getLatestDrawResult(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * 여러 회차의 당첨 정보를 가져옵니다
 */
export function useMultipleDrawResults(drwNos: number[]) {
  return useQuery({
    queryKey: [...drawKeys.lists(), drwNos],
    queryFn: () => drawService.getMultipleDrawResults(drwNos),
    enabled: drwNos.length > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * 특정 범위의 회차 정보를 가져옵니다
 */
export function useDrawResultsInRange(startRound: number, endRound: number) {
  return useQuery({
    queryKey: [...drawKeys.lists(), { start: startRound, end: endRound }],
    queryFn: () => drawService.getDrawResultsInRange(startRound, endRound),
    enabled: startRound > 0 && endRound >= startRound,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * 당첨 정보를 프리페치합니다
 */
export function usePrefetchDrawResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (drwNo: number) => {
      await queryClient.prefetchQuery({
        queryKey: drawKeys.detail(drwNo),
        queryFn: () => drawService.getDrawResult(drwNo),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
      });
    },
  });
}