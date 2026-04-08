import { axiosInstance } from "@/services/axiosInstance";

import type { HQCoachingResponse } from "@/features/admin/hq-coaching/types";

export function fetchHQCoaching() {
  return axiosInstance.get<HQCoachingResponse>("/api/hq/coaching");
}
