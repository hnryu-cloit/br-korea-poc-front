import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postSalesQuery } from "@/features/sales/api/sales";
import { salesQueryKeys } from "@/features/sales/queries/salesQueryKeys";

export const usePostSalesQueryMutation = (
  storeId?: string,
  domain: "production" | "ordering" | "sales" = "sales",
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prompt: string) => postSalesQuery(prompt, storeId, domain),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesQueryKeys.insights() });
      queryClient.invalidateQueries({ queryKey: salesQueryKeys.all });
    },
  });
};
