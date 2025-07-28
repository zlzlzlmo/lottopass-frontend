export interface LottoDraw {
  drwNo: number;
  drwNoDate: string;
  drwtNo1: number;
  drwtNo2: number;
  drwtNo3: number;
  drwtNo4: number;
  drwtNo5: number;
  drwtNo6: number;
  bnusNo: number;
  totSellamnt: number;
  returnValue: string;
  firstWinamnt: number;
  firstPrzwnerCo: number;
  firstAccumamnt: number;
}

export interface LottoNumber {
  number: number;
  isBonus?: boolean;
}

export interface GeneratedNumbers {
  numbers: number[];
  method: GenerationMethod;
  createdAt: string;
  id: string;
}

export type GenerationMethod = 
  | 'random'
  | 'statistical'
  | 'pattern'
  | 'ai'
  | 'custom'
  | 'evenOdd'
  | 'highLow'
  | 'consecutive';

export interface NumberStatistics {
  number: number;
  frequency: number;
  lastDrawn: number;
  averageGap: number;
  isHot: boolean;
  isCold: boolean;
}

export interface DrawStatistics {
  totalDraws: number;
  numberFrequencies: Record<number, number>;
  consecutivePatterns: number[];
  sumRanges: {
    min: number;
    max: number;
    average: number;
  };
  oddEvenRatio: {
    odd: number;
    even: number;
  };
  highLowRatio: {
    high: number;
    low: number;
  };
}