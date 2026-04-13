import { axiosInstance } from "@/services/axiosInstance";

import type { HQInspectionResponse } from "@/features/admin/hq-inspection/types";

export function fetchHQInspection() {
  return axiosInstance.get<HQInspectionResponse>("/api/hq/inspection");
}
