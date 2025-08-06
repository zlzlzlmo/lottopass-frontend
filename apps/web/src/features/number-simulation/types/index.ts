import { LotteryDraw, LotteryNumber } from '@lottopass/shared';

export type SimulationMethod = 
  | 'historical' // 과거 데이터 기반
  | 'frequency' // 빈도 분석
  | 'pattern' // 패턴 분석
  | 'aiPrediction' // AI 예측
  | 'monteCarlo' // 몬테카를로 시뮬레이션
  | 'markovChain'; // 마르코프 체인

export interface SimulationConfig {
  method: SimulationMethod;
  rounds: number; // 시뮬레이션 실행 횟수
  historicalDataRange?: {
    startRound: number;
    endRound: number;
  };
  useWeighting?: boolean; // 가중치 사용 여부
  confidenceLevel?: number; // 신뢰도 (0-1)
  excludeNumbers?: LotteryNumber[];
  includeNumbers?: LotteryNumber[];
}

export interface SimulationResult {
  id: string;
  method: SimulationMethod;
  numbers: LotteryNumber[];
  probability: number; // 예상 확률
  confidence: number; // 신뢰도
  reasoning: string[]; // 선택 이유
  historicalMatches?: {
    round: number;
    matchCount: number;
    matchedNumbers: LotteryNumber[];
  }[];
  metadata: {
    createdAt: Date;
    executionTime: number; // ms
    dataPointsUsed: number;
  };
}

export interface SimulationStatistics {
  totalSimulations: number;
  successRate: number;
  averageMatchCount: number;
  bestResult: SimulationResult;
  numberFrequency: Map<LotteryNumber, number>;
  patternAnalysis: {
    consecutivePairs: number;
    evenOddRatio: { even: number; odd: number };
    sumRange: { min: number; max: number; average: number };
    highLowRatio: { high: number; low: number };
  };
}

export interface SimulationBatch {
  id: string;
  config: SimulationConfig;
  results: SimulationResult[];
  statistics: SimulationStatistics;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number; // 0-100
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export interface NumberSimulationState {
  isSimulating: boolean;
  currentBatch?: SimulationBatch;
  history: SimulationBatch[];
  selectedResult?: SimulationResult;
  config: SimulationConfig;
  historicalData: LotteryDraw[];
}

export interface SimulationAlgorithmParams {
  historicalData: LotteryDraw[];
  config: SimulationConfig;
  round?: number; // 특정 회차 시뮬레이션
}

export interface PatternWeight {
  pattern: string;
  weight: number;
  description: string;
  historicalAccuracy: number;
}

export interface PredictionModel {
  numberProbabilities: Map<LotteryNumber, number>;
  patterns: PatternWeight[];
  confidence: number;
  lastUpdated: Date;
}