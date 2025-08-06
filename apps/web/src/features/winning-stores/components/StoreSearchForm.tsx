'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { REGIONS, type StoreSearchParams } from '../types';

interface StoreSearchFormProps {
  onSearch: (params: StoreSearchParams) => void;
  initialValues?: StoreSearchParams;
}

export function StoreSearchForm({ onSearch, initialValues }: StoreSearchFormProps) {
  const [selectedRegion, setSelectedRegion] = React.useState<string>(initialValues?.region || 'all');
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>(initialValues?.district || 'all');
  const [selectedRank, setSelectedRank] = React.useState<string>(initialValues?.rank?.toString() || 'all');
  const [keyword, setKeyword] = React.useState<string>(initialValues?.keyword || '');

  const selectedRegionData = selectedRegion !== 'all' ? REGIONS.find(r => r.region === selectedRegion) : null;
  const districts = selectedRegionData?.districts || [];

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedDistrict('all'); // 지역 변경 시 구/군 초기화
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      region: selectedRegion === 'all' ? undefined : selectedRegion,
      district: selectedDistrict === 'all' ? undefined : selectedDistrict,
      rank: selectedRank === 'all' ? undefined : (parseInt(selectedRank) as 1 | 2),
      keyword: keyword || undefined,
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* 시/도 선택 */}
            <Select value={selectedRegion} onValueChange={handleRegionChange}>
              <SelectTrigger>
                <SelectValue placeholder="시/도 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {REGIONS.map(({ region }) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 구/군 선택 */}
            <Select 
              value={selectedDistrict} 
              onValueChange={setSelectedDistrict}
              disabled={selectedRegion === 'all'}
            >
              <SelectTrigger>
                <SelectValue placeholder="구/군 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 당첨 등수 선택 */}
            <Select value={selectedRank} onValueChange={setSelectedRank}>
              <SelectTrigger>
                <SelectValue placeholder="당첨 등수" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="1">1등</SelectItem>
                <SelectItem value="2">2등</SelectItem>
              </SelectContent>
            </Select>

            {/* 검색어 입력 */}
            <div className="relative">
              <Input
                type="text"
                placeholder="판매점명 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              검색
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}