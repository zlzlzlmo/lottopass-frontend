'use client';

import { BarChart3, Store, Dice5, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const features = [
  {
    title: '통계 분석',
    description: '과거 당첨 번호를 분석하여 패턴을 찾아드립니다',
    icon: BarChart3,
    href: '/statistics',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: '당첨 판매점',
    description: '가까운 1등 당첨 판매점을 찾아보세요',
    icon: Store,
    href: '/winning-stores',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    title: '번호 시뮬레이션',
    description: 'AI로 당첨 확률을 시뮬레이션해보세요',
    icon: Dice5,
    href: '/simulation',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    title: '나의 번호',
    description: '저장한 번호의 당첨 여부를 확인하세요',
    icon: Wallet,
    href: '/dashboard',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
];

export function FeatureCards() {
  const router = useRouter();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            더 많은 기능을 만나보세요
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            로또 당첨을 위한 모든 도구가 준비되어 있습니다
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                onClick={() => router.push(feature.href)}
              >
                <CardHeader>
                  <div
                    className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
                      feature.bgColor
                    )}
                  >
                    <Icon className={cn('h-6 w-6', feature.color)} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* 추가 기능 섹션 */}
        <div className="mt-16 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">실시간</div>
              <p className="text-gray-600">매주 토요일 자동 업데이트</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">무료</div>
              <p className="text-gray-600">모든 기능 완전 무료 제공</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">정확한</div>
              <p className="text-gray-600">공식 데이터 기반 분석</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
