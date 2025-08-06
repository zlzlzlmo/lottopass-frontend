'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { LotteryDraw } from '@lottopass/shared';
import { 
  NumberSimulationState, 
  SimulationConfig, 
  SimulationBatch,
  SimulationResult,
  SimulationStatistics
} from '../types';
import { SimulationService } from '../services';
import { v4 as uuidv4 } from 'uuid';

interface SimulationStore extends NumberSimulationState {
  // Actions
  setConfig: (config: Partial<SimulationConfig>) => void;
  startSimulation: (rounds?: number) => Promise<void>;
  cancelSimulation: () => void;
  selectResult: (result: SimulationResult) => void;
  clearHistory: () => void;
  loadHistoricalData: (data: LotteryDraw[]) => void;
  
  // Batch operations
  runBatchSimulation: (methods: SimulationConfig['method'][], rounds: number) => Promise<void>;
  
  // Statistics
  getStatistics: () => SimulationStatistics | null;
}

const initialConfig: SimulationConfig = {
  method: 'historical',
  rounds: 100,
  useWeighting: true,
  confidenceLevel: 0.7,
  excludeNumbers: [],
  includeNumbers: []
};

export const useSimulationStore = create<SimulationStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isSimulating: false,
        history: [],
        config: initialConfig,
        historicalData: [],
        
        // Config management
        setConfig: (config) => set((state) => ({
          config: { ...state.config, ...config }
        })),
        
        // Main simulation
        startSimulation: async (rounds) => {
          const { config, historicalData, isSimulating } = get();
          
          if (isSimulating || historicalData.length === 0) {
            console.warn('Cannot start simulation: already running or no historical data');
            return;
          }
          
          const simulationRounds = rounds || config.rounds;
          const batchId = uuidv4();
          
          // Create new batch
          const newBatch: SimulationBatch = {
            id: batchId,
            config: { ...config, rounds: simulationRounds },
            results: [],
            statistics: {
              totalSimulations: 0,
              successRate: 0,
              averageMatchCount: 0,
              bestResult: null as any,
              numberFrequency: new Map(),
              patternAnalysis: {
                consecutivePairs: 0,
                evenOddRatio: { even: 0, odd: 0 },
                sumRange: { min: Infinity, max: -Infinity, average: 0 },
                highLowRatio: { high: 0, low: 0 }
              }
            },
            status: 'running',
            progress: 0,
            startedAt: new Date()
          };
          
          set({ 
            isSimulating: true, 
            currentBatch: newBatch 
          });
          
          try {
            const results: SimulationResult[] = [];
            
            // Run simulations
            for (let i = 0; i < simulationRounds; i++) {
              const result = await SimulationService.runSimulation({
                historicalData,
                config,
                round: historicalData[0]?.round + 1 // Next round prediction
              });
              
              results.push(result);
              
              // Update progress
              const progress = Math.round((i + 1) / simulationRounds * 100);
              set((state) => ({
                currentBatch: state.currentBatch ? {
                  ...state.currentBatch,
                  progress,
                  results: [...state.currentBatch.results, result]
                } : undefined
              }));
              
              // Allow UI to update
              if (i % 10 === 0) {
                await new Promise(resolve => setTimeout(resolve, 10));
              }
            }
            
            // Calculate statistics
            const statistics = calculateBatchStatistics(results, historicalData);
            
            // Complete batch
            const completedBatch: SimulationBatch = {
              ...newBatch,
              results,
              statistics,
              status: 'completed',
              progress: 100,
              completedAt: new Date()
            };
            
            set((state) => ({
              isSimulating: false,
              currentBatch: undefined,
              history: [completedBatch, ...state.history].slice(0, 10) // Keep last 10
            }));
            
          } catch (error) {
            set((state) => ({
              isSimulating: false,
              currentBatch: state.currentBatch ? {
                ...state.currentBatch,
                status: 'failed',
                error: error instanceof Error ? error.message : 'Unknown error'
              } : undefined
            }));
          }
        },
        
        // Cancel simulation
        cancelSimulation: () => {
          set({ isSimulating: false, currentBatch: undefined });
        },
        
        // Select result
        selectResult: (result) => {
          set({ selectedResult: result });
        },
        
        // Clear history
        clearHistory: () => {
          set({ history: [], selectedResult: undefined });
        },
        
        // Load historical data
        loadHistoricalData: (data) => {
          set({ historicalData: data });
        },
        
        // Batch simulation with multiple methods
        runBatchSimulation: async (methods, rounds) => {
          const { historicalData } = get();
          
          if (historicalData.length === 0) {
            console.warn('No historical data available');
            return;
          }
          
          // Run simulations for each method
          for (const method of methods) {
            await get().setConfig({ method });
            await get().startSimulation(rounds);
            
            // Wait between methods
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        },
        
        // Get statistics
        getStatistics: () => {
          const { history, currentBatch } = get();
          
          if (currentBatch?.statistics) {
            return currentBatch.statistics;
          }
          
          if (history.length > 0 && history[0].status === 'completed') {
            return history[0].statistics;
          }
          
          return null;
        }
      }),
      {
        name: 'simulation-storage',
        partialize: (state) => ({
          config: state.config,
          history: state.history.slice(0, 3) // Only persist last 3 batches
        })
      }
    )
  )
);

// Helper function to calculate batch statistics
function calculateBatchStatistics(
  results: SimulationResult[], 
  historicalData: LotteryDraw[]
): SimulationStatistics {
  const numberFrequency = new Map<number, number>();
  let totalSum = 0;
  let minSum = Infinity;
  let maxSum = -Infinity;
  let totalOdd = 0;
  let totalEven = 0;
  let totalHigh = 0;
  let totalLow = 0;
  let totalConsecutive = 0;
  let totalMatchCount = 0;
  let bestResult: SimulationResult | null = null;
  let bestConfidence = 0;
  
  results.forEach(result => {
    // Number frequency
    result.numbers.forEach(num => {
      numberFrequency.set(num, (numberFrequency.get(num) || 0) + 1);
    });
    
    // Sum analysis
    const sum = result.numbers.reduce((a, b) => a + b, 0);
    totalSum += sum;
    minSum = Math.min(minSum, sum);
    maxSum = Math.max(maxSum, sum);
    
    // Even/Odd analysis
    const oddCount = result.numbers.filter(n => n % 2 === 1).length;
    totalOdd += oddCount;
    totalEven += (6 - oddCount);
    
    // High/Low analysis
    const highCount = result.numbers.filter(n => n > 22).length;
    totalHigh += highCount;
    totalLow += (6 - highCount);
    
    // Consecutive analysis
    let consecutive = 0;
    for (let i = 0; i < result.numbers.length - 1; i++) {
      if (result.numbers[i + 1] - result.numbers[i] === 1) {
        consecutive++;
      }
    }
    totalConsecutive += consecutive;
    
    // Historical matches
    if (result.historicalMatches) {
      totalMatchCount += result.historicalMatches.length;
    }
    
    // Best result
    if (result.confidence > bestConfidence) {
      bestConfidence = result.confidence;
      bestResult = result;
    }
  });
  
  const totalNumbers = results.length * 6;
  
  return {
    totalSimulations: results.length,
    successRate: totalMatchCount / (results.length * historicalData.length),
    averageMatchCount: totalMatchCount / results.length,
    bestResult: bestResult!,
    numberFrequency,
    patternAnalysis: {
      consecutivePairs: totalConsecutive / results.length,
      evenOddRatio: { 
        even: totalEven / totalNumbers, 
        odd: totalOdd / totalNumbers 
      },
      sumRange: { 
        min: minSum, 
        max: maxSum, 
        average: totalSum / results.length 
      },
      highLowRatio: { 
        high: totalHigh / totalNumbers, 
        low: totalLow / totalNumbers 
      }
    }
  };
}