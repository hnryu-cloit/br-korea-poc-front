import axiosInstance from "@/services/axiosInstance";

import type {
  PromptSettingsResponse,
  PromptSettingsUpdateRequest,
} from "@/features/admin/orchestration/types/orchestration";

export async function getPromptSettings() {
  const response = await axiosInstance.get<PromptSettingsResponse>("/api/settings/prompt");
  return response.data;
}

export async function putPromptSettings(payload: PromptSettingsUpdateRequest) {
  const response = await axiosInstance.put<PromptSettingsResponse>("/api/settings/prompt", payload);
  return response.data;
}
