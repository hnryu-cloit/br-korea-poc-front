import axiosInstance from "@/services/axiosInstance";

import type { HQInspectionResponse } from "@/features/admin/hq-inspection/types";

export async function fetchHQInspection() {
  const response = await axiosInstance.get<HQInspectionResponse>("/api/hq/inspection");
  return response.data;
}
