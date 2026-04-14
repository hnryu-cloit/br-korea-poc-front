import type { NotificationListResponse } from "@/features/notifications/types";
import axiosInstance from "@/services/axiosInstance";

export async function fetchNotifications() {
  const response = await axiosInstance.get<NotificationListResponse>("/api/notifications");
  return response.data;
}
