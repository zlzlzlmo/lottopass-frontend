'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SimulationBatch } from '../types';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface SimulationProgressProps {
  progress: number;
  currentBatch?: SimulationBatch;
}

export const SimulationProgress: React.FC<SimulationProgressProps> = ({
  progress,
  currentBatch
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm font-medium">
            시뮬레이션 진행 중...
          </span>
        </div>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      {currentBatch && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {currentBatch.results.length} / {currentBatch.config.rounds} 완료
          </span>
          <span>
            {currentBatch.config.method === 'historical' && '과거 데이터 분석 중'}
            {currentBatch.config.method === 'frequency' && '빈도 계산 중'}
            {currentBatch.config.method === 'pattern' && '패턴 분석 중'}
            {currentBatch.config.method === 'aiPrediction' && 'AI 모델 실행 중'}
            {currentBatch.config.method === 'monteCarlo' && '몬테카를로 시뮬레이션 중'}
            {currentBatch.config.method === 'markovChain' && '마르코프 체인 계산 중'}
          </span>
        </div>
      )}
    </motion.div>
  );
};