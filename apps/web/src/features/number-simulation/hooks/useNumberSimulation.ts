'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DrawService } from '@lottopass/core';
import { LotteryDraw } from '@lottopass/shared';
import { useSimulationStore } from '../store';
import { SimulationConfig, SimulationResult } from '../types';

export interface UseNumberSimulationOptions {
  autoLoadHistoricalData?: boolean;
  historicalDataRange?: {
    startRound?: number;
    endRound?: number;
    limit?: number;
  };
}

export const useNumberSimulation = (options: UseNumberSimulationOptions = {}) => {
  const {
    autoLoadHistoricalData = true,
    historicalDataRange = { limit: 100 }
  } = options;
  
  const {
    isSimulating,
    currentBatch,
    history,
    selectedResult,
    config,
    historicalData,
    setConfig,
    startSimulation,
    cancelSimulation,
    selectResult,
    clearHistory,
    loadHistoricalData,
    runBatchSimulation,
    getStatistics
  } = useSimulationStore();
  
  // Fetch historical data
  const { data: fetchedHistoricalData, isLoading: isLoadingHistoricalData } = useQuery({
    queryKey: ['lottery-draws-for-simulation', historicalDataRange],
    queryFn: async () => {
      const drawService = DrawService.getInstance();
      
      if (historicalDataRange.startRound && historicalDataRange.endRound) {
        // Fetch specific range
        const draws: LotteryDraw[] = [];
        for (let round = historicalDataRange.startRound; round <= historicalDataRange.endRound; round++) {
          try {
            const draw = await drawService.getDrawResult(round);
            if (draw) draws.push(draw);
          } catch (error) {
            console.error(`Failed to fetch round ${round}:`, error);
          }
        }
        return draws;
      } else {
        // Fetch latest draws
        const latest = await drawService.getLatestDrawResult();
        if (!latest) return [];
        
        const limit = historicalDataRange.limit || 100;
        const draws: LotteryDraw[] = [latest];
        
        for (let i = 1; i < limit && latest.round - i > 0; i++) {
          try {
            const draw = await drawService.getDrawResult(latest.round - i);
            if (draw) draws.push(draw);
          } catch (error) {
            console.error(`Failed to fetch round ${latest.round - i}:`, error);
          }
        }
        
        return draws.reverse(); // Oldest to newest
      }
    },
    enabled: autoLoadHistoricalData,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  
  // Load historical data when fetched
  useEffect(() => {
    if (fetchedHistoricalData && fetchedHistoricalData.length > 0) {
      loadHistoricalData(fetchedHistoricalData);
    }
  }, [fetchedHistoricalData, loadHistoricalData]);
  
  // Simulation methods
  const runSimulation = useCallback(async (
    method?: SimulationConfig['method'], 
    rounds?: number
  ) => {
    if (method) {
      setConfig({ method });
    }
    await startSimulation(rounds);
  }, [setConfig, startSimulation]);
  
  const runMultiMethodSimulation = useCallback(async (
    methods: SimulationConfig['method'][], 
    roundsPerMethod: number = 100
  ) => {
    await runBatchSimulation(methods, roundsPerMethod);
  }, [runBatchSimulation]);
  
  // Update config helpers
  const updateConfig = useCallback((updates: Partial<SimulationConfig>) => {
    setConfig(updates);
  }, [setConfig]);
  
  const setExcludeNumbers = useCallback((numbers: number[]) => {
    setConfig({ excludeNumbers: numbers });
  }, [setConfig]);
  
  const setIncludeNumbers = useCallback((numbers: number[]) => {
    setConfig({ includeNumbers: numbers });
  }, [setConfig]);
  
  // Statistics
  const statistics = useMemo(() => getStatistics(), [getStatistics, currentBatch, history]);
  
  // Best results from history
  const bestResults = useMemo(() => {
    const allResults: SimulationResult[] = [];
    
    history.forEach(batch => {
      if (batch.status === 'completed') {
        allResults.push(...batch.results);
      }
    });
    
    // Sort by confidence
    return allResults
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10);
  }, [history]);
  
  // Most frequent numbers
  const mostFrequentNumbers = useMemo(() => {
    if (!statistics) return [];
    
    const entries = Array.from(statistics.numberFrequency.entries());
    return entries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([number, count]) => ({
        number,
        count,
        percentage: (count / statistics.totalSimulations / 6) * 100
      }));
  }, [statistics]);
  
  // Progress info
  const progress = currentBatch?.progress || 0;
  const isRunning = isSimulating && currentBatch?.status === 'running';
  const isPending = currentBatch?.status === 'pending';
  const isCompleted = currentBatch?.status === 'completed';
  const isFailed = currentBatch?.status === 'failed';
  
  return {
    // State
    isSimulating,
    isLoadingHistoricalData,
    currentBatch,
    history,
    selectedResult,
    config,
    historicalData,
    statistics,
    bestResults,
    mostFrequentNumbers,
    
    // Progress
    progress,
    isRunning,
    isPending,
    isCompleted,
    isFailed,
    
    // Actions
    runSimulation,
    runMultiMethodSimulation,
    cancelSimulation,
    selectResult,
    clearHistory,
    updateConfig,
    setExcludeNumbers,
    setIncludeNumbers,
    
    // Utilities
    hasHistoricalData: historicalData.length > 0,
    canRunSimulation: !isSimulating && historicalData.length > 0,
  };
};