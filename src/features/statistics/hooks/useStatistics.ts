import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo, useCallback } from 'react';
import { drawService } from '@/api';
import { useOptimistic } from '@/hooks/useOptimistic';

interface NumberFrequency {
  number: number;
  frequency: number;
  lastDrawNo: number;
  consecutiveMisses: number;
}

interface StatisticsData {
  frequencies: NumberFrequency[];
  hotNumbers: number[];
  coldNumbers: number[];
  overdue: number[];
  pairs: Map<string, number>;
  sumRanges: { range: string; count: number }[];
}

export function useStatistics(range: number = 10) {
  const queryClient = useQueryClient();
  const [selectedRange, setSelectedRange] = useState(range);
  
  // Optimistic state for range changes
  const [optimisticRange, { addOptimistic, commitOptimistic }] = useOptimistic(
    selectedRange,
    (_, newRange) => newRange
  );

  // 최신 회차 정보 가져오기
  const { data: latestDraw } = useQuery({
    queryKey: ['latestDraw'],
    queryFn: async () => {
      const draw = await drawService.getLatestDraw();
      return draw;
    },
  });

  // 통계 데이터 가져오기
  const { data: statistics, isLoading, error } = useQuery({
    queryKey: ['statistics', optimisticRange],
    queryFn: async () => {
      if (!latestDraw) return null;
      
      const endNo = latestDraw.drwNo;
      const startNo = Math.max(1, endNo - optimisticRange + 1);
      
      // 범위 내 모든 회차 데이터 가져오기
      const draws = await Promise.all(
        Array.from({ length: optimisticRange }, (_, i) => 
          drawService.getDrawByNo(startNo + i)
        )
      );

      // 번호별 빈도 계산
      const frequencyMap = new Map<number, NumberFrequency>();
      
      for (let i = 1; i <= 45; i++) {
        frequencyMap.set(i, {
          number: i,
          frequency: 0,
          lastDrawNo: 0,
          consecutiveMisses: 0,
        });
      }

      // 각 회차별로 번호 빈도 계산
      draws.forEach(draw => {
        const numbers = [
          draw.drwtNo1, draw.drwtNo2, draw.drwtNo3,
          draw.drwtNo4, draw.drwtNo5, draw.drwtNo6,
        ];
        
        numbers.forEach(num => {
          const freq = frequencyMap.get(num)!;
          freq.frequency++;
          if (freq.lastDrawNo === 0 || draw.drwNo > freq.lastDrawNo) {
            freq.lastDrawNo = draw.drwNo;
          }
        });
      });

      // 연속 미출현 횟수 계산
      frequencyMap.forEach((freq, num) => {
        if (freq.lastDrawNo > 0) {
          freq.consecutiveMisses = endNo - freq.lastDrawNo;
        } else {
          freq.consecutiveMisses = optimisticRange;
        }
      });

      const frequencies = Array.from(frequencyMap.values());
      
      // 핫/콜드 넘버 계산
      const sortedByFreq = [...frequencies].sort((a, b) => b.frequency - a.frequency);
      const hotNumbers = sortedByFreq.slice(0, 7).map(f => f.number);
      const coldNumbers = sortedByFreq.slice(-7).map(f => f.number);
      
      // 장기 미출현 번호
      const overdue = frequencies
        .filter(f => f.consecutiveMisses >= Math.floor(optimisticRange * 0.7))
        .sort((a, b) => b.consecutiveMisses - a.consecutiveMisses)
        .map(f => f.number);

      // 번호 쌍 통계
      const pairs = new Map<string, number>();
      draws.forEach(draw => {
        const numbers = [
          draw.drwtNo1, draw.drwtNo2, draw.drwtNo3,
          draw.drwtNo4, draw.drwtNo5, draw.drwtNo6,
        ].sort((a, b) => a - b);
        
        for (let i = 0; i < numbers.length - 1; i++) {
          for (let j = i + 1; j < numbers.length; j++) {
            const pairKey = `${numbers[i]}-${numbers[j]}`;
            pairs.set(pairKey, (pairs.get(pairKey) || 0) + 1);
          }
        }
      });

      // 합계 범위 통계
      const sumRanges = [
        { range: '100-120', count: 0 },
        { range: '121-140', count: 0 },
        { range: '141-160', count: 0 },
        { range: '161-180', count: 0 },
        { range: '181-200', count: 0 },
        { range: '201+', count: 0 },
      ];
      
      draws.forEach(draw => {
        const sum = draw.drwtNo1 + draw.drwtNo2 + draw.drwtNo3 +
                   draw.drwtNo4 + draw.drwtNo5 + draw.drwtNo6;
        
        if (sum <= 120) sumRanges[0].count++;
        else if (sum <= 140) sumRanges[1].count++;
        else if (sum <= 160) sumRanges[2].count++;
        else if (sum <= 180) sumRanges[3].count++;
        else if (sum <= 200) sumRanges[4].count++;
        else sumRanges[5].count++;
      });

      return {
        frequencies,
        hotNumbers,
        coldNumbers,
        overdue,
        pairs,
        sumRanges,
      } as StatisticsData;
    },
    enabled: !!latestDraw,
  });

  // 범위 변경 함수
  const changeRange = useCallback((newRange: number) => {
    // Optimistic update
    addOptimistic(newRange);
    
    // 실제 상태 업데이트
    setSelectedRange(newRange);
    commitOptimistic(newRange);
    
    // 캐시 무효화
    queryClient.invalidateQueries({ queryKey: ['statistics'] });
  }, [addOptimistic, commitOptimistic, queryClient]);

  // 번호별 출현 확률 계산
  const probabilities = useMemo(() => {
    if (!statistics) return new Map<number, number>();
    
    const probs = new Map<number, number>();
    statistics.frequencies.forEach(freq => {
      probs.set(freq.number, (freq.frequency / optimisticRange) * 100);
    });
    
    return probs;
  }, [statistics, optimisticRange]);

  // 다음 회차 예측 (간단한 마르코프 체인)
  const predictions = useMemo(() => {
    if (!statistics) return [];
    
    // 최근 트렌드를 기반으로 예측
    const weights = new Map<number, number>();
    
    statistics.frequencies.forEach(freq => {
      // 기본 가중치 = 출현 빈도
      let weight = freq.frequency;
      
      // 장기 미출현 보정
      if (freq.consecutiveMisses > 5) {
        weight += freq.consecutiveMisses * 0.5;
      }
      
      // 최근 출현 페널티
      if (freq.consecutiveMisses < 2) {
        weight *= 0.7;
      }
      
      weights.set(freq.number, weight);
    });
    
    // 가중치 기반 상위 10개 추천
    return Array.from(weights.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([number]) => number);
  }, [statistics]);

  return {
    statistics,
    isLoading,
    error,
    selectedRange: optimisticRange,
    changeRange,
    probabilities,
    predictions,
    latestDraw,
  };
}