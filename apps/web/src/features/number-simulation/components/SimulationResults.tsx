'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SimulationBatch, SimulationResult } from '../types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Trophy, 
  TrendingUp, 
  Brain, 
  Sparkles,
  Clock,
  CheckCircle
} from 'lucide-react';

interface SimulationResultsProps {
  batch: SimulationBatch;
  onSelectResult: (result: SimulationResult) => void;
  selectedResult?: SimulationResult;
  compact?: boolean;
}

export const SimulationResults: React.FC<SimulationResultsProps> = ({
  batch,
  onSelectResult,
  selectedResult,
  compact = false
}) => {
  // Get top results by confidence
  const topResults = [...batch.results]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, compact ? 3 : 5);
  
  const methodIcons = {
    historical: Clock,
    frequency: TrendingUp,
    pattern: Sparkles,
    aiPrediction: Brain,
    monteCarlo: Trophy,
    markovChain: CheckCircle
  };
  
  const MethodIcon = methodIcons[batch.config.method];
  
  return (
    <div className="space-y-3">
      {!compact && (
        <div className="flex items-center justify-between">
          <h4 className="font-semibold flex items-center gap-2">
            <MethodIcon className="h-4 w-4" />
            시뮬레이션 결과
          </h4>
          <Badge variant="outline">
            {batch.results.length}개 생성됨
          </Badge>
        </div>
      )}
      
      <div className="space-y-2">
        {topResults.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={cn(
                "p-3 cursor-pointer transition-all hover:shadow-md",
                selectedResult?.id === result.id && "ring-2 ring-primary"
              )}
              onClick={() => onSelectResult(result)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {index === 0 && !compact && (
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm font-medium">
                      #{index + 1} 추천
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      신뢰도 {(result.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  {result.numbers.map((num) => (
                    <div
                      key={num}
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold",
                        "bg-gradient-to-br transition-all",
                        num <= 10 && "from-yellow-400 to-yellow-500 text-white",
                        num > 10 && num <= 20 && "from-blue-400 to-blue-500 text-white",
                        num > 20 && num <= 30 && "from-red-400 to-red-500 text-white",
                        num > 30 && num <= 40 && "from-gray-400 to-gray-500 text-white",
                        num > 40 && "from-green-400 to-green-500 text-white"
                      )}
                    >
                      {num}
                    </div>
                  ))}
                </div>
                
                {!compact && result.reasoning && result.reasoning.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      {result.reasoning[0]}
                    </p>
                  </div>
                )}
                
                {!compact && result.historicalMatches && result.historicalMatches.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3" />
                    <span>
                      과거 {result.historicalMatches[0].matchCount}개 일치 
                      ({result.historicalMatches[0].round}회차)
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {!compact && batch.results.length > 5 && (
        <div className="text-center pt-2">
          <Button variant="ghost" size="sm">
            더 보기 ({batch.results.length - 5}개)
          </Button>
        </div>
      )}
    </div>
  );
};