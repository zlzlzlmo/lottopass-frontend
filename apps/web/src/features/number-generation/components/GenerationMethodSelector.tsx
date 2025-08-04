'use client';

import React from 'react';
import { GenerationMethod } from '@lottopass/shared';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  BarChart3, 
  Binary, 
  ArrowUpDown, 
  Grid3x3, 
  Link2,
  Shuffle,
  Brain
} from 'lucide-react';

interface GenerationMethodSelectorProps {
  value: GenerationMethod;
  onChange: (method: GenerationMethod) => void;
  className?: string;
}

const methods: {
  value: GenerationMethod;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: 'random',
    label: '완전 무작위',
    description: '순수한 랜덤 생성',
    icon: Shuffle,
  },
  {
    value: 'statistical',
    label: '통계 기반',
    description: '과거 당첨 빈도 분석',
    icon: BarChart3,
  },
  {
    value: 'evenOdd',
    label: '홀짝 균형',
    description: '홀수/짝수 비율 조정',
    icon: Binary,
  },
  {
    value: 'highLow',
    label: '고저 균형',
    description: '고구간/저구간 분배',
    icon: ArrowUpDown,
  },
  {
    value: 'pattern',
    label: '패턴 분석',
    description: '특정 패턴 기반',
    icon: Grid3x3,
  },
  {
    value: 'consecutive',
    label: '연속 번호',
    description: '연속된 번호 포함',
    icon: Link2,
  },
  {
    value: 'ai',
    label: 'AI 추천',
    description: '인공지능 분석',
    icon: Brain,
  },
];

export function GenerationMethodSelector({ 
  value, 
  onChange, 
  className 
}: GenerationMethodSelectorProps) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3', className)}>
      {methods.map((method) => {
        const Icon = method.icon;
        const isSelected = value === method.value;
        const isDisabled = method.value === 'ai'; // AI는 아직 미구현
        
        return (
          <Button
            key={method.value}
            variant={isSelected ? 'default' : 'outline'}
            className={cn(
              'h-auto flex-col gap-2 p-4 transition-all',
              isSelected && 'ring-2 ring-primary ring-offset-2',
              isDisabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => !isDisabled && onChange(method.value)}
            disabled={isDisabled}
          >
            <Icon className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">{method.label}</div>
              <div className="text-xs opacity-80">{method.description}</div>
            </div>
          </Button>
        );
      })}
    </div>
  );
}