import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { lottoService } from '../services/lottoService';
import { QUERY_KEYS } from '@lottopass/shared';
import type { 
  GenerateNumbersInput, 
  SaveCombinationInput,
  LottoDraw,
  DrawStatistics,
  SavedCombination
} from '@lottopass/shared';

export function useLatestDraw() {
  return useQuery({
    queryKey: [QUERY_KEYS.LATEST_DRAW],
    queryFn: lottoService.getLatestDraw,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useAllDraws(params?: {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: [QUERY_KEYS.ALL_DRAWS, params],
    queryFn: () => lottoService.getAllDraws(params),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useDrawByNumber(drawNumber: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.DRAW_DETAIL, drawNumber],
    queryFn: () => lottoService.getDrawByNumber(drawNumber),
    enabled: !!drawNumber,
    staleTime: Infinity, // Never stale (historical data)
  });
}

export function useGenerateNumbers() {
  return useMutation({
    mutationFn: (input: GenerateNumbersInput) => lottoService.generateNumbers(input),
  });
}

export function useStatistics(params?: { startDraw?: number; endDraw?: number }) {
  return useQuery({
    queryKey: [QUERY_KEYS.STATISTICS, params],
    queryFn: () => lottoService.getStatistics(params),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useSavedCombinations() {
  return useQuery({
    queryKey: [QUERY_KEYS.SAVED_COMBINATIONS],
    queryFn: lottoService.getSavedCombinations,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSaveCombination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveCombinationInput) => lottoService.saveCombination(input),
    onSuccess: (newCombination) => {
      queryClient.setQueryData<SavedCombination[]>(
        [QUERY_KEYS.SAVED_COMBINATIONS],
        (old) => [...(old || []), newCombination]
      );
    },
  });
}

export function useUpdateCombination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<SaveCombinationInput> }) =>
      lottoService.updateCombination(id, updates),
    onSuccess: (updatedCombination) => {
      queryClient.setQueryData<SavedCombination[]>(
        [QUERY_KEYS.SAVED_COMBINATIONS],
        (old) =>
          old?.map((combo) =>
            combo.id === updatedCombination.id ? updatedCombination : combo
          ) || []
      );
    },
  });
}

export function useDeleteCombination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lottoService.deleteCombination(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<SavedCombination[]>(
        [QUERY_KEYS.SAVED_COMBINATIONS],
        (old) => old?.filter((combo) => combo.id !== deletedId) || []
      );
    },
  });
}

export function useCheckCombinationResult(combinationId: string, drawNumber: number) {
  return useQuery({
    queryKey: ['combinationResult', combinationId, drawNumber],
    queryFn: () => lottoService.checkCombinationResult(combinationId, drawNumber),
    enabled: !!combinationId && !!drawNumber,
  });
}

export function useSimulateDraw() {
  return useMutation({
    mutationFn: ({ numbers, iterations }: { numbers: number[]; iterations?: number }) =>
      lottoService.simulateDraw(numbers, iterations),
  });
}