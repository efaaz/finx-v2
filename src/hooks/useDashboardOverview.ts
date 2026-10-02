import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import {
  DashboardOverview,
  DashboardOverviewResponse,
} from "@/types/DashboardOverview";

export const useDashboardOverview = () => {
  return useQuery<DashboardOverview>({
    queryKey: ["dashboard", "overview"],

    queryFn: async () => {
      const response = await api.get<DashboardOverviewResponse>(
        "/dashboard/overview",
      );

      return response.data.data;
    },

    // Dashboard data can be a little stale without
    // needing a request every few seconds.
    staleTime: 60 * 1000,
  });
};
