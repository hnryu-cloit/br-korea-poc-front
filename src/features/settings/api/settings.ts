import axiosInstance from "@/services/axiosInstance";

import type {
  PromptSettingsResponse,
  PromptSettingsUpdateRequest,
} from "@/features/settings/types/settings";

export async function getPromptSettings(): Promise<PromptSettingsResponse> {
  const response = await axiosInstance.get<PromptSettingsResponse>("/api/settings/prompt");
  return response.data;
}

export async function putPromptSettings(
  payload: PromptSettingsUpdateRequest,
): Promise<PromptSettingsResponse> {
  const response = await axiosInstance.put<PromptSettingsResponse>("/api/settings/prompt", payload);
  return response.data;
}
