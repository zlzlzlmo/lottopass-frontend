'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { 
  StoreSearchForm, 
  StoreList, 
  useWinningStores,
  type StoreSearchParams 
} from '@/features/winning-stores';

export default function WinningStoresPage() {
  const [searchParams, setSearchParams] = useState<StoreSearchParams>({});
  const { data, isLoading, error } = useWinningStores(searchParams);

  const handleSearch = (params: StoreSearchParams) => {
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">당첨 판매점 조회</h1>
        <p className="text-muted-foreground mt-2">
          로또 1등, 2등 당첨 판매점을 지역별로 검색할 수 있습니다
        </p>
      </div>

      <StoreSearchForm onSearch={handleSearch} initialValues={searchParams} />

      {error ? (
        <div className="text-center py-12">
          <p className="text-destructive">데이터를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      ) : (
        <>
          {data && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                총 {data.total}개의 판매점이 검색되었습니다
              </p>
            </div>
          )}
          
          <StoreList 
            stores={data?.data || []} 
            isLoading={isLoading} 
          />
        </>
      )}
    </div>
  );
}