export type TrendRange = "6months" | "12months";

export type ApiCategory = {
  id: string | null;
  name: string;
  amount: number;
  transactions: number;
  sharePercentage: number;
};

export type SpendingCategory = ApiCategory & {
  id: string;
  color: string;
  description: string;
};

export type MonthlyData = {
  monthKey: string;
  month: string;
  income: number;
  spending: number;
  netCashFlow: number;
  incomeTransactions: number;
  spendingTransactions: number;
};

export type FinancialReport = {
  currency: string;
  timezone: string;
  overview: {
    totalIncome: number;
    totalSpending: number;
    netCashFlow: number;
    incomeRemainingRate: number;
    totalIncomeTransactions: number;
    totalSpendingTransactions: number;
    totalTransactions: number;
  };
  trend: {
    range: TrendRange;
    months: MonthlyData[];
    totalIncome: number;
    totalSpending: number;
    netCashFlow: number;
  };
  categories: ApiCategory[];
  insights: {
    topSpendingCategory: ApiCategory | null;
    secondSpendingCategory: ApiCategory | null;
    topTwoCategorySharePercentage: number;
    hasPositiveNetCashFlow: boolean;
    hasRecordedIncome: boolean;
  };
};
