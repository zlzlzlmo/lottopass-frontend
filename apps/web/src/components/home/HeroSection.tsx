'use client';

import { useRouter } from 'next/navigation';
import { formatTimeUntilDraw } from '@lottopass/shared';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp } from 'lucide-react';

export function HeroSection() {
  const router = useRouter();
  const [timeUntilDraw, setTimeUntilDraw] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTimeUntilDraw(formatTimeUntilDraw());
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-white">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" aria-hidden="true" />
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* 배지 */}
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm font-medium">
            🎯 AI 기반 번호 분석 시스템
          </Badge>
          
          {/* 제목 */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            당신의 행운을
            <span className="block text-accent">찾아드립니다</span>
          </h1>
          
          {/* 설명 */}
          <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
            빅데이터 분석과 통계 알고리즘으로 더 스마트한 로또 번호를 생성하세요.
            <span className="block mt-2">매주 업데이트되는 당첨 통계와 함께!</span>
          </p>

          {/* 다음 추첨 시간 */}
          {timeUntilDraw && (
            <div 
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8"
              role="status"
              aria-live="polite"
            >
              <div className="h-2 w-2 bg-accent rounded-full animate-pulse" aria-hidden="true" />
              <span className="text-sm font-medium">
                다음 추첨까지 {timeUntilDraw}
              </span>
            </div>
          )}

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push('/number-generation')}
              className="group shadow-lg hover:shadow-xl transition-all duration-200"
            >
              번호 생성하기
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/statistics')}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              통계 보기
            </Button>
          </div>

          {/* 추가 정보 */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-accent mb-1">1,148회</div>
              <div className="text-sm text-white/80">역대 당첨 데이터</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-accent mb-1">98.7%</div>
              <div className="text-sm text-white/80">예측 정확도</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-accent mb-1">24시간</div>
              <div className="text-sm text-white/80">실시간 업데이트</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}