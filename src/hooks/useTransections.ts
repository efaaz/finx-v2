import { useQuery } from "@tanstack/react-query";
import { getThisMonthsSummary, getTodayTransactions } from "@/lib/api/transactions";

export function useTodayTransactions() {
  return useQuery({
    queryKey: ["transactions", "today"],
    queryFn: getTodayTransactions,
  });
}

// export function useTransactions() {
//   return useQuery({
//     queryKey: ["transactions"],
//     queryFn: getTransactions,
//   });
// }

import {
  getThisMonthsTransactions,
  type GetThisMonthsTransactionsParams,
} from "@/lib/api/transactions";

export const useThisMonthTransactions = (
  params?: GetThisMonthsTransactionsParams
) => {
  return useQuery({
    queryKey: ["transactions", "this-month", params],
    queryFn: () => getThisMonthsTransactions(params),
  });
};
export const useThisMonthSummary = () => {
  return useQuery({
    queryKey: ["transactions", "this-month", "summary"],
    queryFn: () => getThisMonthsSummary(),
  });
};