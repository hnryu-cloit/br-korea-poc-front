import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postProductionRegistration } from "@/features/production/api/production";
import { productionQueryKeys } from "@/features/production/queries/productionQueryKeys";

export const usePostProductionRegistrationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postProductionRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productionQueryKeys.overview() });
      queryClient.invalidateQueries({ queryKey: productionQueryKeys.alerts() });
      queryClient.invalidateQueries({ queryKey: productionQueryKeys.registrationHistory() });
      queryClient.invalidateQueries({ queryKey: productionQueryKeys.registrationSummary() });
    },
  });
};
