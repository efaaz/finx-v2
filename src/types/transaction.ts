import { ApiResponse } from "./apiResponse";
import { CurrencyCode } from "./currency";
export type TransactionType = "income" | "spending";

export interface PostTransaction {
  userId: string;
  type: TransactionType;
  categoryId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface TransactionCategory {
  _id: string;
  categoryName: string;
  type: TransactionType;
}

export interface Transaction {
  _id?: string;
  userId: string;
  categoryId: TransactionCategory;
  type: TransactionType;
  amount: number;
  currency: CurrencyCode;
  date: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TransactionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export type ThisMonthsTransactionsResponse =
  ApiResponse<ThisMonthsTransactionsData>;

export interface GetTransactionsData {
  transactions: Transaction[];
  pagination: TransactionPagination;
}

export interface GetTransactionsResponse {
  statusCode: number;
  data: GetTransactionsData;
  message: string;
  success: boolean;
}

export interface TodayTransactionsData {
  transactions: Transaction[];
  totalIncome: number;
  totalSpending: number;
  netIncome: number;
}

export interface GetTodayTransactionsResponse {
  statusCode: number;
  data: TodayTransactionsData;
  message: string;
  success: boolean;
}

export interface TransactionPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ThisMonthsTransactionsData {
  transactions: Transaction[];
  pagination: TransactionPagination;
}

export interface GetThisMonthsSummary {
  summary: {
    totalIncome: number;
    totalSpending: number;
    netIncome: number;
  };
  spendingByCategory: {
    totalSpending: number;
    categoryId: string;
    categoryName: string;
  }[];
}

export type ThisMonthsSummaryResponse = ApiResponse<GetThisMonthsSummary>;
