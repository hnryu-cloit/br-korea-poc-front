import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postOrderingSelection } from "@/features/ordering/api/ordering";
import { orderingQueryKeys } from "@/features/ordering/queries/orderingQueryKeys";

export const usePostOrderingSelectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postOrderingSelection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderingQueryKeys.all });
    },
  });
};
