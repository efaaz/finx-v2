export type TrendRange = "6months" | "12months";

export type SpendingCategory = {
  id: string;
  name: string;
  amount: number;
  transactions: number;
  color: string;
  description: string;
};

export type MonthlyData = {
  month: string;
  income: number;
  spending: number;
};