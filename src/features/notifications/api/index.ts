
import type { NotificationListResponse } from "@/features/notifications/types";
import axiosInstance from "@/services/axiosInstance";

export function fetchNotifications() {
  return axiosInstance.get<NotificationListResponse>("/api/notifications");
}
