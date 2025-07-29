export interface MonthlySpending {
  year: number;
  month: number;
  totalAmount: number;
  purchaseCount: number;
  winAmount: number;
  netAmount: number; // winAmount - totalAmount
}

export interface SpendingAlert {
  type: 'daily' | 'weekly' | 'monthly';
  limit: number;
  currentAmount: number;
  isExceeded: boolean;
  message: string;
}

export interface SpendingSummary {
  totalSpent: number;
  totalWon: number;
  netResult: number;
  monthlyAverage: number;
  winRate: number;
  mostSpentMonth: MonthlySpending;
  bestMonth: MonthlySpending; // highest net gain
}

export interface SpendingFilters {
  startDate?: string;
  endDate?: string;
  includeWins?: boolean;
}