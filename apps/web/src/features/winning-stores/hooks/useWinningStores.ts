import { useQuery } from '@tanstack/react-query';
import { winningStoresService } from '../services';
import type { StoreSearchParams } from '../types';

export function useWinningStores(params: StoreSearchParams) {
  return useQuery({
    queryKey: ['winning-stores', params],
    queryFn: () => winningStoresService.searchStores(params),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

export function useLatestWinningStores() {
  return useQuery({
    queryKey: ['winning-stores', 'latest'],
    queryFn: () => winningStoresService.getLatestRoundStores(),
    staleTime: 1000 * 60 * 5, // 5분
  });
}