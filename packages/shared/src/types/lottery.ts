/**
 * 로또 관련 타입 정의
 */

// 로또 번호 타입 (1-45)
export type LotteryNumber = number;

// 로또 당첨 정보
export interface LotteryDraw {
  round: number; // 회차
  drawDate: string; // 추첨일 (YYYY-MM-DD)
  numbers: [LotteryNumber, LotteryNumber, LotteryNumber, LotteryNumber, LotteryNumber, LotteryNumber]; // 당첨번호 6개
  bonusNumber: LotteryNumber; // 보너스 번호
  
  // 당첨 정보
  firstWinAmount: number; // 1등 당첨금액
  firstWinCount: number; // 1등 당첨자 수
  firstWinAmountPerPerson: number; // 1등 1인당 당첨금액
  
  // 판매 정보
  totalSellAmount: number; // 총 판매금액
  
  // 당첨 정보 상세
  winnerDetails: {
    rank: number; // 등수
    winCount: number; // 당첨자 수
    winAmount: number; // 당첨금액
    winAmountPerPerson: number; // 1인당 당첨금액
  }[];
}

// 동행복권 API 원본 응답 타입
export interface DhlotteryResponse {
  totSellamnt: number; // 총판매금액
  returnValue: string; // 결과값 (success/fail)
  drwNoDate: string; // 추첨일
  firstWinamnt: number; // 1등 당첨금액
  drwtNo1: number; // 당첨번호1
  drwtNo2: number; // 당첨번호2
  drwtNo3: number; // 당첨번호3
  drwtNo4: number; // 당첨번호4
  drwtNo5: number; // 당첨번호5
  drwtNo6: number; // 당첨번호6
  bnusNo: number; // 보너스번호
  firstPrzwnerCo: number; // 1등 당첨자수
  firstAccumamnt: number; // 1등 총당첨금
  drwNo: number; // 회차
  
  // 등수별 당첨 정보
  firstWinamnt: number; // 1등 당첨금
  firstPrzwnerCo: number; // 1등 당첨자수
  firstAccumamnt: number; // 1등 누적금액
  
  secondWinamnt?: number; // 2등 당첨금
  secondPrzwnerCo?: number; // 2등 당첨자수
  secondAccumamnt?: number; // 2등 누적금액
  
  thirdWinamnt?: number; // 3등 당첨금
  thirdPrzwnerCo?: number; // 3등 당첨자수
  thirdAccumamnt?: number; // 3등 누적금액
  
  fourthWinamnt?: number; // 4등 당첨금
  fourthPrzwnerCo?: number; // 4등 당첨자수
  fourthAccumamnt?: number; // 4등 누적금액
  
  fifthWinamnt?: number; // 5등 당첨금
  fifthPrzwnerCo?: number; // 5등 당첨자수
  fifthAccumamnt?: number; // 5등 누적금액
}

// 당첨 판매점 정보
export interface WinningStore {
  round: number; // 회차
  rank: number; // 등수
  storeName: string; // 판매점명
  address: string; // 주소
  addressDetail?: string; // 상세주소
  phoneNumber?: string; // 전화번호
  mapUrl?: string; // 지도 URL
  method: '자동' | '수동' | '반자동'; // 구매방법
  
  // 위치 정보
  region: string; // 지역 (시/도)
  district: string; // 구/군
  neighborhood?: string; // 동/읍/면
  
  // 추가 정보
  isOnline?: boolean; // 온라인 구매 여부
  winCount?: number; // 해당 점포 당첨 횟수
}

// 통계 관련 타입
export interface NumberStatistics {
  number: LotteryNumber;
  count: number; // 출현 횟수
  percentage: number; // 출현 비율
  lastDrawRound?: number; // 마지막 출현 회차
  averageInterval?: number; // 평균 출현 간격
  
  // 구간별 통계
  recentCount?: number; // 최근 10회 출현 횟수
  isHot?: boolean; // 최근 자주 나오는 번호
  isCold?: boolean; // 최근 잘 안나오는 번호
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: number;
}

// 회차 범위 조회 파라미터
export interface DrawRangeParams {
  startRound: number;
  endRound: number;
}

// 판매점 검색 파라미터
export interface StoreSearchParams {
  region?: string; // 시/도
  district?: string; // 구/군
  round?: number; // 회차
  rank?: number; // 등수
}