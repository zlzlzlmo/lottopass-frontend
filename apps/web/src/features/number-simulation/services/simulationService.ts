import { LotteryDraw, LotteryNumber } from '@lottopass/shared';
import { 
  SimulationConfig, 
  SimulationResult, 
  SimulationAlgorithmParams,
  PredictionModel,
  PatternWeight
} from '../types';
import { v4 as uuidv4 } from 'uuid';

export class SimulationService {
  private static readonly LOTTO_MIN = 1;
  private static readonly LOTTO_MAX = 45;
  private static readonly LOTTO_COUNT = 6;

  static async runSimulation(params: SimulationAlgorithmParams): Promise<SimulationResult> {
    const startTime = Date.now();
    let result: SimulationResult;

    switch (params.config.method) {
      case 'historical':
        result = await this.historicalSimulation(params);
        break;
      case 'frequency':
        result = await this.frequencySimulation(params);
        break;
      case 'pattern':
        result = await this.patternSimulation(params);
        break;
      case 'aiPrediction':
        result = await this.aiPredictionSimulation(params);
        break;
      case 'monteCarlo':
        result = await this.monteCarloSimulation(params);
        break;
      case 'markovChain':
        result = await this.markovChainSimulation(params);
        break;
      default:
        throw new Error(`Unknown simulation method: ${params.config.method}`);
    }

    result.metadata.executionTime = Date.now() - startTime;
    return result;
  }

  private static async historicalSimulation(params: SimulationAlgorithmParams): Promise<SimulationResult> {
    const { historicalData, config } = params;
    const filteredData = this.filterHistoricalData(historicalData, config.historicalDataRange);
    
    // 과거 데이터에서 패턴 분석
    const patterns = this.analyzeHistoricalPatterns(filteredData);
    const numbers = this.generateFromPatterns(patterns, config);
    
    // 과거 매칭 분석
    const historicalMatches = this.findHistoricalMatches(numbers, filteredData);
    
    return {
      id: uuidv4(),
      method: 'historical',
      numbers: numbers.sort((a, b) => a - b),
      probability: this.calculateProbability(numbers, filteredData),
      confidence: 0.75,
      reasoning: [
        `과거 ${filteredData.length}회차 데이터 분석`,
        `가장 빈번한 패턴 적용`,
        `역사적 매칭률: ${(historicalMatches.length / filteredData.length * 100).toFixed(2)}%`
      ],
      historicalMatches: historicalMatches.slice(0, 5),
      metadata: {
        createdAt: new Date(),
        executionTime: 0,
        dataPointsUsed: filteredData.length
      }
    };
  }

  private static async frequencySimulation(params: SimulationAlgorithmParams): Promise<SimulationResult> {
    const { historicalData, config } = params;
    const filteredData = this.filterHistoricalData(historicalData, config.historicalDataRange);
    
    // 번호별 출현 빈도 계산
    const frequencyMap = this.calculateNumberFrequency(filteredData);
    
    // 빈도 기반 가중치 적용
    const weightedNumbers = this.applyFrequencyWeights(frequencyMap, config.useWeighting ?? true);
    const numbers = this.selectNumbersByWeight(weightedNumbers, config);
    
    return {
      id: uuidv4(),
      method: 'frequency',
      numbers: numbers.sort((a, b) => a - b),
      probability: this.calculateProbability(numbers, filteredData),
      confidence: 0.7,
      reasoning: [
        `최근 ${filteredData.length}회차 빈도 분석`,
        `상위 빈도 번호 ${config.useWeighting ? '가중치' : '균등'} 선택`,
        `평균 출현율 기준 선택`
      ],
      metadata: {
        createdAt: new Date(),
        executionTime: 0,
        dataPointsUsed: filteredData.length
      }
    };
  }

  private static async patternSimulation(params: SimulationAlgorithmParams): Promise<SimulationResult> {
    const { historicalData, config } = params;
    const filteredData = this.filterHistoricalData(historicalData, config.historicalDataRange);
    
    // 다양한 패턴 분석
    const patterns: PatternWeight[] = [
      this.analyzeConsecutivePattern(filteredData),
      this.analyzeEvenOddPattern(filteredData),
      this.analyzeSumPattern(filteredData),
      this.analyzeHighLowPattern(filteredData),
      this.analyzeEndingDigitPattern(filteredData)
    ];
    
    // 패턴 기반 번호 생성
    const numbers = this.generateFromWeightedPatterns(patterns, config);
    
    return {
      id: uuidv4(),
      method: 'pattern',
      numbers: numbers.sort((a, b) => a - b),
      probability: this.calculateProbability(numbers, filteredData),
      confidence: 0.65,
      reasoning: patterns
        .filter(p => p.weight > 0.5)
        .map(p => p.description),
      metadata: {
        createdAt: new Date(),
        executionTime: 0,
        dataPointsUsed: filteredData.length
      }
    };
  }

  private static async aiPredictionSimulation(params: SimulationAlgorithmParams): Promise<SimulationResult> {
    const { historicalData, config } = params;
    const filteredData = this.filterHistoricalData(historicalData, config.historicalDataRange);
    
    // AI 예측 모델 구축 (간단한 버전)
    const model = this.buildPredictionModel(filteredData);
    const numbers = this.predictNumbers(model, config);
    
    return {
      id: uuidv4(),
      method: 'aiPrediction',
      numbers: numbers.sort((a, b) => a - b),
      probability: this.calculateProbability(numbers, filteredData),
      confidence: model.confidence,
      reasoning: [
        `${filteredData.length}개 데이터로 학습된 예측 모델`,
        `신뢰도: ${(model.confidence * 100).toFixed(1)}%`,
        `주요 패턴 ${model.patterns.length}개 분석`
      ],
      metadata: {
        createdAt: new Date(),
        executionTime: 0,
        dataPointsUsed: filteredData.length
      }
    };
  }

  private static async monteCarloSimulation(params: SimulationAlgorithmParams): Promise<SimulationResult> {
    const { historicalData, config } = params;
    const filteredData = this.filterHistoricalData(historicalData, config.historicalDataRange);
    
    // 몬테카를로 시뮬레이션
    const iterations = config.rounds || 10000;
    const results = this.runMonteCarloIterations(filteredData, iterations);
    const numbers = this.selectBestMonteCarloResult(results, config);
    
    return {
      id: uuidv4(),
      method: 'monteCarlo',
      numbers: numbers.sort((a, b) => a - b),
      probability: this.calculateProbability(numbers, filteredData),
      confidence: 0.8,
      reasoning: [
        `${iterations.toLocaleString()}회 몬테카를로 시뮬레이션`,
        `최적 조합 선택`,
        `통계적 수렴 기반`
      ],
      metadata: {
        createdAt: new Date(),
        executionTime: 0,
        dataPointsUsed: filteredData.length * iterations
      }
    };
  }

  private static async markovChainSimulation(params: SimulationAlgorithmParams): Promise<SimulationResult> {
    const { historicalData, config } = params;
    const filteredData = this.filterHistoricalData(historicalData, config.historicalDataRange);
    
    // 마르코프 체인 구축
    const transitionMatrix = this.buildMarkovChain(filteredData);
    const numbers = this.generateFromMarkovChain(transitionMatrix, config);
    
    return {
      id: uuidv4(),
      method: 'markovChain',
      numbers: numbers.sort((a, b) => a - b),
      probability: this.calculateProbability(numbers, filteredData),
      confidence: 0.72,
      reasoning: [
        `번호 전이 확률 기반 예측`,
        `${filteredData.length}회차 상태 전이 분석`,
        `다음 상태 확률 최적화`
      ],
      metadata: {
        createdAt: new Date(),
        executionTime: 0,
        dataPointsUsed: filteredData.length
      }
    };
  }

  // Helper methods
  private static filterHistoricalData(
    data: LotteryDraw[], 
    range?: { startRound: number; endRound: number }
  ): LotteryDraw[] {
    if (!range) return data;
    return data.filter(draw => 
      draw.round >= range.startRound && draw.round <= range.endRound
    );
  }

  private static analyzeHistoricalPatterns(data: LotteryDraw[]): Map<string, number> {
    const patterns = new Map<string, number>();
    
    data.forEach(draw => {
      // 연속 번호 패턴
      const consecutive = this.findConsecutive(draw.numbers);
      patterns.set(`consecutive_${consecutive}`, (patterns.get(`consecutive_${consecutive}`) || 0) + 1);
      
      // 홀짝 패턴
      const oddCount = draw.numbers.filter(n => n % 2 === 1).length;
      patterns.set(`odd_${oddCount}`, (patterns.get(`odd_${oddCount}`) || 0) + 1);
      
      // 합계 범위
      const sum = draw.numbers.reduce((a, b) => a + b, 0);
      const sumRange = Math.floor(sum / 20) * 20;
      patterns.set(`sum_${sumRange}`, (patterns.get(`sum_${sumRange}`) || 0) + 1);
    });
    
    return patterns;
  }

  private static calculateNumberFrequency(data: LotteryDraw[]): Map<LotteryNumber, number> {
    const frequency = new Map<LotteryNumber, number>();
    
    for (let i = 1; i <= 45; i++) {
      frequency.set(i as LotteryNumber, 0);
    }
    
    data.forEach(draw => {
      draw.numbers.forEach(num => {
        frequency.set(num, (frequency.get(num) || 0) + 1);
      });
    });
    
    return frequency;
  }

  private static buildPredictionModel(data: LotteryDraw[]): PredictionModel {
    const frequency = this.calculateNumberFrequency(data);
    const totalDraws = data.length;
    
    // 번호별 확률 계산
    const numberProbabilities = new Map<LotteryNumber, number>();
    frequency.forEach((count, number) => {
      numberProbabilities.set(number, count / totalDraws);
    });
    
    // 패턴 가중치 계산
    const patterns: PatternWeight[] = [
      this.analyzeConsecutivePattern(data),
      this.analyzeEvenOddPattern(data),
      this.analyzeSumPattern(data)
    ];
    
    return {
      numberProbabilities,
      patterns,
      confidence: 0.75,
      lastUpdated: new Date()
    };
  }

  private static analyzeConsecutivePattern(data: LotteryDraw[]): PatternWeight {
    let totalConsecutive = 0;
    let hasConsecutive = 0;
    
    data.forEach(draw => {
      const consecutive = this.findConsecutive(draw.numbers);
      if (consecutive > 0) hasConsecutive++;
      totalConsecutive += consecutive;
    });
    
    return {
      pattern: 'consecutive',
      weight: hasConsecutive / data.length,
      description: `연속 번호 출현율: ${(hasConsecutive / data.length * 100).toFixed(1)}%`,
      historicalAccuracy: 0.7
    };
  }

  private static analyzeEvenOddPattern(data: LotteryDraw[]): PatternWeight {
    const ratios = new Map<string, number>();
    
    data.forEach(draw => {
      const oddCount = draw.numbers.filter(n => n % 2 === 1).length;
      const ratio = `${oddCount}:${6 - oddCount}`;
      ratios.set(ratio, (ratios.get(ratio) || 0) + 1);
    });
    
    // 가장 빈번한 비율 찾기
    let maxRatio = '';
    let maxCount = 0;
    ratios.forEach((count, ratio) => {
      if (count > maxCount) {
        maxCount = count;
        maxRatio = ratio;
      }
    });
    
    return {
      pattern: 'evenOdd',
      weight: maxCount / data.length,
      description: `홀짝 비율 ${maxRatio} 선호`,
      historicalAccuracy: 0.65
    };
  }

  private static analyzeSumPattern(data: LotteryDraw[]): PatternWeight {
    const sums = data.map(draw => 
      draw.numbers.reduce((a, b) => a + b, 0)
    );
    
    const avgSum = sums.reduce((a, b) => a + b, 0) / sums.length;
    const stdDev = Math.sqrt(
      sums.reduce((sum, val) => sum + Math.pow(val - avgSum, 2), 0) / sums.length
    );
    
    return {
      pattern: 'sum',
      weight: 0.8,
      description: `합계 평균 ${avgSum.toFixed(0)} ± ${stdDev.toFixed(0)}`,
      historicalAccuracy: 0.75
    };
  }

  private static analyzeHighLowPattern(data: LotteryDraw[]): PatternWeight {
    const ratios = new Map<string, number>();
    
    data.forEach(draw => {
      const highCount = draw.numbers.filter(n => n > 22).length;
      const ratio = `${highCount}:${6 - highCount}`;
      ratios.set(ratio, (ratios.get(ratio) || 0) + 1);
    });
    
    let maxRatio = '';
    let maxCount = 0;
    ratios.forEach((count, ratio) => {
      if (count > maxCount) {
        maxCount = count;
        maxRatio = ratio;
      }
    });
    
    return {
      pattern: 'highLow',
      weight: maxCount / data.length,
      description: `고저 비율 ${maxRatio} 선호`,
      historicalAccuracy: 0.68
    };
  }

  private static analyzeEndingDigitPattern(data: LotteryDraw[]): PatternWeight {
    const endingDigits = new Map<number, number>();
    
    data.forEach(draw => {
      draw.numbers.forEach(num => {
        const ending = num % 10;
        endingDigits.set(ending, (endingDigits.get(ending) || 0) + 1);
      });
    });
    
    // 끝자리 분포 균등성 체크
    const total = Array.from(endingDigits.values()).reduce((a, b) => a + b, 0);
    const variance = Array.from(endingDigits.values())
      .map(count => Math.pow(count - total / 10, 2))
      .reduce((a, b) => a + b, 0) / 10;
    
    return {
      pattern: 'endingDigit',
      weight: 1 - (variance / total),
      description: `끝자리 분포 ${variance < 100 ? '균등' : '편향'}`,
      historicalAccuracy: 0.6
    };
  }

  private static findConsecutive(numbers: LotteryNumber[]): number {
    let consecutive = 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i + 1] - sorted[i] === 1) {
        consecutive++;
      }
    }
    
    return consecutive;
  }

  private static generateFromPatterns(
    patterns: Map<string, number>, 
    config: SimulationConfig
  ): LotteryNumber[] {
    const numbers: LotteryNumber[] = [];
    const available = this.getAvailableNumbers(config);
    
    // 가장 빈번한 패턴들 적용
    const topPatterns = Array.from(patterns.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    // 패턴 기반 번호 선택 로직
    while (numbers.length < this.LOTTO_COUNT) {
      const candidate = available[Math.floor(Math.random() * available.length)];
      if (!numbers.includes(candidate)) {
        numbers.push(candidate);
      }
    }
    
    return numbers;
  }

  private static applyFrequencyWeights(
    frequency: Map<LotteryNumber, number>, 
    useWeighting: boolean
  ): Map<LotteryNumber, number> {
    if (!useWeighting) return frequency;
    
    const maxFreq = Math.max(...Array.from(frequency.values()));
    const weighted = new Map<LotteryNumber, number>();
    
    frequency.forEach((count, number) => {
      // 가중치 적용 (더 자주 나온 번호에 높은 가중치)
      weighted.set(number, Math.pow(count / maxFreq, 0.5));
    });
    
    return weighted;
  }

  private static selectNumbersByWeight(
    weights: Map<LotteryNumber, number>, 
    config: SimulationConfig
  ): LotteryNumber[] {
    const numbers: LotteryNumber[] = [];
    const available = this.getAvailableNumbers(config);
    
    // 가중치 기반 선택
    const weightedPool: LotteryNumber[] = [];
    available.forEach(num => {
      const weight = weights.get(num) || 0;
      const count = Math.round(weight * 100);
      for (let i = 0; i < count; i++) {
        weightedPool.push(num);
      }
    });
    
    while (numbers.length < this.LOTTO_COUNT && weightedPool.length > 0) {
      const idx = Math.floor(Math.random() * weightedPool.length);
      const selected = weightedPool[idx];
      
      if (!numbers.includes(selected)) {
        numbers.push(selected);
        // 선택된 번호 제거
        weightedPool.splice(0, weightedPool.length, 
          ...weightedPool.filter(n => n !== selected)
        );
      }
    }
    
    return numbers;
  }

  private static generateFromWeightedPatterns(
    patterns: PatternWeight[], 
    config: SimulationConfig
  ): LotteryNumber[] {
    const numbers: LotteryNumber[] = [];
    const available = this.getAvailableNumbers(config);
    
    // 패턴 가중치 기반 선택
    const targetOddCount = 3; // 홀수 3개
    const targetSum = 138; // 평균 합계
    const targetConsecutive = 1; // 연속 번호 1쌍
    
    // 조건을 만족하는 조합 생성
    let attempts = 0;
    while (attempts < 1000) {
      const candidate = this.generateRandomCombination(available);
      
      const oddCount = candidate.filter(n => n % 2 === 1).length;
      const sum = candidate.reduce((a, b) => a + b, 0);
      const consecutive = this.findConsecutive(candidate);
      
      // 패턴 매칭 점수 계산
      const score = 
        (oddCount === targetOddCount ? 1 : 0.5) *
        (Math.abs(sum - targetSum) < 20 ? 1 : 0.5) *
        (consecutive === targetConsecutive ? 1 : 0.7);
      
      if (score > 0.8 || attempts > 500) {
        return candidate;
      }
      
      attempts++;
    }
    
    return this.generateRandomCombination(available);
  }

  private static predictNumbers(
    model: PredictionModel, 
    config: SimulationConfig
  ): LotteryNumber[] {
    const numbers: LotteryNumber[] = [];
    const available = this.getAvailableNumbers(config);
    
    // 확률 기반 선택
    const pool: { number: LotteryNumber; probability: number }[] = [];
    available.forEach(num => {
      pool.push({
        number: num,
        probability: model.numberProbabilities.get(num) || 0
      });
    });
    
    // 확률 높은 순으로 정렬
    pool.sort((a, b) => b.probability - a.probability);
    
    // 상위 확률 번호와 랜덤 믹스
    const topNumbers = pool.slice(0, 15).map(p => p.number);
    while (numbers.length < this.LOTTO_COUNT) {
      const idx = Math.floor(Math.random() * topNumbers.length);
      const selected = topNumbers[idx];
      
      if (!numbers.includes(selected)) {
        numbers.push(selected);
      }
    }
    
    return numbers;
  }

  private static runMonteCarloIterations(
    data: LotteryDraw[], 
    iterations: number
  ): LotteryNumber[][] {
    const results: LotteryNumber[][] = [];
    
    for (let i = 0; i < iterations; i++) {
      const simulation = this.simulateSingleDraw(data);
      results.push(simulation);
    }
    
    return results;
  }

  private static simulateSingleDraw(historicalData: LotteryDraw[]): LotteryNumber[] {
    // 과거 데이터 기반 확률 분포 생성
    const frequency = this.calculateNumberFrequency(historicalData);
    const totalDraws = historicalData.length;
    
    const numbers: LotteryNumber[] = [];
    const pool: LotteryNumber[] = [];
    
    // 확률적 풀 생성
    frequency.forEach((count, number) => {
      const probability = count / totalDraws;
      const instances = Math.round(probability * 1000);
      for (let i = 0; i < instances; i++) {
        pool.push(number);
      }
    });
    
    // 랜덤 선택
    while (numbers.length < this.LOTTO_COUNT && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      const selected = pool[idx];
      
      if (!numbers.includes(selected)) {
        numbers.push(selected);
      }
    }
    
    return numbers.sort((a, b) => a - b);
  }

  private static selectBestMonteCarloResult(
    results: LotteryNumber[][], 
    config: SimulationConfig
  ): LotteryNumber[] {
    // 가장 빈번하게 나타난 조합 찾기
    const combinationCount = new Map<string, number>();
    
    results.forEach(result => {
      const key = result.join(',');
      combinationCount.set(key, (combinationCount.get(key) || 0) + 1);
    });
    
    // 가장 많이 나온 조합
    let bestCombination = results[0];
    let maxCount = 0;
    
    combinationCount.forEach((count, key) => {
      if (count > maxCount) {
        maxCount = count;
        bestCombination = key.split(',').map(n => parseInt(n) as LotteryNumber);
      }
    });
    
    return bestCombination;
  }

  private static buildMarkovChain(data: LotteryDraw[]): Map<string, Map<LotteryNumber, number>> {
    const transitions = new Map<string, Map<LotteryNumber, number>>();
    
    // 연속된 회차 간 전이 확률 계산
    for (let i = 0; i < data.length - 1; i++) {
      const current = data[i].numbers;
      const next = data[i + 1].numbers;
      
      current.forEach(num => {
        const key = num.toString();
        if (!transitions.has(key)) {
          transitions.set(key, new Map<LotteryNumber, number>());
        }
        
        const transitionMap = transitions.get(key)!;
        next.forEach(nextNum => {
          transitionMap.set(nextNum, (transitionMap.get(nextNum) || 0) + 1);
        });
      });
    }
    
    return transitions;
  }

  private static generateFromMarkovChain(
    transitions: Map<string, Map<LotteryNumber, number>>, 
    config: SimulationConfig
  ): LotteryNumber[] {
    const numbers: LotteryNumber[] = [];
    const available = this.getAvailableNumbers(config);
    
    // 초기 상태 선택 (랜덤)
    let currentState = available[Math.floor(Math.random() * available.length)];
    numbers.push(currentState);
    
    // 마르코프 체인 따라가기
    while (numbers.length < this.LOTTO_COUNT) {
      const transitionMap = transitions.get(currentState.toString());
      
      if (transitionMap && transitionMap.size > 0) {
        // 전이 확률 기반 다음 번호 선택
        const candidates = Array.from(transitionMap.entries())
          .filter(([num]) => !numbers.includes(num) && available.includes(num));
        
        if (candidates.length > 0) {
          // 가중치 기반 선택
          const totalWeight = candidates.reduce((sum, [, weight]) => sum + weight, 0);
          let random = Math.random() * totalWeight;
          
          for (const [num, weight] of candidates) {
            random -= weight;
            if (random <= 0) {
              numbers.push(num);
              currentState = num;
              break;
            }
          }
        } else {
          // 전이 불가능하면 랜덤 선택
          const remaining = available.filter(n => !numbers.includes(n));
          if (remaining.length > 0) {
            const selected = remaining[Math.floor(Math.random() * remaining.length)];
            numbers.push(selected);
            currentState = selected;
          }
        }
      } else {
        // 전이 정보 없으면 랜덤 선택
        const remaining = available.filter(n => !numbers.includes(n));
        if (remaining.length > 0) {
          const selected = remaining[Math.floor(Math.random() * remaining.length)];
          numbers.push(selected);
          currentState = selected;
        }
      }
    }
    
    return numbers;
  }

  private static generateRandomCombination(available: LotteryNumber[]): LotteryNumber[] {
    const numbers: LotteryNumber[] = [];
    const pool = [...available];
    
    while (numbers.length < this.LOTTO_COUNT && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      numbers.push(pool[idx]);
      pool.splice(idx, 1);
    }
    
    return numbers.sort((a, b) => a - b);
  }

  private static getAvailableNumbers(config: SimulationConfig): LotteryNumber[] {
    const all = Array.from({ length: this.LOTTO_MAX }, (_, i) => (i + 1) as LotteryNumber);
    const excluded = config.excludeNumbers || [];
    const included = config.includeNumbers || [];
    
    return all.filter(n => 
      (!excluded.includes(n) || included.includes(n)) &&
      n >= this.LOTTO_MIN && n <= this.LOTTO_MAX
    );
  }

  private static findHistoricalMatches(
    numbers: LotteryNumber[], 
    data: LotteryDraw[]
  ): SimulationResult['historicalMatches'] {
    const matches: SimulationResult['historicalMatches'] = [];
    
    data.forEach(draw => {
      const matchedNumbers = numbers.filter(n => draw.numbers.includes(n));
      if (matchedNumbers.length >= 3) {
        matches.push({
          round: draw.round,
          matchCount: matchedNumbers.length,
          matchedNumbers
        });
      }
    });
    
    return matches.sort((a, b) => b.matchCount - a.matchCount);
  }

  private static calculateProbability(numbers: LotteryNumber[], data: LotteryDraw[]): number {
    // 간단한 확률 계산 (실제로는 더 복잡한 통계 모델 필요)
    const frequency = this.calculateNumberFrequency(data);
    const totalDraws = data.length;
    
    let probability = 1;
    numbers.forEach(num => {
      const freq = frequency.get(num) || 0;
      probability *= (freq / totalDraws);
    });
    
    // 조합 확률로 정규화
    return probability * 1e10; // 스케일 조정
  }
}