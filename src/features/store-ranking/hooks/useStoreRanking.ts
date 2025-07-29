import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/redux/hooks';
import { regionService } from '@/api';
import type { StoreRanking, StoreFilters } from '../types/store.types';
import { calculateDistance } from '@/utils/distance';

export const useStoreRanking = (filters: StoreFilters) => {
  const location = useAppSelector((state) => state.location);
  
  // Fetch all winning stores data
  const { data: rawStores, isLoading, error } = useQuery({
    queryKey: ['winningStores', filters.city],
    queryFn: async () => {
      // This would normally fetch from API, but using existing service
      const response = await regionService.fetchAllRegions();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Process and rank stores
  const rankedStores = useMemo<StoreRanking[]>(() => {
    if (!rawStores) return [];

    // Transform raw data to StoreRanking format
    const stores: StoreRanking[] = rawStores
      .flatMap((region) => 
        region.stores.map((store, index) => ({
          rank: 0, // Will be set after sorting
          storeId: `${region.city}-${index}`,
          storeName: store.name,
          address: store.address,
          city: region.city,
          district: store.district || '',
          firstPrizeCount: store.firstPrizeCount || 0,
          secondPrizeCount: store.secondPrizeCount || 0,
          totalPrizeCount: (store.firstPrizeCount || 0) + (store.secondPrizeCount || 0),
          totalPrizeAmount: 0, // Would need to calculate based on prize data
          latitude: store.latitude,
          longitude: store.longitude,
          distance: location.coordinates && store.latitude && store.longitude
            ? calculateDistance(
                location.coordinates.latitude,
                location.coordinates.longitude,
                store.latitude,
                store.longitude
              )
            : undefined,
        }))
      );

    // Apply filters
    let filteredStores = stores;

    if (filters.city) {
      filteredStores = filteredStores.filter((s) => s.city === filters.city);
    }

    if (filters.district) {
      filteredStores = filteredStores.filter((s) => s.district === filters.district);
    }

    if (filters.minWins) {
      filteredStores = filteredStores.filter((s) => s.totalPrizeCount >= filters.minWins);
    }

    if (filters.maxDistance && location.coordinates) {
      filteredStores = filteredStores.filter(
        (s) => s.distance !== undefined && s.distance <= filters.maxDistance
      );
    }

    // Sort stores
    filteredStores.sort((a, b) => {
      switch (filters.sortBy) {
        case 'totalWins':
          return b.totalPrizeCount - a.totalPrizeCount;
        case 'recentWins':
          // Would need last win date data
          return b.firstPrizeCount - a.firstPrizeCount;
        case 'distance':
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        case 'rating':
          // Would need rating data
          return b.totalPrizeCount - a.totalPrizeCount;
        default:
          return 0;
      }
    });

    // Assign ranks
    return filteredStores.map((store, index) => ({
      ...store,
      rank: index + 1,
    }));
  }, [rawStores, filters, location.coordinates]);

  // Get unique cities for filter
  const availableCities = useMemo(() => {
    if (!rawStores) return [];
    return [...new Set(rawStores.map((r) => r.city))];
  }, [rawStores]);

  return {
    stores: rankedStores,
    isLoading,
    error,
    availableCities,
    totalCount: rankedStores.length,
  };
};