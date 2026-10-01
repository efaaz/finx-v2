// src/hooks/useAvailableCategories.ts

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export type Category = {
  _id: string;
  categoryName: string;
  type: "income" | "spending";
  userId: string | null;
};

export const useAvailableCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories", "available"],

    queryFn: async () => {
      const response = await api.get(
        "/categories/available",
      );

      return response.data.data;
    },
  });
};