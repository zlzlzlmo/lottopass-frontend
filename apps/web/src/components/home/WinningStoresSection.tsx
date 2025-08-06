'use client';

import React from 'react';
import { MapPin, Trophy, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLatestWinningStores } from '@/features/winning-stores';

export function WinningStoresSection() {
  const { data, isLoading } = useLatestWinningStores();
  
  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  const firstPrizeStores = data?.data.filter(store => store.rank === 1).slice(0, 3) || [];
  const secondPrizeStores = data?.data.filter(store => store.rank === 2).slice(0, 3) || [];
  
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-3">
            최신 당첨 판매점
          </h2>
          <p className="text-lg text-gray-600">
            제1183회 로또 1등, 2등 당첨 판매점을 확인하세요
          </p>
        </div>
        
        {/* 1등 당첨 판매점 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              1등 당첨 판매점
            </h3>
            <Badge variant="destructive" className="text-sm">
              13명 / 각 20억 7,396만원
            </Badge>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {firstPrizeStores.map((store) => (
              <Card key={store.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{store.storeName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{store.address}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* 2등 당첨 판매점 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-gray-400" />
              2등 당첨 판매점
            </h3>
            <Badge variant="secondary" className="text-sm">
              92명 / 각 4,884만원
            </Badge>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {secondPrizeStores.map((store) => (
              <Card key={store.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{store.storeName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{store.address}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/winning-stores">
            <Button size="lg" className="gap-2">
              전체 당첨 판매점 보기
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}