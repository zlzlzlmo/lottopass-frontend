'use client';

import { useState, useCallback } from 'react';
import { GenerationMethod } from '@lottopass/shared';
import { GenerationConfig, GeneratorResult } from '../types';
import { NumberGenerator } from '../utils';

export function useNumberGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNumbers, setGeneratedNumbers] = useState<GeneratorResult[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [config, setConfig] = useState<GenerationConfig>({
    method: 'random',
    excludeNumbers: [],
    includeNumbers: [],
  });

  const generateNumbers = useCallback(async (
    method: GenerationMethod = config.method,
    customConfig?: Partial<GenerationConfig>
  ) => {
    setIsGenerating(true);
    
    try {
      // 생성 애니메이션을 위한 딜레이
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const finalConfig: GenerationConfig = {
        ...config,
        ...customConfig,
        method,
      };
      
      const result = NumberGenerator.generate(finalConfig);
      setGeneratedNumbers(prev => [result, ...prev.slice(0, 9)]); // 최대 10개 유지
      setSelectedNumbers(result.numbers);
      
      return result;
    } finally {
      setIsGenerating(false);
    }
  }, [config]);

  const updateConfig = useCallback((updates: Partial<GenerationConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const clearHistory = useCallback(() => {
    setGeneratedNumbers([]);
    setSelectedNumbers([]);
  }, []);

  const selectNumbers = useCallback((numbers: number[]) => {
    setSelectedNumbers(numbers);
  }, []);

  return {
    isGenerating,
    generatedNumbers,
    selectedNumbers,
    config,
    generateNumbers,
    updateConfig,
    clearHistory,
    selectNumbers,
  };
}