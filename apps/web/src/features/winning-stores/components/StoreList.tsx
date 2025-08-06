'use client';

import React from 'react';
import { MapPin, Trophy, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { WinningStore } from '../types';

interface StoreListProps {
  stores: WinningStore[];
  isLoading?: boolean;
}

export function StoreList({ stores, isLoading }: StoreListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Store className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">검색 결과가 없습니다</p>
          <p className="text-sm text-muted-foreground mt-1">다른 조건으로 검색해보세요</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stores.map((store) => (
        <Card key={store.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{store.storeName}</CardTitle>
              <Badge variant={store.rank === 1 ? 'destructive' : 'secondary'}>
                <Trophy className="mr-1 h-3 w-3" />
                {store.rank}등
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{store.address}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">당첨 회차</span>
                <span className="font-medium">{store.round}회</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}