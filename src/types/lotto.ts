export interface LottoDraw {
  id: number;
  drwNo: number;
  drwtNo1: number;
  drwtNo2: number;
  drwtNo3: number;
  drwtNo4: number;
  drwtNo5: number;
  drwtNo6: number;
  bnusNo: number;
  totSellamnt: number;
  drwNoDate: string;
  firstAccumamnt: number;
  firstPrzwnerCo: number;
  firstWinamnt: number;
}

export interface DetailDraw extends LottoDraw {
  returnValue: string;
  drwtNoAsc: number[];
  drwtNoWithBnus: number[];
}

export interface FindAllResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}