import React from 'react';
import { cn } from '@/lib/utils';

interface LottoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LottoBall({ number, size = 'md', className }: LottoBallProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl',
  };

  const getBallClasses = (num: number) => {
    // 한국 로또 공식 색상에 가깝게 조정
    if (num <= 10) {
      // 노란색 - 진한 색상과 어두운 텍스트
      return 'bg-gradient-to-b from-yellow-300 to-yellow-500 text-gray-800 border-yellow-600';
    } else if (num <= 20) {
      // 파란색
      return 'bg-gradient-to-b from-blue-400 to-blue-600 text-white border-blue-700';
    } else if (num <= 30) {
      // 빨간색
      return 'bg-gradient-to-b from-red-400 to-red-600 text-white border-red-700';
    } else if (num <= 40) {
      // 회색/검정색
      return 'bg-gradient-to-b from-gray-500 to-gray-700 text-white border-gray-800';
    } else {
      // 초록색
      return 'bg-gradient-to-b from-green-400 to-green-600 text-white border-green-700';
    }
  };

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold',
        'shadow-lg border-2',
        'transition-transform hover:scale-110',
        sizeClasses[size],
        getBallClasses(number),
        className
      )}
    >
      {number}
    </div>
  );
}