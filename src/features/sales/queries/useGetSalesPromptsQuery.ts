import { useQuery } from "@tanstack/react-query";

import { getSalesPrompts } from "@/features/sales/api/sales";
import { salesQueryKeys } from "@/features/sales/queries/salesQueryKeys";

export const useGetSalesPromptsQuery = () =>
  useQuery({
    queryKey: salesQueryKeys.prompts(),
    queryFn: getSalesPrompts,
  });
