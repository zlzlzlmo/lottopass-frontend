import { NextResponse } from 'next/server';
import type { LottoDraw } from '@lottopass/shared';
import { fetchDrawData } from '@/lib/lottery-data';

// 동행복권 응답을 우리 응답 형식으로 변환
function transformDrawData(data: LottoDraw): any {
  // Transform LottoDraw data for API response
  
  return {
    round: data.drwNo,
    drawDate: data.drwNoDate,
    numbers: [
      data.drwtNo1,
      data.drwtNo2,
      data.drwtNo3,
      data.drwtNo4,
      data.drwtNo5,
      data.drwtNo6,
    ],
    bonusNumber: data.bnusNo,
    firstWinAmount: data.firstAccumamnt,
    firstWinCount: data.firstPrzwnerCo,
    firstWinAmountPerPerson: data.firstWinamnt,
    totalSellAmount: data.totSellamnt,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ round: string }> }
) {
  try {
    const { round: roundStr } = await params;
    const round = parseInt(roundStr);
    
    if (isNaN(round) || round < 1) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ROUND',
            message: 'Invalid round number',
          },
          timestamp: Date.now(),
        },
        { status: 400 }
      );
    }
    
    const data = await fetchDrawData(round);
    
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Round ${round} not found`,
          },
          timestamp: Date.now(),
        },
        { status: 404 }
      );
    }
    
    const transformedData = transformDrawData(data);
    
    return NextResponse.json({
      success: true,
      data: transformedData,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching lottery data:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch lottery data',
        },
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}