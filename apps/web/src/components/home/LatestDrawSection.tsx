'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LottoBall } from '@/components/ui/lotto-ball';
import { useLatestDraw } from '@lottopass/api-client';
import { formatDate, formatPrize } from '@lottopass/shared';
import { Loader2, Trophy, Users, DollarSign } from 'lucide-react';

export function LatestDrawSection() {
  const { data: latestDraw, isLoading, error } = useLatestDraw();

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-4xl">
          <Card>
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </Card>
        </div>
      </section>
    );
  }

  if (error || !latestDraw) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-8">
              <p className="text-center text-destructive">
                최신 회차 정보를 불러올 수 없습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const numbers = [
    latestDraw.drwtNo1,
    latestDraw.drwtNo2,
    latestDraw.drwtNo3,
    latestDraw.drwtNo4,
    latestDraw.drwtNo5,
    latestDraw.drwtNo6,
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4">
            최신 당첨 결과
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            제 {latestDraw.drwNo}회 로또 6/45
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            추첨일: {formatDate(latestDraw.drwNoDate)}
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="text-center text-2xl">당첨번호</CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* 당첨 번호 */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {numbers.map((number, index) => (
                <LottoBall key={index} number={number} size="lg" />
              ))}
              <div className="flex items-center gap-2 ml-4">
                <span className="text-2xl text-gray-400">+</span>
                <div className="relative">
                  <LottoBall number={latestDraw.bnusNo} size="lg" />
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 text-xs px-1.5 py-0"
                  >
                    보너스
                  </Badge>
                </div>
              </div>
            </div>

            {/* 당첨 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-gray-600 mb-1">1등 당첨금</p>
                <p className="text-2xl font-bold text-primary">
                  {formatPrize(latestDraw.firstWinamnt)}
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 mb-3">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <p className="text-sm text-gray-600 mb-1">1등 당첨자</p>
                <p className="text-2xl font-bold text-secondary">
                  {latestDraw.firstPrzwnerCo}명
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-3">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <p className="text-sm text-gray-600 mb-1">총 판매액</p>
                <p className="text-2xl font-bold text-accent">
                  {formatPrize(latestDraw.totSellamnt)}
                </p>
              </div>
            </div>

            {/* 당첨 판매점 정보 (있다면) */}
            {latestDraw.firstAccumamnt && (
              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-gray-600">
                  누적 당첨금: <span className="font-semibold">{formatPrize(latestDraw.firstAccumamnt)}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}