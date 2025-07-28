import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface WinningStore {
  rank: number;
  storeName: string;
  type?: string; // 자동/반자동/수동
  address: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { drwNo } = req.query;

  if (!drwNo) {
    return res.status(400).json({ error: 'drwNo parameter is required' });
  }

  try {
    const response = await axios.get(
      `https://dhlottery.co.kr/store.do?method=topStore&pageGubun=L645&drwNo=${drwNo}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    );

    const $ = cheerio.load(response.data);
    const winningStores: WinningStore[] = [];

    // 1등 당첨매장 파싱
    $('.group_content:first table tbody tr').each((index, element) => {
      const tds = $(element).find('td');
      if (tds.length >= 4) {
        winningStores.push({
          rank: 1,
          storeName: $(tds[1]).text().trim(),
          type: $(tds[2]).text().trim(),
          address: $(tds[3]).text().trim(),
        });
      }
    });

    // 2등 당첨매장 파싱 (인터넷 구매 제외)
    $('.group_content').eq(1).find('table tbody tr').each((index, element) => {
      const tds = $(element).find('td');
      if (tds.length >= 3) {
        const storeName = $(tds[1]).text().trim();
        const address = $(tds[2]).text().trim();
        
        // 인터넷 복권판매사이트 제외
        if (!storeName.includes('인터넷')) {
          winningStores.push({
            rank: 2,
            storeName,
            address,
          });
        }
      }
    });

    return res.status(200).json({
      drawNumber: Number(drwNo),
      stores: winningStores,
    });
  } catch (error) {
    console.error('Error fetching winning stores:', error);
    return res.status(500).json({ error: 'Failed to fetch winning stores' });
  }
}