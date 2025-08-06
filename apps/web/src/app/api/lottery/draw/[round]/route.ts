import { NextResponse } from 'next/server';
import axios from 'axios';

const DHLOTTERY_API_URL = 'https://www.dhlottery.co.kr/common.do';

export async function GET(
  request: Request,
  { params }: { params: { round: string } }
) {
  try {
    const round = parseInt(params.round);
    
    if (isNaN(round) || round < 1) {
      return NextResponse.json(
        { error: 'Invalid round number' },
        { status: 400 }
      );
    }

    // 동행복권 API 호출
    const response = await axios.get(DHLOTTERY_API_URL, {
      params: {
        method: 'getLottoNumber',
        drwNo: round,
      },
      timeout: 10000,
    });

    // 성공 여부 확인
    if (response.data.returnValue !== 'success') {
      return NextResponse.json(
        { error: 'No data available for this round' },
        { status: 404 }
      );
    }

    // 응답 데이터 그대로 반환
    return NextResponse.json(response.data, {
      headers: {
        // 5분간 캐시
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching lottery data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lottery data' },
      { status: 500 }
    );
  }
}