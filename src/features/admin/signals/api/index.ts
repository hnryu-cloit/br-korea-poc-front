import { axiosInstance } from "@/services/axiosInstance";

import type { SignalsResponse } from "@/features/admin/signals/types";

export function fetchSignals() {
  return axiosInstance.get<SignalsResponse>("/api/signals");
}
