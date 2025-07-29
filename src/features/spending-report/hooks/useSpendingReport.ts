import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { recordService } from '@/api';
import { useAppSelector } from '@/redux/hooks';
import type { MonthlySpending, SpendingSummary } from '../types/spending.types';

export const useSpendingReport = (userId?: string) => {
  const { data: records, isLoading } = useQuery({
    queryKey: ['records', userId],
    queryFn: () => recordService.getRecords(),
    enabled: !!userId,
  });

  const allDraws = useAppSelector((state) => state.draw.allDraws);

  const monthlySpending = useMemo<MonthlySpending[]>(() => {
    if (!records) return [];

    const monthlyMap = new Map<string, MonthlySpending>();

    records.forEach((record) => {
      const date = new Date(record.purchaseDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const key = `${year}-${month}`;

      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, {
          year,
          month,
          totalAmount: 0,
          purchaseCount: 0,
          winAmount: 0,
          netAmount: 0,
        });
      }

      const monthData = monthlyMap.get(key)!;
      const purchaseAmount = record.combinations.length * 1000; // 1000원 per combination
      
      monthData.totalAmount += purchaseAmount;
      monthData.purchaseCount += 1;

      // Calculate win amount based on matching numbers
      // This is simplified - you'd need to implement actual win calculation
      // based on the draw results
    });

    // Calculate net amounts
    monthlyMap.forEach((data) => {
      data.netAmount = data.winAmount - data.totalAmount;
    });

    return Array.from(monthlyMap.values()).sort(
      (a, b) => b.year - a.year || b.month - a.month
    );
  }, [records, allDraws]);

  const summary = useMemo<SpendingSummary | null>(() => {
    if (monthlySpending.length === 0) return null;

    const totalSpent = monthlySpending.reduce((sum, m) => sum + m.totalAmount, 0);
    const totalWon = monthlySpending.reduce((sum, m) => sum + m.winAmount, 0);
    const monthlyAverage = totalSpent / monthlySpending.length;
    const winRate = totalSpent > 0 ? (totalWon / totalSpent) * 100 : 0;

    const mostSpentMonth = monthlySpending.reduce((max, m) =>
      m.totalAmount > max.totalAmount ? m : max
    );

    const bestMonth = monthlySpending.reduce((best, m) =>
      m.netAmount > best.netAmount ? m : best
    );

    return {
      totalSpent,
      totalWon,
      netResult: totalWon - totalSpent,
      monthlyAverage,
      winRate,
      mostSpentMonth,
      bestMonth,
    };
  }, [monthlySpending]);

  return {
    monthlySpending,
    summary,
    isLoading,
    isEmpty: !records || records.length === 0,
  };
};