import { NextResponse } from 'next/server';
import type { WinningStore } from '@/features/winning-stores';

// 동행복권 사이트에서 당첨 판매점 정보를 크롤링
async function crawlWinningStores(round: number): Promise<WinningStore[]> {
  try {
    // Vercel Functions에서는 외부 요청 가능
    const url = `https://www.dhlottery.co.kr/store.do?method=topStore&pageGubun=L645&drwNo=${round}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const html = await response.text();
    const stores: WinningStore[] = [];
    
    // 1등 당첨 판매점 추출
    const firstPrizeRegex = /<table[^>]*class="tbl_data tbl_data_col"[^>]*>[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/i;
    const firstPrizeMatch = html.match(firstPrizeRegex);
    
    if (firstPrizeMatch) {
      const tbody = firstPrizeMatch[1];
      const rows = tbody.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
      
      rows.forEach((row, index) => {
        const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
        if (cells.length >= 3) {
          const storeName = cells[1].replace(/<[^>]*>/g, '').trim();
          const address = cells[2].replace(/<[^>]*>/g, '').trim();
          
          // 주소에서 시/도와 구/군 추출
          const addressParts = address.split(' ');
          let region = addressParts[0] || '';
          const district = addressParts[1] || '';
          
          // 시/도 이름 정규화
          region = region
            .replace('특별시', '')
            .replace('광역시', '')
            .replace('특별자치시', '')
            .replace('특별자치도', '')
            .replace('도', '');
          
          stores.push({
            id: `${round}-1-${index}`,
            storeName,
            address,
            region,
            district,
            round,
            rank: 1,
          });
        }
      });
    }
    
    // 2등 당첨 판매점도 유사하게 처리
    // HTML 구조가 복잡하므로 더 정교한 파싱이 필요할 수 있음
    
    return stores;
  } catch (error) {
    console.error('Error crawling winning stores:', error);
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const round = parseInt(searchParams.get('round') || '0');
    
    if (!round || round < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid round number',
        },
        { status: 400 }
      );
    }
    
    const stores = await crawlWinningStores(round);
    
    return NextResponse.json({
      success: true,
      data: stores,
      round,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in winning stores crawl API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to crawl winning stores',
      },
      { status: 500 }
    );
  }
}