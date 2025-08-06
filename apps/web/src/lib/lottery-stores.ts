import type { WinningStore } from '@/features/winning-stores';

// 동행복권 당첨판매점 페이지를 크롤링하는 함수
export async function fetchWinningStores(round: number): Promise<WinningStore[]> {
  try {
    // 동행복권 당첨판매점 페이지 URL
    // topStore 페이지는 1등/2등 당첨 판매점 정보를 제공
    const url = `https://www.dhlottery.co.kr/store.do?method=topStore&pageGubun=L645&drwNo=${round}`;
    
    // CORS 문제를 우회하기 위해 서버사이드에서만 실행
    if (typeof window !== 'undefined') {
      throw new Error('This function must be called server-side');
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const html = await response.text();
    
    // HTML 파싱하여 판매점 정보 추출
    const stores: WinningStore[] = [];
    
    // 정규식으로 판매점 정보 추출
    // 동행복권 사이트의 테이블 구조를 파싱
    const tableRegex = /<tbody[^>]*>([\s\S]*?)<\/tbody>/gi;
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    
    const tableMatches = html.match(tableRegex);
    if (!tableMatches) {
      console.error('No table found in HTML');
      return [];
    }
    
    // 보통 첫 번째 테이블이 1등, 두 번째가 2등
    tableMatches.forEach((tableHtml, tableIndex) => {
      const rank = (tableIndex === 0 ? 1 : 2) as 1 | 2;
      let rowMatch;
      let storeIndex = 0;
      
      while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
        const rowHtml = rowMatch[1];
        const cells: string[] = [];
        let cellMatch;
        
        while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
          // HTML 태그 제거하고 텍스트만 추출
          const cellText = cellMatch[1]
            .replace(/<[^>]*>/g, '')
            .trim();
          cells.push(cellText);
        }
        
        // 동행복권 테이블 구조: 순번, 상호명, 소재지
        if (cells.length >= 3 && cells[0] !== '순번') {
          const addressParts = cells[2].split(' ');
          const region = addressParts[0] || '';
          const district = addressParts[1] || '';
          
          stores.push({
            id: `${round}-${rank}-${storeIndex}`,
            storeName: cells[1],
            address: cells[2],
            region: region.replace(/특별시$|광역시$|도$|특별자치/, ''),
            district,
            round,
            rank,
          });
          
          storeIndex++;
        }
      }
    });
    
    return stores;
  } catch (error) {
    console.error('Error fetching winning stores:', error);
    return [];
  }
}

// 최신 회차의 당첨 판매점 정보 가져오기
export async function fetchLatestWinningStores(): Promise<WinningStore[]> {
  try {
    // 먼저 최신 회차 번호를 가져옴
    const latestResponse = await fetch(
      'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo='
    );
    
    if (!latestResponse.ok) {
      throw new Error('Failed to fetch latest round');
    }
    
    const latestData = await latestResponse.json();
    const latestRound = latestData.drwNo;
    
    if (!latestRound) {
      // 최신 회차를 못 가져온 경우 예상 회차 계산
      const firstDrawDate = new Date('2002-12-07');
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - firstDrawDate.getTime());
      const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      const estimatedRound = diffWeeks + 1;
      
      return fetchWinningStores(estimatedRound);
    }
    
    return fetchWinningStores(latestRound);
  } catch (error) {
    console.error('Error fetching latest winning stores:', error);
    return [];
  }
}