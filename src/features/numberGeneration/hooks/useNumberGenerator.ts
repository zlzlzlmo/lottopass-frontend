import { useState, useCallback } from 'react';
import { useOptimistic } from '@/hooks/useOptimistic';

export interface GeneratedNumbers {
  id: string;
  numbers: number[];
  createdAt: Date;
  algorithm: string;
}

interface NumberGeneratorOptions {
  excludeNumbers?: number[];
  mustInclude?: number[];
  sumRange?: { min: number; max: number };
  consecutiveLimit?: number;
  oddEvenRatio?: { odd: number; even: number };
}

export function useNumberGenerator() {
  const [history, setHistory] = useState<GeneratedNumbers[]>([]);
  const [optimisticHistory, { addOptimistic, commitOptimistic }] = useOptimistic(
    history,
    (current, newItem) => [...current, newItem]
  );

  // 기본 랜덤 생성 알고리즘
  const generateRandom = useCallback((options: NumberGeneratorOptions = {}): number[] => {
    const { excludeNumbers = [], mustInclude = [] } = options;
    const availableNumbers = Array.from({ length: 45 }, (_, i) => i + 1)
      .filter(num => !excludeNumbers.includes(num));
    
    const selectedNumbers = [...mustInclude];
    
    while (selectedNumbers.length < 6) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const num = availableNumbers[randomIndex];
      
      if (!selectedNumbers.includes(num)) {
        selectedNumbers.push(num);
      }
    }
    
    return selectedNumbers.sort((a, b) => a - b);
  }, []);

  // 통계 기반 생성 알고리즘
  const generateStatistical = useCallback(
    async (hotNumbers: number[], coldNumbers: number[]): Promise<number[]> => {
      const numbers: number[] = [];
      
      // 핫 넘버에서 3개 선택
      const hotSelection = hotNumbers.slice(0, 10);
      while (numbers.length < 3 && hotSelection.length > 0) {
        const index = Math.floor(Math.random() * hotSelection.length);
        numbers.push(hotSelection.splice(index, 1)[0]);
      }
      
      // 콜드 넘버에서 1개 선택
      if (coldNumbers.length > 0) {
        const coldIndex = Math.floor(Math.random() * Math.min(5, coldNumbers.length));
        numbers.push(coldNumbers[coldIndex]);
      }
      
      // 나머지는 중간 빈도 번호에서 선택
      const midRange = Array.from({ length: 45 }, (_, i) => i + 1)
        .filter(num => !numbers.includes(num) && !hotNumbers.includes(num) && !coldNumbers.includes(num));
      
      while (numbers.length < 6 && midRange.length > 0) {
        const index = Math.floor(Math.random() * midRange.length);
        numbers.push(midRange.splice(index, 1)[0]);
      }
      
      return numbers.sort((a, b) => a - b);
    },
    []
  );

  // AI 기반 패턴 생성 (황금비율, 피보나치 등)
  const generateAIPattern = useCallback((): number[] => {
    const numbers: number[] = [];
    const patterns = ['fibonacci', 'prime', 'golden'];
    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    switch (selectedPattern) {
      case 'fibonacci': {
        const fib = [1, 2, 3, 5, 8, 13, 21, 34];
        const available = fib.filter(n => n <= 45);
        while (numbers.length < 6 && available.length > 0) {
          const index = Math.floor(Math.random() * available.length);
          numbers.push(available.splice(index, 1)[0]);
        }
        break;
      }
      case 'prime': {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43];
        while (numbers.length < 6) {
          const index = Math.floor(Math.random() * primes.length);
          const prime = primes[index];
          if (!numbers.includes(prime)) {
            numbers.push(prime);
          }
        }
        break;
      }
      case 'golden': {
        // 황금비율 기반 번호 생성
        const golden = 1.618;
        let current = Math.floor(Math.random() * 10) + 1;
        while (numbers.length < 6) {
          current = Math.floor(current * golden) % 45 + 1;
          if (!numbers.includes(current) && current <= 45) {
            numbers.push(current);
          } else {
            current = Math.floor(Math.random() * 10) + 1;
          }
        }
        break;
      }
    }
    
    // 부족한 번호는 랜덤으로 채우기
    while (numbers.length < 6) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    
    return numbers.sort((a, b) => a - b);
  }, []);

  // 번호 생성 메인 함수
  const generateNumbers = useCallback(
    async (algorithm: 'random' | 'statistical' | 'ai', options?: any) => {
      let numbers: number[];
      
      switch (algorithm) {
        case 'statistical':
          numbers = await generateStatistical(options.hotNumbers || [], options.coldNumbers || []);
          break;
        case 'ai':
          numbers = generateAIPattern();
          break;
        default:
          numbers = generateRandom(options);
      }
      
      const newItem: GeneratedNumbers = {
        id: Date.now().toString(),
        numbers,
        createdAt: new Date(),
        algorithm,
      };
      
      // Optimistic update
      addOptimistic(newItem);
      
      // 실제 업데이트
      setTimeout(() => {
        setHistory(prev => [...prev, newItem]);
        commitOptimistic([...history, newItem]);
      }, 100);
      
      return numbers;
    },
    [generateRandom, generateStatistical, generateAIPattern, history, addOptimistic, commitOptimistic]
  );

  // 번호 검증
  const validateNumbers = useCallback((numbers: number[]): boolean => {
    if (numbers.length !== 6) return false;
    if (new Set(numbers).size !== 6) return false;
    if (numbers.some(n => n < 1 || n > 45)) return false;
    return true;
  }, []);

  return {
    generateNumbers,
    history: optimisticHistory,
    clearHistory: () => setHistory([]),
    validateNumbers,
  };
}