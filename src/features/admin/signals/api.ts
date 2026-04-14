import axiosInstance from "@/services/axiosInstance";

import type { SignalsResponse } from "@/features/admin/signals/types";

export async function fetchSignals() {
  const response = await axiosInstance.get<SignalsResponse>("/api/signals");
  return response.data;
}
