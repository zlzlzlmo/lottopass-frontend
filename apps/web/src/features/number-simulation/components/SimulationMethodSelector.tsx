'use client';

import React from 'react';
import { SimulationConfig } from '../types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SimulationMethodSelectorProps {
  config: SimulationConfig;
  onConfigChange: (config: Partial<SimulationConfig>) => void;
}

export const SimulationMethodSelector: React.FC<SimulationMethodSelectorProps> = ({
  config,
  onConfigChange
}) => {
  const methodDescriptions = {
    historical: '과거 당첨 번호의 패턴을 분석하여 예측합니다.',
    frequency: '번호별 출현 빈도를 기반으로 가중치를 적용합니다.',
    pattern: '연속번호, 홀짝비율 등 다양한 패턴을 분석합니다.',
    aiPrediction: 'AI 모델을 사용하여 번호를 예측합니다.',
    monteCarlo: '수천 번의 무작위 시뮬레이션으로 최적값을 찾습니다.',
    markovChain: '번호 간 전이 확률을 계산하여 다음 번호를 예측합니다.'
  };
  
  return (
    <div className="space-y-6">
      {/* Method Selection */}
      <div className="space-y-2">
        <Label htmlFor="method">시뮬레이션 방법</Label>
        <Select
          value={config.method}
          onValueChange={(value) => onConfigChange({ method: value as SimulationConfig['method'] })}
        >
          <SelectTrigger id="method">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="historical">과거 데이터 분석</SelectItem>
            <SelectItem value="frequency">빈도 분석</SelectItem>
            <SelectItem value="pattern">패턴 분석</SelectItem>
            <SelectItem value="aiPrediction">AI 예측</SelectItem>
            <SelectItem value="monteCarlo">몬테카를로</SelectItem>
            <SelectItem value="markovChain">마르코프 체인</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {methodDescriptions[config.method]}
        </p>
      </div>
      
      {/* Rounds */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="rounds">시뮬레이션 횟수</Label>
          <span className="text-sm font-medium">{config.rounds}회</span>
        </div>
        <Slider
          id="rounds"
          min={10}
          max={1000}
          step={10}
          value={[config.rounds]}
          onValueChange={([value]) => onConfigChange({ rounds: value })}
        />
        <p className="text-sm text-muted-foreground">
          더 많은 시뮬레이션은 정확도를 높이지만 시간이 오래 걸립니다.
        </p>
      </div>
      
      {/* Use Weighting */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="useWeighting">가중치 사용</Label>
          <p className="text-sm text-muted-foreground">
            통계적 가중치를 적용하여 확률을 조정합니다.
          </p>
        </div>
        <Switch
          id="useWeighting"
          checked={config.useWeighting}
          onCheckedChange={(checked) => onConfigChange({ useWeighting: checked })}
        />
      </div>
      
      {/* Confidence Level */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="confidence">신뢰도 수준</Label>
          <span className="text-sm font-medium">{(config.confidenceLevel! * 100).toFixed(0)}%</span>
        </div>
        <Slider
          id="confidence"
          min={0.5}
          max={1}
          step={0.05}
          value={[config.confidenceLevel!]}
          onValueChange={([value]) => onConfigChange({ confidenceLevel: value })}
        />
      </div>
      
      {/* Historical Data Range */}
      {config.method === 'historical' && (
        <div className="space-y-2">
          <Label>분석 범위</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="startRound" className="text-xs">시작 회차</Label>
              <Input
                id="startRound"
                type="number"
                placeholder="예: 1000"
                value={config.historicalDataRange?.startRound || ''}
                onChange={(e) => onConfigChange({
                  historicalDataRange: {
                    ...config.historicalDataRange,
                    startRound: parseInt(e.target.value) || undefined
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="endRound" className="text-xs">종료 회차</Label>
              <Input
                id="endRound"
                type="number"
                placeholder="예: 1100"
                value={config.historicalDataRange?.endRound || ''}
                onChange={(e) => onConfigChange({
                  historicalDataRange: {
                    ...config.historicalDataRange,
                    endRound: parseInt(e.target.value) || undefined
                  }
                })}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Exclude Numbers */}
      <div className="space-y-2">
        <Label>제외 번호</Label>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => (
            <Badge
              key={num}
              variant={config.excludeNumbers?.includes(num) ? 'destructive' : 'outline'}
              className="cursor-pointer"
              onClick={() => {
                const excluded = config.excludeNumbers || [];
                if (excluded.includes(num)) {
                  onConfigChange({ 
                    excludeNumbers: excluded.filter(n => n !== num) 
                  });
                } else {
                  onConfigChange({ 
                    excludeNumbers: [...excluded, num] 
                  });
                }
              }}
            >
              {num}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Include Numbers */}
      <div className="space-y-2">
        <Label>포함 번호 (고정)</Label>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => (
            <Badge
              key={num}
              variant={config.includeNumbers?.includes(num) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => {
                const included = config.includeNumbers || [];
                if (included.includes(num)) {
                  onConfigChange({ 
                    includeNumbers: included.filter(n => n !== num) 
                  });
                } else if (included.length < 5) {
                  onConfigChange({ 
                    includeNumbers: [...included, num] 
                  });
                }
              }}
            >
              {num}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          최대 5개까지 선택 가능합니다.
        </p>
      </div>
    </div>
  );
};