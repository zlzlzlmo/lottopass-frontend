import type { LottoDraw } from '@lottopass/shared';

// 동행복권 API 응답 타입
interface DhlotteryResponse {
  totSellamnt: number;
  returnValue: string;
  drwNoDate: string;
  firstWinamnt: number;
  drwtNo1: number;
  drwtNo2: number;
  drwtNo3: number;
  drwtNo4: number;
  drwtNo5: number;
  drwtNo6: number;
  bnusNo: number;
  firstPrzwnerCo: number;
  firstAccumamnt: number;
  drwNo: number;
  secondWinamnt?: number;
  secondPrzwnerCo?: number;
  secondAccumamnt?: number;
  thirdWinamnt?: number;
  thirdPrzwnerCo?: number;
  thirdAccumamnt?: number;
  fourthWinamnt?: number;
  fourthPrzwnerCo?: number;
  fourthAccumamnt?: number;
  fifthWinamnt?: number;
  fifthPrzwnerCo?: number;
  fifthAccumamnt?: number;
}

// 최신 회차 번호 계산 (토요일 기준)
export function calculateLatestRound(): number {
  const firstDrawDate = new Date('2002-12-07'); // 1회차 추첨일
  const now = new Date();
  
  // 한국 시간 기준으로 변환
  const kstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  
  // 토요일 오후 8시 45분 이후인지 확인
  const dayOfWeek = kstNow.getDay();
  const hours = kstNow.getHours();
  const minutes = kstNow.getMinutes();
  const isAfterDraw = dayOfWeek === 6 && (hours > 20 || (hours === 20 && minutes >= 45));
  
  // 경과 주수 계산
  const weeksPassed = Math.floor((kstNow.getTime() - firstDrawDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
  
  // 이번 주 토요일 추첨이 끝났으면 +1, 아니면 그대로
  return weeksPassed + 1 + (isAfterDraw ? 1 : 0);
}

// 동행복권 API에서 특정 회차 데이터 조회
export async function fetchDrawData(round: number): Promise<LottoDraw | null> {
  try {
    const response = await fetch(
      `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data: DhlotteryResponse = await response.json();
    
    if (data.returnValue !== 'success') {
      return null;
    }
    
    // LottoDraw 타입으로 변환
    return {
      drwNo: data.drwNo,
      drwNoDate: data.drwNoDate,
      drwtNo1: data.drwtNo1,
      drwtNo2: data.drwtNo2,
      drwtNo3: data.drwtNo3,
      drwtNo4: data.drwtNo4,
      drwtNo5: data.drwtNo5,
      drwtNo6: data.drwtNo6,
      bnusNo: data.bnusNo,
      totSellamnt: data.totSellamnt,
      returnValue: data.returnValue,
      firstWinamnt: data.firstWinamnt,
      firstPrzwnerCo: data.firstPrzwnerCo,
      firstAccumamnt: data.firstAccumamnt,
    };
  } catch (error) {
    console.error(`Error fetching lottery data for round ${round}:`, error);
    return null;
  }
}

// 최신 회차 데이터 조회
export async function fetchLatestDrawData(): Promise<LottoDraw | null> {
  // 먼저 예상 최신 회차로 시도
  let round = calculateLatestRound();
  let attempts = 0;
  const maxAttempts = 5;
  
  while (attempts < maxAttempts) {
    const data = await fetchDrawData(round);
    
    if (data) {
      return data;
    }
    
    // 데이터가 없으면 이전 회차 시도
    round--;
    attempts++;
  }
  
  return null;
}

// 최근 N회차의 데이터를 가져오기
export async function fetchRecentDraws(count: number): Promise<LottoDraw[]> {
  const draws: LottoDraw[] = [];
  
  // 최신 회차 가져오기
  const latestDraw = await fetchLatestDrawData();
  
  if (!latestDraw) {
    throw new Error('Failed to fetch latest draw');
  }
  
  draws.push(latestDraw);
  const latestRound = latestDraw.drwNo;
  
  // 병렬로 최근 회차들 가져오기
  const promises = [];
  for (let i = 1; i < count; i++) {
    const round = latestRound - i;
    if (round > 0) {
      promises.push(fetchDrawData(round));
    }
  }
  
  const results = await Promise.all(promises);
  const validDraws = results.filter((draw): draw is LottoDraw => draw !== null);
  
  return [...draws, ...validDraws];
}