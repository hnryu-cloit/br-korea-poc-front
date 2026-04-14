import axiosInstance from "@/services/axiosInstance";

import type { HQInspectionResponse } from "@/features/admin/hq-inspection/types/hq-inspection";

export async function getHQInspection() {
  const response = await axiosInstance.get<HQInspectionResponse>("/api/hq/inspection");
  return response.data;
}
