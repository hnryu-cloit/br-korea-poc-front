import { useQuery } from "@tanstack/react-query";

import { getPromptSettings } from "@/features/admin/orchestration/api/orchestration";
import { orchestrationQueryKeys } from "@/features/admin/orchestration/queries/orchestrationQueryKeys";

export const useGetPromptSettingsQuery = () =>
  useQuery({
    queryKey: orchestrationQueryKeys.promptSettings(),
    queryFn: getPromptSettings,
    retry: 1,
  });
