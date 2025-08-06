'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { NumberStatistics } from '@lottopass/shared';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StatisticsResponse {
  success: boolean;
  data: NumberStatistics[];
  draws?: any[]; // For calculating sum ranges
  meta?: {
    analyzedDraws: number;
    latestRound: number;
    oldestRound: number;
  };
  timestamp: number;
  cached: boolean;
}

export default function StatisticsPage() {
  const [range, setRange] = useState('10');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Fetch statistics data
  const { data: response, isLoading, error } = useQuery<StatisticsResponse>({
    queryKey: ['statistics', range],
    queryFn: async () => {
      const response = await fetch(`/api/lottery/statistics?recent=${range}`);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      return response.json();
    },
  });
  
  // Fetch draw data for sum calculation
  const { data: drawsData } = useQuery({
    queryKey: ['draws', range],
    queryFn: async () => {
      const response = await fetch(`/api/lottery/draws?limit=${range}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!mounted,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-destructive">오류가 발생했습니다</CardTitle>
            <CardDescription>통계 데이터를 불러오는 중 문제가 발생했습니다.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!response || !response.success || !mounted) return null;

  const statistics = response.data;
  
  // 표시할 번호 개수 (핫넘버와 콜드넘버 동일하게)
  const displayCount = 7;
  
  // 핫넘버와 콜드넘버 추출
  const allHotNumbers = statistics.filter(s => s.isHot);
  const allColdNumbers = statistics.filter(s => s.isCold);
  
  // 실제 표시할 개수 결정 (둘 중 적은 쪽에 맞춤)
  const actualDisplayCount = Math.min(displayCount, allHotNumbers.length, allColdNumbers.length);
  
  const hotNumbers = allHotNumbers.slice(0, actualDisplayCount);
  const coldNumbers = allColdNumbers.slice(0, actualDisplayCount);
  
  // Calculate odd/even ratio
  const oddCount = statistics.reduce((sum, stat) => sum + (stat.number % 2 === 1 ? stat.frequency : 0), 0);
  const evenCount = statistics.reduce((sum, stat) => sum + (stat.number % 2 === 0 ? stat.frequency : 0), 0);

  // Prepare chart data
  const frequencyChartData = {
    labels: statistics.map(f => f.number.toString()),
    datasets: [
      {
        label: '출현 횟수',
        data: statistics.map(f => f.frequency),
        backgroundColor: statistics.map(f => 
          f.isHot ? 'rgba(239, 68, 68, 0.5)' : 
          f.isCold ? 'rgba(59, 130, 246, 0.5)' : 
          'rgba(156, 163, 175, 0.5)'
        ),
        borderColor: statistics.map(f => 
          f.isHot ? 'rgb(239, 68, 68)' : 
          f.isCold ? 'rgb(59, 130, 246)' : 
          'rgb(156, 163, 175)'
        ),
        borderWidth: 1,
      },
    ],
  };

  // Calculate sum ranges from actual data
  const sumRanges = [
    { range: '100-120', count: 0 },
    { range: '121-140', count: 0 },
    { range: '141-160', count: 0 },
    { range: '161-180', count: 0 },
    { range: '181-200', count: 0 },
    { range: '201+', count: 0 },
  ];
  
  // If we have draw data, calculate actual sum distributions
  if (drawsData?.success && drawsData?.data) {
    drawsData.data.forEach((draw: any) => {
      const sum = draw.numbers.reduce((acc: number, num: number) => acc + num, 0);
      if (sum <= 120) sumRanges[0].count++;
      else if (sum <= 140) sumRanges[1].count++;
      else if (sum <= 160) sumRanges[2].count++;
      else if (sum <= 180) sumRanges[3].count++;
      else if (sum <= 200) sumRanges[4].count++;
      else sumRanges[5].count++;
    });
  }

  const sumRangeChartData = {
    labels: sumRanges.map(s => s.range),
    datasets: [
      {
        label: '빈도',
        data: sumRanges.map(s => s.count),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  const oddEvenChartData = {
    labels: ['홀수', '짝수'],
    datasets: [
      {
        data: [oddCount, evenCount],
        backgroundColor: ['rgba(239, 68, 68, 0.5)', 'rgba(59, 130, 246, 0.5)'],
        borderColor: ['rgb(239, 68, 68)', 'rgb(59, 130, 246)'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">로또 통계 분석</h1>
          <p className="text-muted-foreground mt-2">당첨 번호의 패턴과 트렌드를 분석합니다</p>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="분석 범위 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">최근 10회</SelectItem>
            <SelectItem value="20">최근 20회</SelectItem>
            <SelectItem value="50">최근 50회</SelectItem>
            <SelectItem value="100">최근 100회</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Hot & Cold Numbers */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              핫 넘버 (자주 나온 번호)
            </CardTitle>
            <CardDescription>
              최근 10회차에서 3회 이상 출현한 번호 ({allHotNumbers.length}개 중 {hotNumbers.length}개 표시)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {hotNumbers.map(stat => (
                <div
                  key={stat.number}
                  className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-bold"
                >
                  {stat.number}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-blue-500" />
              콜드 넘버 (적게 나온 번호)
            </CardTitle>
            <CardDescription>
              최근 10회차에서 한 번도 나오지 않은 번호 ({allColdNumbers.length}개 중 {coldNumbers.length}개 표시)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {coldNumbers.map(stat => (
                <div
                  key={stat.number}
                  className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold"
                >
                  {stat.number}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="frequency" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="frequency">번호별 출현 빈도</TabsTrigger>
          <TabsTrigger value="sumRange">번호 합계 분포</TabsTrigger>
          <TabsTrigger value="oddEven">홀짝 비율</TabsTrigger>
        </TabsList>
        
        <TabsContent value="frequency">
          <Card>
            <CardHeader>
              <CardTitle>번호별 출현 빈도</CardTitle>
              <CardDescription>각 번호가 출현한 횟수를 보여줍니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full relative">
                <Bar data={frequencyChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sumRange">
          <Card>
            <CardHeader>
              <CardTitle>번호 합계 분포</CardTitle>
              <CardDescription>당첨 번호 6개의 합계 범위별 분포입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full relative">
                <Bar data={sumRangeChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="oddEven">
          <Card>
            <CardHeader>
              <CardTitle>홀짝 비율</CardTitle>
              <CardDescription>당첨 번호의 홀수/짝수 비율입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <div className="w-[300px] h-[300px] relative">
                  <Doughnut data={oddEvenChartData} options={chartOptions} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}