import { useState, useEffect } from 'react';
import { message } from 'antd';
import type { SpendingAlert } from '../types/spending.types';

interface SpendingLimits {
  daily?: number;
  weekly?: number;
  monthly?: number;
}

const DEFAULT_LIMITS: SpendingLimits = {
  daily: 5000,
  weekly: 20000,
  monthly: 50000,
};

export const useSpendingAlert = (currentSpending: {
  daily: number;
  weekly: number;
  monthly: number;
}) => {
  const [limits, setLimits] = useState<SpendingLimits>(() => {
    const saved = localStorage.getItem('spendingLimits');
    return saved ? JSON.parse(saved) : DEFAULT_LIMITS;
  });

  const [alerts, setAlerts] = useState<SpendingAlert[]>([]);

  useEffect(() => {
    const newAlerts: SpendingAlert[] = [];

    // Check daily limit
    if (limits.daily && currentSpending.daily >= limits.daily) {
      newAlerts.push({
        type: 'daily',
        limit: limits.daily,
        currentAmount: currentSpending.daily,
        isExceeded: currentSpending.daily > limits.daily,
        message: `일일 지출 한도 ${limits.daily.toLocaleString()}원을 ${
          currentSpending.daily > limits.daily ? '초과했습니다' : '도달했습니다'
        }!`,
      });
    }

    // Check weekly limit
    if (limits.weekly && currentSpending.weekly >= limits.weekly * 0.8) {
      newAlerts.push({
        type: 'weekly',
        limit: limits.weekly,
        currentAmount: currentSpending.weekly,
        isExceeded: currentSpending.weekly > limits.weekly,
        message: `주간 지출이 한도의 ${Math.round(
          (currentSpending.weekly / limits.weekly) * 100
        )}%에 도달했습니다.`,
      });
    }

    // Check monthly limit
    if (limits.monthly && currentSpending.monthly >= limits.monthly * 0.7) {
      newAlerts.push({
        type: 'monthly',
        limit: limits.monthly,
        currentAmount: currentSpending.monthly,
        isExceeded: currentSpending.monthly > limits.monthly,
        message: `월간 지출이 한도의 ${Math.round(
          (currentSpending.monthly / limits.monthly) * 100
        )}%에 도달했습니다.`,
      });
    }

    setAlerts(newAlerts);

    // Show warnings for exceeded limits
    newAlerts.forEach((alert) => {
      if (alert.isExceeded) {
        message.warning(alert.message);
      }
    });
  }, [currentSpending, limits]);

  const updateLimits = (newLimits: SpendingLimits) => {
    setLimits(newLimits);
    localStorage.setItem('spendingLimits', JSON.stringify(newLimits));
    message.success('지출 한도가 업데이트되었습니다.');
  };

  return {
    limits,
    alerts,
    updateLimits,
    hasAlerts: alerts.length > 0,
    hasExceeded: alerts.some((a) => a.isExceeded),
  };
};