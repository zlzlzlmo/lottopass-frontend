'use client';

import { useGenerateNumbers } from '@lottopass/api-client';
import { generateId } from '@lottopass/shared';
import { useLottoStore, useUIStore } from '@lottopass/stores';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LottoBall } from '@/components/ui/lotto-ball';

export function QuickNumberGeneration() {
  const router = useRouter();
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const { mutate: generate, isPending } = useGenerateNumbers();
  const { addGeneratedNumbers } = useLottoStore();
  const { showToast } = useUIStore();

  const handleQuickGenerate = () => {
    generate(
      { method: 'random' },
      {
        onSuccess: (data) => {
          setGeneratedNumbers(data.numbers);
          addGeneratedNumbers({
            ...data,
            id: generateId(),
            createdAt: new Date().toISOString(),
          });
          showToast({
            type: 'success',
            title: '성공',
            message: '번호가 생성되었습니다!',
          });
        },
        onError: () => {
          showToast({
            type: 'error',
            title: '오류',
            message: '번호 생성에 실패했습니다.',
          });
        },
      }
    );
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            AI 추천
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">빠른 번호 생성</h2>
          <p className="mt-3 text-lg text-gray-600">한 번의 클릭으로 행운의 번호를 받아보세요</p>
        </div>

        <Card className="border-2">
          <CardContent className="p-8">
            <div className="space-y-6">
              {generatedNumbers.length > 0 ? (
                <>
                  {/* 생성된 번호 표시 */}
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6">
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                      {generatedNumbers.map((number, index) => (
                        <LottoBall key={index} number={number} size="lg" />
                      ))}
                    </div>
                    <p className="text-center text-sm text-gray-600">
                      AI가 분석한 이번 주 추천 번호입니다
                    </p>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={handleQuickGenerate}
                      disabled={isPending}
                      className="group"
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-2 ${isPending ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`}
                      />
                      다시 생성
                    </Button>

                    <Button onClick={() => router.push('/number-generation')} className="group">
                      더 많은 옵션
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* 초기 상태 */}
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                      <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-lg text-gray-600 mb-8">
                      버튼을 눌러 행운의 번호를 받아보세요
                    </p>

                    <Button
                      size="lg"
                      onClick={handleQuickGenerate}
                      disabled={isPending}
                      className="shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isPending ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          생성 중...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          번호 생성하기
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}

              {/* 추가 정보 */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">AI</div>
                  <div className="text-xs text-gray-600">기반 분석</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">통계</div>
                  <div className="text-xs text-gray-600">데이터 활용</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">실시간</div>
                  <div className="text-xs text-gray-600">업데이트</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
