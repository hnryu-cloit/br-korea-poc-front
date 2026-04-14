import type { NotificationListResponse } from "@/features/notifications/types/notifications";
import axiosInstance from "@/services/axiosInstance";

export async function getNotifications() {
  const response = await axiosInstance.get<NotificationListResponse>("/api/notifications");
  return response.data;
}
