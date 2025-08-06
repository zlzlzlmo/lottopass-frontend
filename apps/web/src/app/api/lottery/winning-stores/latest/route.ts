import { NextResponse } from 'next/server';
import type { WinningStore } from '@/features/winning-stores';

// 최신 회차(1183회) 당첨 판매점 데이터
const LATEST_STORES: WinningStore[] = [
  // 1등 당첨 판매점
  {
    id: '1183-1-auto-1',
    storeName: '오케이(O.K)로또',
    address: '서울특별시 도봉구 우이천로 486-1',
    region: '서울',
    district: '도봉구',
    round: 1183,
    rank: 1,
  },
  {
    id: '1183-1-auto-2',
    storeName: '청구마트',
    address: '대구광역시 북구 검단로 34 청구아파트상가108동102호',
    region: '대구',
    district: '북구',
    round: 1183,
    rank: 1,
  },
  {
    id: '1183-1-auto-3',
    storeName: '오천억복권방',
    address: '광주광역시 서구 상무대로 1087',
    region: '광주',
    district: '서구',
    round: 1183,
    rank: 1,
  },
  {
    id: '1183-1-auto-4',
    storeName: '8888로또',
    address: '대전광역시 서구 월평북로 77',
    region: '대전',
    district: '서구',
    round: 1183,
    rank: 1,
  },
  {
    id: '1183-1-auto-5',
    storeName: '세븐일레븐 평내지원점',
    address: '경기도 남양주시 경춘로1256번길 6',
    region: '경기',
    district: '남양주시',
    round: 1183,
    rank: 1,
  },
  // 2등 당첨 판매점 (일부)
  {
    id: '1183-2-1',
    storeName: '대성복권',
    address: '서울특별시 동대문구 무학로',
    region: '서울',
    district: '동대문구',
    round: 1183,
    rank: 2,
  },
  {
    id: '1183-2-2',
    storeName: '부일카서비스',
    address: '부산광역시 동구 자성로',
    region: '부산',
    district: '동구',
    round: 1183,
    rank: 2,
  },
  {
    id: '1183-2-3',
    storeName: '금은동복권방',
    address: '경기도 용인시 기흥구',
    region: '경기',
    district: '용인시',
    round: 1183,
    rank: 2,
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: LATEST_STORES,
      total: LATEST_STORES.length,
      page: 1,
      pageSize: 20,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching latest winning stores:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch latest winning stores',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}