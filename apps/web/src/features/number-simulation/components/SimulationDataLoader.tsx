'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface SimulationDataLoaderProps {
  isLoading: boolean;
  progress: { loaded: number; total: number };
  error?: Error | null;
  children: React.ReactNode;
}

export const SimulationDataLoader: React.FC<SimulationDataLoaderProps> = ({
  isLoading,
  progress,
  error,
  children,
}) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">데이터 로딩 실패</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (isLoading) {
    const percentage = progress.total > 0 
      ? Math.round((progress.loaded / progress.total) * 100) 
      : 0;

    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">과거 당첨 데이터 로딩 중...</p>
          {progress.total > 0 && (
            <>
              <p className="text-sm text-gray-500">
                {progress.loaded} / {progress.total} 회차 로딩 완료
              </p>
              <div className="w-64">
                <Progress value={percentage} className="h-2" />
              </div>
              <p className="text-xs text-gray-500">{percentage}%</p>
            </>
          )}
        </div>
        <p className="text-xs text-gray-400 max-w-md text-center">
          시뮬레이션 정확도를 높이기 위해 과거 당첨 데이터를 분석하고 있습니다.
          잠시만 기다려주세요.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};