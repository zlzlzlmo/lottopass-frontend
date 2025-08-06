import { NextResponse } from 'next/server';
import type { NumberStatistics, LottoDraw } from '@lottopass/shared';
import { fetchRecentDraws } from '@/lib/lottery-data';

// 캐시를 위한 메모리 저장소 (실제로는 Redis 등을 사용하는 것이 좋음)
let statisticsCache: {
  data: NumberStatistics[];
  lastUpdated: number;
} | null = null;

const CACHE_DURATION = 1000 * 60 * 60; // 1시간

// 번호별 통계 계산
function calculateStatistics(draws: LottoDraw[]): NumberStatistics[] {
  const stats: Map<number, {
    count: number;
    lastDrawRound: number;
    appearances: number[];
  }> = new Map();
  
  // 1부터 45까지 초기화
  for (let i = 1; i <= 45; i++) {
    stats.set(i, {
      count: 0,
      lastDrawRound: 0,
      appearances: [],
    });
  }
  
  // 각 회차의 번호 집계
  draws.forEach(draw => {
    const numbers = [draw.drwtNo1, draw.drwtNo2, draw.drwtNo3, draw.drwtNo4, draw.drwtNo5, draw.drwtNo6, draw.bnusNo];
    numbers.forEach(num => {
      const stat = stats.get(num)!;
      stat.count++;
      stat.appearances.push(draw.drwNo);
      if (draw.drwNo > stat.lastDrawRound) {
        stat.lastDrawRound = draw.drwNo;
      }
    });
  });
  
  // 통계 계산
  const totalNumbers = draws.length * 7; // 6개 번호 + 보너스
  const recentDraws = draws.slice(0, 10); // 최근 10회
  
  const result: NumberStatistics[] = [];
  
  stats.forEach((stat, number) => {
    // 최근 10회 출현 횟수
    const recentCount = stat.appearances.filter(round => 
      recentDraws.some(draw => draw.drwNo === round)
    ).length;
    
    // 평균 출현 간격 계산
    let averageInterval = 0;
    if (stat.appearances.length > 1) {
      const intervals: number[] = [];
      for (let i = 1; i < stat.appearances.length; i++) {
        intervals.push(stat.appearances[i - 1] - stat.appearances[i]);
      }
      averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    }
    
    result.push({
      number,
      frequency: stat.count,
      lastDrawn: stat.lastDrawRound,
      averageGap: averageInterval || 0,
      isHot: recentCount >= 3, // 최근 10회에 3번 이상 출현
      isCold: recentCount === 0, // 최근 10회에 한 번도 안 나온 번호
    });
  });
  
  return result.sort((a, b) => b.frequency - a.frequency);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recentCount = parseInt(searchParams.get('recent') || '100');
    
    // 캐시 확인 (nocache 파라미터로 강제 갱신 가능)
    const noCache = searchParams.get('nocache') === '1';
    if (!noCache && statisticsCache && Date.now() - statisticsCache.lastUpdated < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: statisticsCache.data,
        timestamp: Date.now(),
        cached: true,
      });
    }
    
    // 최근 회차 데이터 가져오기
    const draws = await fetchRecentDraws(Math.min(recentCount, 1000)); // 최대 1000회
    
    // 통계 계산
    const statistics = calculateStatistics(draws);
    
    // 캐시 업데이트
    statisticsCache = {
      data: statistics,
      lastUpdated: Date.now(),
    };
    
    return NextResponse.json({
      success: true,
      data: statistics,
      meta: {
        analyzedDraws: draws.length,
        latestRound: draws[0]?.drwNo,
        oldestRound: draws[draws.length - 1]?.drwNo,
      },
      timestamp: Date.now(),
      cached: false,
    });
  } catch (error) {
    console.error('Error calculating statistics:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to calculate statistics',
        },
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}