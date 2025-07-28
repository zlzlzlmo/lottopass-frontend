import { useQuery } from '@tanstack/react-query';
import { storeService } from '../services/storeService';
import { QUERY_KEYS } from '@lottopass/shared';
import type { StoreSearchParams } from '@lottopass/shared';

export function useStores(params: StoreSearchParams) {
  return useQuery({
    queryKey: [QUERY_KEYS.STORES, params],
    queryFn: () => storeService.searchStores(params),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useStoreById(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.STORES, id],
    queryFn: () => storeService.getStoreById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useWinningStores(params?: {
  drawNumber?: number;
  rank?: number;
  sido?: string;
  sigungu?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: [QUERY_KEYS.WINNING_STORES, params],
    queryFn: () => storeService.getWinningStores(params),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useStoreWinningHistory(storeId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.STORES, storeId, 'history'],
    queryFn: () => storeService.getStoreWinningHistory(storeId),
    enabled: !!storeId,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useNearbyStores(params: {
  latitude: number;
  longitude: number;
  radius?: number;
  onlyWinners?: boolean;
}) {
  return useQuery({
    queryKey: [QUERY_KEYS.STORES, 'nearby', params],
    queryFn: () => storeService.getNearbyStores(params),
    enabled: !!params.latitude && !!params.longitude,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useRegions() {
  return useQuery({
    queryKey: ['regions'],
    queryFn: storeService.getRegions,
    staleTime: Infinity, // Never changes
  });
}

export function useTopWinningStores(params?: {
  period?: 'all' | 'year' | 'month';
  limit?: number;
}) {
  return useQuery({
    queryKey: ['topWinningStores', params],
    queryFn: () => storeService.getTopWinningStores(params),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}