import { useMutation, useQueryClient } from "@tanstack/react-query";

import { putPromptSettings } from "@/features/settings/api/settings";
import { settingsQueryKeys } from "@/features/settings/queries/settingsQueryKeys";

export const usePutPromptSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putPromptSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.prompt() });
    },
  });
};