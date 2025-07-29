import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { RepositoryManager } from '@lottopass/core';

interface SavedNumbers {
  id: string;
  numbers: number[];
  createdAt: string;
  nickname?: string;
}

interface UserPreferences {
  favoriteNumbers: number[];
  excludeNumbers: number[];
  defaultGenerationMethod: 'random' | 'statistical' | 'custom';
  notificationsEnabled: boolean;
}

interface UserState {
  // State
  savedNumbers: SavedNumbers[];
  preferences: UserPreferences;
  statistics: {
    totalPlays: number;
    totalWins: number;
    winRate: number;
    favoriteNumbers: number[];
  };
  isLoading: boolean;

  // Actions
  saveNumbers: (numbers: number[], nickname?: string) => Promise<void>;
  removeNumbers: (id: string) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  loadUserData: (userId: string) => Promise<void>;
  toggleFavoriteNumber: (number: number) => void;
  toggleExcludeNumber: (number: number) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        savedNumbers: [],
        preferences: {
          favoriteNumbers: [],
          excludeNumbers: [],
          defaultGenerationMethod: 'random',
          notificationsEnabled: true,
        },
        statistics: {
          totalPlays: 0,
          totalWins: 0,
          winRate: 0,
          favoriteNumbers: [],
        },
        isLoading: false,

        // Actions
        saveNumbers: async (numbers: number[], nickname?: string) => {
          const newNumbers: SavedNumbers = {
            id: `numbers-${Date.now()}`,
            numbers: numbers.sort((a, b) => a - b),
            createdAt: new Date().toISOString(),
            nickname,
          };

          set(state => ({
            savedNumbers: [...state.savedNumbers, newNumbers],
          }));

          // Save to backend if user is authenticated
          try {
            const userRepo = RepositoryManager.getInstance().getUserRepository();
            // Assuming we have a way to get current user ID
            const userId = 'current-user-id'; // TODO: Get from auth store
            await userRepo.saveUserNumbers(userId, numbers);
          } catch (error) {
            console.error('Failed to save numbers to backend:', error);
          }
        },

        removeNumbers: async (id: string) => {
          set(state => ({
            savedNumbers: state.savedNumbers.filter(n => n.id !== id),
          }));

          // Remove from backend if user is authenticated
          try {
            const userRepo = RepositoryManager.getInstance().getUserRepository();
            const userId = 'current-user-id'; // TODO: Get from auth store
            await userRepo.deleteUserNumbers(userId, id);
          } catch (error) {
            console.error('Failed to remove numbers from backend:', error);
          }
        },

        updatePreferences: (preferences: Partial<UserPreferences>) => {
          set(state => ({
            preferences: {
              ...state.preferences,
              ...preferences,
            },
          }));
        },

        loadUserData: async (userId: string) => {
          set({ isLoading: true });
          
          try {
            const userRepo = RepositoryManager.getInstance().getUserRepository();
            
            // Load saved numbers
            const numbers = await userRepo.getUserNumbers(userId);
            const savedNumbers: SavedNumbers[] = numbers.map((nums, index) => ({
              id: `numbers-${index}`,
              numbers: nums,
              createdAt: new Date().toISOString(), // TODO: Store actual creation date
            }));

            // Load statistics
            const stats = await userRepo.getUserStatistics(userId);

            set({
              savedNumbers,
              statistics: {
                totalPlays: stats.totalPlays,
                totalWins: stats.totalWins,
                winRate: stats.winRate,
                favoriteNumbers: stats.favoriteNumbers,
              },
              isLoading: false,
            });
          } catch (error) {
            console.error('Failed to load user data:', error);
            set({ isLoading: false });
          }
        },

        toggleFavoriteNumber: (number: number) => {
          set(state => {
            const favoriteNumbers = state.preferences.favoriteNumbers.includes(number)
              ? state.preferences.favoriteNumbers.filter(n => n !== number)
              : [...state.preferences.favoriteNumbers, number].slice(0, 10); // Max 10 favorites

            return {
              preferences: {
                ...state.preferences,
                favoriteNumbers,
              },
            };
          });
        },

        toggleExcludeNumber: (number: number) => {
          set(state => {
            const excludeNumbers = state.preferences.excludeNumbers.includes(number)
              ? state.preferences.excludeNumbers.filter(n => n !== number)
              : [...state.preferences.excludeNumbers, number];

            return {
              preferences: {
                ...state.preferences,
                excludeNumbers,
              },
            };
          });
        },
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({
          savedNumbers: state.savedNumbers,
          preferences: state.preferences,
        }),
      }
    ),
    {
      name: 'UserStore',
    }
  )
);