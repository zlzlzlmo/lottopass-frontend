import { GenerationMethod } from '@lottopass/shared';

export interface GenerationConfig {
  method: GenerationMethod;
  excludeNumbers?: number[];
  includeNumbers?: number[];
  sumRange?: {
    min: number;
    max: number;
  };
  oddEvenRatio?: {
    odd: number;
    even: number;
  };
  highLowRatio?: {
    high: number;
    low: number;
  };
  consecutiveLimit?: number;
}

export interface GeneratorResult {
  numbers: number[];
  method: GenerationMethod;
  statistics?: {
    sum: number;
    oddCount: number;
    evenCount: number;
    highCount: number;
    lowCount: number;
    consecutivePairs: number;
  };
}

export interface NumberGeneratorState {
  isGenerating: boolean;
  generatedNumbers: GeneratorResult[];
  selectedNumbers: number[];
  config: GenerationConfig;
}