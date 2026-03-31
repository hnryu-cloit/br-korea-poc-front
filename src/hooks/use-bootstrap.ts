import { useQuery } from "@tanstack/react-query";

import { fetchBootstrap } from "@/lib/api";

export function useBootstrap() {
  return useQuery({
    queryKey: ["bootstrap"],
    queryFn: fetchBootstrap,
    staleTime: 30_000,
  });
}
