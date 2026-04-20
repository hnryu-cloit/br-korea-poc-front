import { useQuery } from "@tanstack/react-query";

import { getPromptSettings } from "@/features/settings/api/settings";
import { settingsQueryKeys } from "@/features/settings/queries/settingsQueryKeys";

export const useGetPromptSettingsQuery = () =>
  useQuery({
    queryKey: settingsQueryKeys.prompt(),
    queryFn: getPromptSettings,
  });
