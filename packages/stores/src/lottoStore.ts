import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  LottoDraw, 
  GeneratedNumbers, 
  SavedCombination,
  DrawStatistics 
} from '@lottopass/shared';

interface LottoState {
  latestDraw: LottoDraw | null;
  allDraws: LottoDraw[];
  generatedHistory: GeneratedNumbers[];
  savedCombinations: SavedCombination[];
  statistics: DrawStatistics | null;
  isLoading: boolean;
  error: string | null;
}

interface LottoActions {
  setLatestDraw: (draw: LottoDraw) => void;
  setAllDraws: (draws: LottoDraw[]) => void;
  addGeneratedNumbers: (numbers: GeneratedNumbers) => void;
  removeGeneratedNumbers: (id: string) => void;
  clearGeneratedHistory: () => void;
  addSavedCombination: (combination: SavedCombination) => void;
  removeSavedCombination: (id: string) => void;
  updateSavedCombination: (id: string, updates: Partial<SavedCombination>) => void;
  setStatistics: (stats: DrawStatistics) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export type LottoStore = LottoState & LottoActions;

export const useLottoStore = create<LottoStore>()(
  devtools(
    persist(
      immer((set) => ({
        // State
        latestDraw: null,
        allDraws: [],
        generatedHistory: [],
        savedCombinations: [],
        statistics: null,
        isLoading: false,
        error: null,

        // Actions
        setLatestDraw: (draw) =>
          set((state) => {
            state.latestDraw = draw;
          }),

        setAllDraws: (draws) =>
          set((state) => {
            state.allDraws = draws;
            if (draws.length > 0) {
              state.latestDraw = draws[0];
            }
          }),

        addGeneratedNumbers: (numbers) =>
          set((state) => {
            state.generatedHistory.unshift(numbers);
            // 최대 50개까지만 보관
            if (state.generatedHistory.length > 50) {
              state.generatedHistory = state.generatedHistory.slice(0, 50);
            }
          }),

        removeGeneratedNumbers: (id) =>
          set((state) => {
            state.generatedHistory = state.generatedHistory.filter(
              (item) => item.id !== id
            );
          }),

        clearGeneratedHistory: () =>
          set((state) => {
            state.generatedHistory = [];
          }),

        addSavedCombination: (combination) =>
          set((state) => {
            state.savedCombinations.push(combination);
          }),

        removeSavedCombination: (id) =>
          set((state) => {
            state.savedCombinations = state.savedCombinations.filter(
              (item) => item.id !== id
            );
          }),

        updateSavedCombination: (id, updates) =>
          set((state) => {
            const index = state.savedCombinations.findIndex(
              (item) => item.id === id
            );
            if (index !== -1) {
              Object.assign(state.savedCombinations[index], updates);
            }
          }),

        setStatistics: (stats) =>
          set((state) => {
            state.statistics = stats;
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),
      })),
      {
        name: 'lotto-storage',
        partialize: (state) => ({
          generatedHistory: state.generatedHistory,
          savedCombinations: state.savedCombinations,
        }),
      }
    ),
    {
      name: 'lotto-store',
    }
  )
);