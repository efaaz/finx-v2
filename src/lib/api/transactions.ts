import type {
  GetTodayTransactionsResponse,
  PostTransaction,
  ThisMonthsSummaryResponse,
  ThisMonthsTransactionsResponse,
} from "@/types/transaction";
import { api } from "./client";
export const createTransaction = async (
  data: PostTransaction
) => {
  const response = await api.post(
    "/transactions/createTransaction",
    data
  );

  return response.data;
};

export async function getTodayTransactions(): Promise<GetTodayTransactionsResponse> {
  const response = await api.get<GetTodayTransactionsResponse>(
    "/transactions/getTodaysTransactions",
  );

  return response.data;
}
export interface GetThisMonthsTransactionsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: "all" | "income" | "spending";
  categoryId?: string;
}

export const getThisMonthsTransactions = async (
  params?: GetThisMonthsTransactionsParams,
): Promise<ThisMonthsTransactionsResponse> => {
  const response = await api.get<ThisMonthsTransactionsResponse>(
    "/transactions/getThisMonthTransactions",
    {
      params,
    },
  );

  return response.data;
};

export async function getThisMonthsSummary(): Promise<ThisMonthsSummaryResponse> {
  const response = await api.get<ThisMonthsSummaryResponse>(
    "/transactions/getThisMonthsSummary",
  );

  return response.data;
}
