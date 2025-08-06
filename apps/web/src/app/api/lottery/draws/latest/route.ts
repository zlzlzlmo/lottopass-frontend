import { NextResponse } from 'next/server';
import type { LottoDraw } from '@lottopass/shared';
import { fetchLatestDrawData } from '@/lib/lottery-data';

export async function GET() {
  try {
    const data = await fetchLatestDrawData();
    
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch latest lottery data',
          timestamp: Date.now(),
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data,
      timestamp: Date.now(),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    });
  } catch (error) {
    console.error('Error fetching latest lottery data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch latest lottery data',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}