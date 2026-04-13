import { axiosInstance } from "@/services/axiosInstance";

import type { NotificationListResponse } from "@/features/notifications/types";

export function fetchNotifications() {
  return axiosInstance.get<NotificationListResponse>("/api/notifications");
}
