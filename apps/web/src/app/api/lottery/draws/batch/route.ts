import { NextResponse } from 'next/server';
import axios from 'axios';

const DHLOTTERY_API_URL = 'https://www.dhlottery.co.kr/common.do';

// 인메모리 캐시 (간단한 구현, 프로덕션에서는 Redis 권장)
const cache = new Map<number, any>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24시간

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rounds, startRound, endRound } = body;
    
    // 요청할 회차 목록 결정
    let roundsToFetch: number[] = [];
    
    if (rounds && Array.isArray(rounds)) {
      roundsToFetch = rounds;
    } else if (startRound && endRound) {
      for (let i = startRound; i <= endRound; i++) {
        roundsToFetch.push(i);
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }
    
    // 최대 500개 제한
    if (roundsToFetch.length > 500) {
      return NextResponse.json(
        { error: 'Too many rounds requested. Maximum 500 allowed.' },
        { status: 400 }
      );
    }
    
    // 캐시된 데이터와 새로 가져올 데이터 분리
    const results: any[] = [];
    const uncachedRounds: number[] = [];
    
    for (const round of roundsToFetch) {
      const cached = cache.get(round);
      if (cached && cached.timestamp > Date.now() - CACHE_TTL) {
        results.push(cached.data);
      } else {
        uncachedRounds.push(round);
      }
    }
    
    // 캐시되지 않은 데이터를 병렬로 가져오기
    if (uncachedRounds.length > 0) {
      // 10개씩 배치로 처리
      const batchSize = 10;
      for (let i = 0; i < uncachedRounds.length; i += batchSize) {
        const batch = uncachedRounds.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (round) => {
          try {
            const response = await axios.get(DHLOTTERY_API_URL, {
              params: {
                method: 'getLottoNumber',
                drwNo: round,
              },
              timeout: 5000,
            });
            
            if (response.data.returnValue === 'success') {
              // 캐시에 저장
              cache.set(round, {
                data: response.data,
                timestamp: Date.now(),
              });
              
              // 캐시 크기 제한 (최대 1000개)
              if (cache.size > 1000) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
              }
              
              return response.data;
            }
            return null;
          } catch (error) {
            console.error(`Error fetching round ${round}:`, error);
            return null;
          }
        });
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.filter(Boolean));
        
        // 너무 많은 요청을 한번에 보내지 않도록 잠시 대기
        if (i + batchSize < uncachedRounds.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }
    
    // 결과를 회차 순으로 정렬
    results.sort((a, b) => b.drwNo - a.drwNo);
    
    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
      cached: roundsToFetch.length - uncachedRounds.length,
      fetched: uncachedRounds.length,
    }, {
      headers: {
        'Cache-Control': 'private, max-age=300',
      },
    });
  } catch (error) {
    console.error('Error in batch lottery API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lottery data' },
      { status: 500 }
    );
  }
}