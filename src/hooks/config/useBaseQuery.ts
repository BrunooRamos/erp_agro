// src/hooks/common/useBaseQuery.ts
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { errorService } from "../../services/error.services";

export function useBaseQuery<TData>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        errorService.handleError(error);
        throw error;
      }
    },
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
  });
}
