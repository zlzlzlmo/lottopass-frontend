import React from 'react';
import { Card } from 'antd';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { MonthlySpending } from '../types/spending.types';
import COLORS from '@/constants/colors';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlySpendingChartProps {
  data: MonthlySpending[];
  height?: number;
}

export const MonthlySpendingChart: React.FC<MonthlySpendingChartProps> = ({
  data,
  height = 300,
}) => {
  const chartData = {
    labels: data.map((item) => `${item.year}.${item.month}`),
    datasets: [
      {
        label: '지출',
        data: data.map((item) => item.totalAmount),
        backgroundColor: COLORS.DANGER + '99',
        borderColor: COLORS.DANGER,
        borderWidth: 1,
      },
      {
        label: '당첨금',
        data: data.map((item) => item.winAmount),
        backgroundColor: COLORS.SUCCESS + '99',
        borderColor: COLORS.SUCCESS,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '월별 로또 지출 및 당첨금',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toLocaleString()}원`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `${value.toLocaleString()}원`,
        },
      },
    },
  };

  return (
    <Card>
      <div style={{ height }}>
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
};