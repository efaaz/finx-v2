"use client";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api/auth";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: getCurrentUser,

    // Don't let Query automatically retry a failed auth request.
    // Our Axios interceptor handles token refresh.
    retry: false,

    // User information doesn't need to be refetched constantly.
    staleTime: 5 * 60 * 1000,
  });
}

