import axiosInstance from "@/services/axiosInstance";

import type { SignalsResponse } from "@/features/admin/signals/types/signals";

export async function getSignals() {
  const response = await axiosInstance.get<SignalsResponse>("/api/signals");
  return response.data;
}
