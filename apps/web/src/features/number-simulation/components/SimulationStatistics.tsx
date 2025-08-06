'use client';

import React from 'react';
import { SimulationStatistics as SimulationStatsType } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface SimulationStatisticsProps {
  statistics: SimulationStatsType;
}

export const SimulationStatistics: React.FC<SimulationStatisticsProps> = ({
  statistics
}) => {
  // Prepare data for charts
  const numberFrequencyData = Array.from(statistics.numberFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([number, count]) => ({
      number,
      count,
      percentage: (count / statistics.totalSimulations / 6) * 100
    }));
  
  const patternData = [
    {
      name: '홀수',
      value: statistics.patternAnalysis.evenOddRatio.odd * 100,
      color: '#3b82f6'
    },
    {
      name: '짝수',
      value: statistics.patternAnalysis.evenOddRatio.even * 100,
      color: '#ef4444'
    }
  ];
  
  const rangeData = [
    {
      name: '저구간 (1-22)',
      value: statistics.patternAnalysis.highLowRatio.low * 100,
      color: '#22c55e'
    },
    {
      name: '고구간 (23-45)',
      value: statistics.patternAnalysis.highLowRatio.high * 100,
      color: '#f59e0b'
    }
  ];
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">시뮬레이션 요약</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">총 시뮬레이션</span>
            <span className="font-semibold">{statistics.totalSimulations.toLocaleString()}회</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">평균 일치 개수</span>
            <span className="font-semibold">{statistics.averageMatchCount.toFixed(2)}개</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">평균 번호 합</span>
            <span className="font-semibold">
              {statistics.patternAnalysis.sumRange.average.toFixed(0)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">연속 번호 평균</span>
            <span className="font-semibold">
              {statistics.patternAnalysis.consecutivePairs.toFixed(2)}쌍
            </span>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">최고 신뢰도 조합</span>
              <Badge variant="secondary">
                {(statistics.bestResult.confidence * 100).toFixed(0)}%
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              {statistics.bestResult.numbers.map((num) => (
                <Badge key={num} variant="outline">
                  {num}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Number Frequency Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">번호별 출현 빈도</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={numberFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="number" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `${value}회`}
                labelFormatter={(label) => `번호 ${label}`}
              />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Pattern Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">홀짝 분포</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={patternData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {patternData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {patternData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm">
                  {entry.name}: {entry.value.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* High/Low Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">고저 분포</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={rangeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {rangeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {rangeData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm">
                  {entry.name}: {entry.value.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};