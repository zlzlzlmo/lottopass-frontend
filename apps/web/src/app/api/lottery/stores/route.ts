import { NextResponse } from 'next/server';

// 당첨 판매점 정보
interface WinningStore {
  round: number;
  rank: number;
  storeName: string;
  address: string;
  addressDetail?: string;
  phoneNumber?: string;
  mapUrl?: string;
  method: '자동' | '수동' | '반자동';
  region: string;
  district: string;
  neighborhood?: string;
  isOnline?: boolean;
  winCount?: number;
}

// 동행복권 당첨 판매점 페이지 크롤링 (실제로는 더 정교한 방법 필요)
async function fetchWinningStores(round: number, rank: number = 1): Promise<WinningStore[]> {
  try {
    // 동행복권 당첨 판매점 조회 URL
    const url = `https://www.dhlottery.co.kr/store.do?method=topStoreRank&rank=${rank}&pageGubun=L645`;
    
    // 여기서는 예시 데이터를 반환 (실제로는 크롤링이나 공식 API가 필요)
    // 동행복권은 당첨 판매점 정보에 대한 공식 API를 제공하지 않음
    const mockStores: WinningStore[] = [
      {
        round,
        rank,
        storeName: '행운복권방',
        address: '서울특별시 강남구 테헤란로 123',
        addressDetail: '1층',
        phoneNumber: '02-1234-5678',
        method: '자동',
        region: '서울특별시',
        district: '강남구',
        neighborhood: '역삼동',
        isOnline: false,
        winCount: 3,
      },
      {
        round,
        rank,
        storeName: '대박로또',
        address: '서울특별시 서초구 강남대로 456',
        method: '수동',
        region: '서울특별시',
        district: '서초구',
        neighborhood: '서초동',
        isOnline: false,
        winCount: 1,
      },
    ];
    
    return mockStores;
  } catch (error) {
    console.error('Error fetching winning stores:', error);
    return [];
  }
}

// 지역별 당첨 통계 계산
function calculateRegionalStats(stores: WinningStore[]): Record<string, number> {
  const stats: Record<string, number> = {};
  
  stores.forEach(store => {
    const key = `${store.region} ${store.district}`;
    stats[key] = (stats[key] || 0) + 1;
  });
  
  return stats;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const round = parseInt(searchParams.get('round') || '0');
    const rank = parseInt(searchParams.get('rank') || '1');
    const region = searchParams.get('region');
    const district = searchParams.get('district');
    
    // 최신 회차 정보 가져오기
    let targetRound = round;
    if (!targetRound) {
      const latestResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/lottery/draws/latest`);
      const latestData = await latestResponse.json();
      if (latestData.success) {
        targetRound = latestData.data.round;
      }
    }
    
    // 당첨 판매점 정보 가져오기
    let stores = await fetchWinningStores(targetRound, rank);
    
    // 지역 필터링
    if (region) {
      stores = stores.filter(store => store.region === region);
    }
    if (district) {
      stores = stores.filter(store => store.district === district);
    }
    
    // 지역별 통계
    const regionalStats = calculateRegionalStats(stores);
    
    return NextResponse.json({
      success: true,
      data: stores,
      meta: {
        round: targetRound,
        rank,
        totalStores: stores.length,
        regionalStats,
      },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching winning stores:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch winning stores',
        },
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}

// 지역 목록 API
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'getRegions') {
      // 대한민국 시/도 목록
      const regions = [
        '서울특별시',
        '부산광역시',
        '대구광역시',
        '인천광역시',
        '광주광역시',
        '대전광역시',
        '울산광역시',
        '세종특별자치시',
        '경기도',
        '강원도',
        '충청북도',
        '충청남도',
        '전라북도',
        '전라남도',
        '경상북도',
        '경상남도',
        '제주특별자치도',
      ];
      
      return NextResponse.json({
        success: true,
        data: regions,
        timestamp: Date.now(),
      });
    }
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_ACTION',
          message: 'Invalid action',
        },
        timestamp: Date.now(),
      },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to process request',
        },
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}