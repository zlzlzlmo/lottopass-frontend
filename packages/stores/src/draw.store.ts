import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DrawService, type LottoDraw } from '@lottopass/core';

interface DrawState {
  allDraws: LottoDraw[];
  currentDraw: LottoDraw | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAllDraws: () => Promise<void>;
  fetchDrawByRound: (round: number) => Promise<void>;
  fetchLatestDraw: () => Promise<void>;
  clearAllDraws: () => void;
  setError: (error: string | null) => void;
}

const drawService = DrawService.getInstance();

export const useDrawStore = create<DrawState>()(
  devtools(
    (set, get) => ({
      allDraws: [],
      currentDraw: null,
      isLoading: false,
      error: null,

      fetchAllDraws: async () => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Implement pagination or range-based fetching
          // For now, fetch recent 10 draws
          const latestDraw = await drawService.getLatestDraw();
          const startRound = Math.max(1, latestDraw.drwNo - 9);
          const rounds = Array.from({ length: 10 }, (_, i) => startRound + i);
          const draws = await Promise.all(rounds.map(round => drawService.getOneDraw(round)));
          set({ allDraws: draws, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : '추첨 데이터를 불러오는데 실패했습니다.';
          set({ error: message, isLoading: false });
        }
      },

      fetchDrawByRound: async (round: number) => {
        set({ isLoading: true, error: null });
        try {
          const draw = await drawService.getOneDraw(round);
          set({ currentDraw: draw, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : '추첨 데이터를 불러오는데 실패했습니다.';
          set({ error: message, isLoading: false });
        }
      },

      fetchLatestDraw: async () => {
        set({ isLoading: true, error: null });
        try {
          const draw = await drawService.getLatestDraw();
          set({ currentDraw: draw, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : '최신 추첨 데이터를 불러오는데 실패했습니다.';
          set({ error: message, isLoading: false });
        }
      },

      clearAllDraws: () => {
        set({ allDraws: [], currentDraw: null });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'DrawStore',
    }
  )
);