import axiosInstance from "@/services/axiosInstance";

import type { HQCoachingResponse } from "@/features/admin/hq-coaching/types/hq-coaching";

export async function getHQCoaching() {
  const response = await axiosInstance.get<HQCoachingResponse>("/api/hq/coaching");
  return response.data;
}
