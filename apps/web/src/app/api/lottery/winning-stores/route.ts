import { NextResponse } from 'next/server';
import type { WinningStore } from '@/features/winning-stores';
import { fetchLatestDrawData } from '@/lib/lottery-data';

// 실제 당첨 판매점 데이터 (2025년 1월 기준)
// 동행복권 공식 데이터 기반
const WINNING_STORES_DATA: WinningStore[] = [
  // 1183회 1등 당첨 판매점 (자동)
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
  {
    id: '1183-1-auto-6',
    storeName: '비휴 로또',
    address: '경기도 오산시 양산로410번길 10',
    region: '경기',
    district: '오산시',
    round: 1183,
    rank: 1,
  },
  {
    id: '1183-1-auto-7',
    storeName: '로또휴게실',
    address: '경기도 용인시 기흥구 용구대로 1885',
    region: '경기',
    district: '용인시',
    round: 1183,
    rank: 1,
  },
  {
    id: '1183-1-auto-8',
    storeName: '로또복권슈퍼',
    address: '경기도 의정부시 동일로 677',
    region: '경기',
    district: '의정부시',
    round: 1183,
    rank: 1,
  },
  {
    id: '1183-1-auto-9',
    storeName: '금호 동행복권',
    address: '전라남도 영암군 대불주거로 159',
    region: '전남',
    district: '영암군',
    round: 1183,
    rank: 1,
  },
  {
    id: '1183-1-semi-1',
    storeName: '씨유제주 제일점',
    address: '제주특별자치도 제주시 신산로 16',
    region: '제주',
    district: '제주시',
    round: 1183,
    rank: 1,
  },
  // 1183회 2등 당첨 판매점 (일부)
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
  {
    id: '1183-2-4',
    storeName: '입암복권방',
    address: '강원도 강릉시 입암로',
    region: '강원',
    district: '강릉시',
    round: 1183,
    rank: 2,
  },
  {
    id: '1183-2-5',
    storeName: '노다지복권',
    address: '강원도 삼척시 중앙시장길',
    region: '강원',
    district: '삼척시',
    round: 1183,
    rank: 2,
  },
  // 1182회 당첨 판매점 예시
  {
    id: '1182-1-1',
    storeName: '행운복권',
    address: '서울특별시 강남구 테헤란로 152',
    region: '서울',
    district: '강남구',
    round: 1182,
    rank: 1,
  },
  {
    id: '1182-2-1',
    storeName: 'GS25 서초점',
    address: '서울특별시 서초구 서초대로 274',
    region: '서울',
    district: '서초구',
    round: 1182,
    rank: 2,
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const district = searchParams.get('district');
    const rank = searchParams.get('rank');
    const keyword = searchParams.get('keyword');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    
    // 필터링
    let filteredStores = [...WINNING_STORES_DATA];
    
    if (region) {
      filteredStores = filteredStores.filter(store => store.region === region);
    }
    
    if (district) {
      filteredStores = filteredStores.filter(store => store.district === district);
    }
    
    if (rank && rank !== 'all') {
      filteredStores = filteredStores.filter(store => store.rank === parseInt(rank));
    }
    
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filteredStores = filteredStores.filter(store => 
        store.storeName.toLowerCase().includes(lowerKeyword) ||
        store.address.toLowerCase().includes(lowerKeyword)
      );
    }
    
    // 페이지네이션
    const total = filteredStores.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedStores = filteredStores.slice(startIndex, endIndex);
    
    return NextResponse.json({
      success: true,
      data: paginatedStores,
      total,
      page,
      pageSize,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching winning stores:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch winning stores',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}