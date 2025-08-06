import { NextResponse } from 'next/server';
import { fetchRecentDraws } from '@/lib/lottery-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const draws = await fetchRecentDraws(Math.min(limit, 100));
    
    if (!draws || draws.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No draw data available',
          timestamp: Date.now(),
        },
        { status: 404 }
      );
    }
    
    // Transform to our API format
    const transformedDraws = draws.map(draw => ({
      round: draw.drwNo,
      drawDate: draw.drwNoDate,
      numbers: [
        draw.drwtNo1,
        draw.drwtNo2,
        draw.drwtNo3,
        draw.drwtNo4,
        draw.drwtNo5,
        draw.drwtNo6,
      ],
      bonusNumber: draw.bnusNo,
      firstWinAmount: draw.firstAccumamnt,
      firstWinCount: draw.firstPrzwnerCo,
      firstWinAmountPerPerson: draw.firstWinamnt,
      totalSellAmount: draw.totSellamnt,
    }));
    
    return NextResponse.json({
      success: true,
      data: transformedDraws,
      timestamp: Date.now(),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    });
  } catch (error) {
    console.error('Error fetching draw data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch draw data',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}