'use client';

import { useEffect, useMemo, useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DrawService } from '@lottopass/core';
import { LotteryDraw } from '@lottopass/shared';
import { useSimulationStore } from '../store';
import { SimulationConfig, SimulationResult } from '../types';

export interface UseOptimizedNumberSimulationOptions {
  autoLoadHistoricalData?: boolean;
  historicalDataRange?: {
    startRound?: number;
    endRound?: number;
    limit?: number;
  };
}

export const useOptimizedNumberSimulation = (options: UseOptimizedNumberSimulationOptions = {}) => {
  const {
    autoLoadHistoricalData = true,
    historicalDataRange = { limit: 100 }
  } = options;
  
  const [loadingProgress, setLoadingProgress] = useState({ loaded: 0, total: 0 });
  
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
  
  // 최적화된 과거 데이터 로딩
  const { data: fetchedHistoricalData, isLoading: isLoadingHistoricalData, refetch } = useQuery({
    queryKey: ['lottery-draws-optimized', historicalDataRange],
    queryFn: async () => {
      const drawService = DrawService.getInstance();
      
      if (historicalDataRange.startRound && historicalDataRange.endRound) {
        // 범위 기반 로딩
        const results = await drawService.getRangeDrawResults(
          historicalDataRange.startRound,
          historicalDataRange.endRound,
          (loaded, total) => setLoadingProgress({ loaded, total })
        );
        
        return results.map(result => ({
          round: result.drwNo,
          drawDate: result.drwNoDate,
          numbers: [
            result.drwtNo1,
            result.drwtNo2,
            result.drwtNo3,
            result.drwtNo4,
            result.drwtNo5,
            result.drwtNo6,
          ] as [number, number, number, number, number, number],
          bonusNumber: result.bnusNo,
          firstWinAmount: result.firstAccumamnt,
          firstWinCount: result.firstPrzwnerCo,
          firstWinAmountPerPerson: result.firstWinamnt,
          totalSellAmount: result.totSellamnt,
          winnerDetails: []
        } as LotteryDraw));
      } else {
        // 최신 N개 로딩
        const latest = await drawService.getLatestDrawResult();
        if (!latest) return [];
        
        const limit = historicalDataRange.limit || 100;
        const rounds: number[] = [];
        for (let i = 0; i < limit && latest.drwNo - i > 0; i++) {
          rounds.push(latest.drwNo - i);
        }
        
        const results = await drawService.getBatchDrawResults(
          rounds,
          (loaded, total) => setLoadingProgress({ loaded, total })
        );
        
        return results.map(result => ({
          round: result.drwNo,
          drawDate: result.drwNoDate,
          numbers: [
            result.drwtNo1,
            result.drwtNo2,
            result.drwtNo3,
            result.drwtNo4,
            result.drwtNo5,
            result.drwtNo6,
          ] as [number, number, number, number, number, number],
          bonusNumber: result.bnusNo,
          firstWinAmount: result.firstAccumamnt,
          firstWinCount: result.firstPrzwnerCo,
          firstWinAmountPerPerson: result.firstWinamnt,
          totalSellAmount: result.totSellamnt,
          winnerDetails: []
        } as LotteryDraw));
      }
    },
    enabled: autoLoadHistoricalData,
    staleTime: 1000 * 60 * 60 * 24, // 24시간
    cacheTime: 1000 * 60 * 60 * 24 * 7, // 7일
  });
  
  // 과거 데이터 로드
  useEffect(() => {
    if (fetchedHistoricalData && fetchedHistoricalData.length > 0) {
      loadHistoricalData(fetchedHistoricalData);
    }
  }, [fetchedHistoricalData, loadHistoricalData]);
  
  // 시뮬레이션 실행
  const runSimulation = useCallback(async (
    method?: SimulationConfig['method'], 
    rounds?: number
  ) => {
    if (method) {
      setConfig({ method });
    }
    await startSimulation(rounds);
  }, [setConfig, startSimulation]);
  
  // 멀티 메서드 시뮬레이션
  const runMultiMethodSimulation = useCallback(async (
    methods: SimulationConfig['method'][], 
    roundsPerMethod: number = 100
  ) => {
    await runBatchSimulation(methods, roundsPerMethod);
  }, [runBatchSimulation]);
  
  // 설정 업데이트
  const updateConfig = useCallback((updates: Partial<SimulationConfig>) => {
    setConfig(updates);
  }, [setConfig]);
  
  const setExcludeNumbers = useCallback((numbers: number[]) => {
    setConfig({ excludeNumbers: numbers });
  }, [setConfig]);
  
  const setIncludeNumbers = useCallback((numbers: number[]) => {
    setConfig({ includeNumbers: numbers });
  }, [setConfig]);
  
  // 통계
  const statistics = useMemo(() => getStatistics(), [getStatistics, currentBatch, history]);
  
  // 베스트 결과
  const bestResults = useMemo(() => {
    const allResults: SimulationResult[] = [];
    
    history.forEach(batch => {
      if (batch.status === 'completed') {
        allResults.push(...batch.results);
      }
    });
    
    return allResults
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10);
  }, [history]);
  
  // 자주 나오는 번호
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
  
  // 진행 상태
  const progress = currentBatch?.progress || 0;
  const isRunning = isSimulating && currentBatch?.status === 'running';
  const isPending = currentBatch?.status === 'pending';
  const isCompleted = currentBatch?.status === 'completed';
  const isFailed = currentBatch?.status === 'failed';
  
  // 데이터 새로고침
  const refreshData = useCallback(() => {
    refetch();
  }, [refetch]);
  
  return {
    // 상태
    isSimulating,
    isLoadingHistoricalData,
    loadingProgress,
    currentBatch,
    history,
    selectedResult,
    config,
    historicalData,
    statistics,
    bestResults,
    mostFrequentNumbers,
    
    // 진행 상태
    progress,
    isRunning,
    isPending,
    isCompleted,
    isFailed,
    
    // 액션
    runSimulation,
    runMultiMethodSimulation,
    cancelSimulation,
    selectResult,
    clearHistory,
    updateConfig,
    setExcludeNumbers,
    setIncludeNumbers,
    refreshData,
    
    // 유틸리티
    hasHistoricalData: historicalData.length > 0,
    canRunSimulation: !isSimulating && historicalData.length > 0,
  };
};