import { DetailDraw, LottoDraw } from "@/types";
import { formatNumberWithCommas } from "@/utils/number";
import axios from "axios";

interface DhlotteryResponse {
  returnValue: string;
  drwNo: number;
  drwNoDate: string;
  totSellamnt: number;
  firstAccumamnt: number;
  firstPrzwnerCo: number;
  firstWinamnt: number;
  drwtNo1: number;
  drwtNo2: number;
  drwtNo3: number;
  drwtNo4: number;
  drwtNo5: number;
  drwtNo6: number;
  bnusNo: number;
}

export class DrawService {
  private dhlotteryApiUrl = import.meta.env.DEV 
    ? "/dhlottery/common.do" // 개발 환경에서는 프록시 사용
    : "/api/lottery"; // 프로덕션에서는 서버리스 함수 사용
    
  private getLotteryUrl(drawNumber: number): string {
    if (import.meta.env.DEV) {
      return `${this.dhlotteryApiUrl}?method=getLottoNumber&drwNo=${drawNumber}`;
    }
    return `${this.dhlotteryApiUrl}?drwNo=${drawNumber}`;
  }

  async getAllDraws(): Promise<LottoDraw[]> {
    // 최신 회차부터 역순으로 모든 회차 가져오기
    const allDraws: LottoDraw[] = [];
    const latestDraw = await this.getLatestDraw();
    
    if (!latestDraw) return [];
    
    // 최근 100개 회차만 가져오기 (필요시 조정)
    const startRound = Math.max(1, latestDraw.drwNo - 99);
    
    for (let round = latestDraw.drwNo; round >= startRound; round--) {
      try {
        const draw = await this.getOneDraw(round);
        if (draw) allDraws.push(draw);
      } catch (error) {
        console.error(`Failed to fetch round ${round}:`, error);
      }
    }
    
    return allDraws;
  }

  async getLatestDraw(): Promise<LottoDraw> {
    try {
      // 최신 회차 찾기 - 대략적인 계산 (주차 기준)
      const baseDate = new Date(2002, 11, 7); // 2002년 12월 7일 (1회차)
      const currentDate = new Date();
      const weeksDiff = Math.floor((currentDate.getTime() - baseDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      const estimatedLatestRound = weeksDiff + 1;
      
      // 최신 회차부터 역순으로 찾기
      for (let round = estimatedLatestRound; round > estimatedLatestRound - 10; round--) {
        try {
          const response = await axios.get<DhlotteryResponse>(
            this.getLotteryUrl(round)
          );
          
          if (response.data.returnValue === "success") {
            return this.convertDhlotteryToLottoDraw(response.data);
          }
        } catch {
          continue;
        }
      }
      
      throw new Error("Failed to fetch latest draw");
    } catch (error) {
      throw new Error("Failed to fetch latest draw: " + (error as Error).message);
    }
  }

  async getOneDraw(drawNumber: number): Promise<LottoDraw> {
    try {
      const response = await axios.get<DhlotteryResponse>(
        this.getLotteryUrl(drawNumber)
      );
      
      if (response.data.returnValue === "success") {
        return this.convertDhlotteryToLottoDraw(response.data);
      }
      
      throw new Error(`Draw ${drawNumber} not found`);
    } catch (error) {
      throw new Error(`Failed to fetch draw ${drawNumber}: ` + (error as Error).message);
    }
  }

  async getDetailOneDraw(drawNumber: number): Promise<DetailDraw[]> {
    // 동행복권 API에서는 상세 정보를 제공하지 않으므로
    // 기본 정보만 반환하거나 별도 크롤링 필요
    const draw = await this.getOneDraw(drawNumber);
    
    if (!draw) return [];
    
    // 간단한 등수별 정보 계산 (실제 데이터가 없으므로 추정치)
    return [
      {
        rank: 1,
        winnerCount: formatNumberWithCommas(draw.firstPrzwnerCo),
        totalPrize: `${draw.firstAccumamnt.toLocaleString()}원`,
        prizePerWinner: `${draw.firstWinamnt.toLocaleString()}원`,
      },
      // 2-5등은 동행복권 API에서 제공하지 않음
    ] as DetailDraw[];
  }
  
  private convertDhlotteryToLottoDraw(data: DhlotteryResponse): any {
    return {
      id: data.drwNo,
      drwNo: data.drwNo,
      drawNumber: data.drwNo,
      drwtNo1: data.drwtNo1,
      drwtNo2: data.drwtNo2,
      drwtNo3: data.drwtNo3,
      drwtNo4: data.drwtNo4,
      drwtNo5: data.drwtNo5,
      drwtNo6: data.drwtNo6,
      bnusNo: data.bnusNo,
      bonusNumber: data.bnusNo,
      totSellamnt: data.totSellamnt,
      firstAccumamnt: data.firstAccumamnt,
      firstPrzwnerCo: data.firstPrzwnerCo,
      firstWinamnt: data.firstWinamnt,
      drwNoDate: data.drwNoDate,
      date: data.drwNoDate,
      winningNumbers: [
        data.drwtNo1,
        data.drwtNo2,
        data.drwtNo3,
        data.drwtNo4,
        data.drwtNo5,
        data.drwtNo6
      ],
      prizeStatistics: {
        firstPrizeWinnerCount: data.firstPrzwnerCo,
        firstWinAmount: data.firstWinamnt,
        totalSalesAmount: data.totSellamnt,
        firstAccumulatedAmount: data.firstAccumamnt
      }
    };
  }
}
