import { useMutation, useQueryClient } from "@tanstack/react-query";

import { putPromptSettings } from "@/features/admin/orchestration/api/orchestration";
import { orchestrationQueryKeys } from "@/features/admin/orchestration/queries/orchestrationQueryKeys";
import type {
  PromptSettingsResponse,
  PromptSettingsUpdateRequest,
} from "@/features/admin/orchestration/types/orchestration";

type UsePutPromptSettingsMutationOptions = {
  onSuccess?: (data: PromptSettingsResponse) => void;
  onError?: () => void;
};

export const usePutPromptSettingsMutation = (
  options?: UsePutPromptSettingsMutationOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PromptSettingsUpdateRequest) => putPromptSettings(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(orchestrationQueryKeys.promptSettings(), data);
      options?.onSuccess?.(data);
    },
    onError: () => {
      options?.onError?.();
    },
  });
};
