import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { RepositoryManager } from '@lottopass/core';

interface LotteryNumber {
  value: number;
  isBonus?: boolean;
}

interface DrawResult {
  drwNo: number;
  drwNoDate: string;
  numbers: LotteryNumber[];
  firstWinamnt: number;
  firstPrzwnerCo: number;
}

interface LotteryState {
  // State
  selectedNumbers: number[];
  generatedNumbers: number[][];
  currentDraw: DrawResult | null;
  drawHistory: DrawResult[];
  isLoading: boolean;
  error: string | null;

  // Actions
  selectNumber: (number: number) => void;
  deselectNumber: (number: number) => void;
  clearSelectedNumbers: () => void;
  generateNumbers: (count: number, method?: 'random' | 'statistical') => void;
  saveNumbers: (numbers: number[]) => void;
  removeGeneratedNumbers: (index: number) => void;
  fetchLatestDraw: () => Promise<void>;
  fetchDrawHistory: (limit: number) => Promise<void>;
}

export const useLotteryStore = create<LotteryState>()(
  devtools(
    (set, get) => ({
      // Initial state
      selectedNumbers: [],
      generatedNumbers: [],
      currentDraw: null,
      drawHistory: [],
      isLoading: false,
      error: null,

      // Number selection actions
      selectNumber: (number: number) => {
        const { selectedNumbers } = get();
        if (selectedNumbers.length < 6 && !selectedNumbers.includes(number)) {
          set({ selectedNumbers: [...selectedNumbers, number].sort((a, b) => a - b) });
        }
      },

      deselectNumber: (number: number) => {
        set(state => ({
          selectedNumbers: state.selectedNumbers.filter(n => n !== number),
        }));
      },

      clearSelectedNumbers: () => {
        set({ selectedNumbers: [] });
      },

      // Number generation
      generateNumbers: (count: number, method = 'random') => {
        const generatedSets: number[][] = [];
        
        for (let i = 0; i < count; i++) {
          const numbers: number[] = [];
          
          if (method === 'random') {
            while (numbers.length < 6) {
              const num = Math.floor(Math.random() * 45) + 1;
              if (!numbers.includes(num)) {
                numbers.push(num);
              }
            }
          } else if (method === 'statistical') {
            // TODO: Implement statistical generation based on frequency
            // For now, fallback to random
            while (numbers.length < 6) {
              const num = Math.floor(Math.random() * 45) + 1;
              if (!numbers.includes(num)) {
                numbers.push(num);
              }
            }
          }
          
          generatedSets.push(numbers.sort((a, b) => a - b));
        }
        
        set({ generatedNumbers: generatedSets });
      },

      saveNumbers: (numbers: number[]) => {
        set(state => ({
          generatedNumbers: [...state.generatedNumbers, numbers.sort((a, b) => a - b)],
        }));
      },

      removeGeneratedNumbers: (index: number) => {
        set(state => ({
          generatedNumbers: state.generatedNumbers.filter((_, i) => i !== index),
        }));
      },

      // API actions
      fetchLatestDraw: async () => {
        set({ isLoading: true, error: null });
        try {
          const repository = RepositoryManager.getInstance().getLotteryRepository();
          const result = await repository.getLatestDraw();
          
          const draw: DrawResult = {
            drwNo: result.drwNo,
            drwNoDate: result.drwNoDate,
            numbers: [
              { value: result.drwtNo1 },
              { value: result.drwtNo2 },
              { value: result.drwtNo3 },
              { value: result.drwtNo4 },
              { value: result.drwtNo5 },
              { value: result.drwtNo6 },
              { value: result.bnusNo, isBonus: true },
            ],
            firstWinamnt: result.firstWinamnt,
            firstPrzwnerCo: result.firstPrzwnerCo,
          };
          
          set({ currentDraw: draw, isLoading: false });
        } catch (error) {
          set({ error: String(error), isLoading: false });
        }
      },

      fetchDrawHistory: async (limit: number) => {
        set({ isLoading: true, error: null });
        try {
          const repository = RepositoryManager.getInstance().getLotteryRepository();
          const results = await repository.getDrawHistory(limit);
          
          const draws: DrawResult[] = results.map(result => ({
            drwNo: result.drwNo,
            drwNoDate: result.drwNoDate,
            numbers: [
              { value: result.drwtNo1 },
              { value: result.drwtNo2 },
              { value: result.drwtNo3 },
              { value: result.drwtNo4 },
              { value: result.drwtNo5 },
              { value: result.drwtNo6 },
              { value: result.bnusNo, isBonus: true },
            ],
            firstWinamnt: result.firstWinamnt,
            firstPrzwnerCo: result.firstPrzwnerCo,
          }));
          
          set({ drawHistory: draws, isLoading: false });
        } catch (error) {
          set({ error: String(error), isLoading: false });
        }
      },
    }),
    {
      name: 'LotteryStore',
    }
  )
);