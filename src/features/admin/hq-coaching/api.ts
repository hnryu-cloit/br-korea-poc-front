import axiosInstance from "@/services/axiosInstance";

import type { HQCoachingResponse } from "@/features/admin/hq-coaching/types";

export async function fetchHQCoaching() {
  const response = await axiosInstance.get<HQCoachingResponse>("/api/hq/coaching");
  return response.data;
}
