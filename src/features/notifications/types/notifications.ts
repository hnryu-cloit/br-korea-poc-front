export type ApiNotification = {
  id: number;
  category: string;
  title: string;
  description: string;
  created_at: string;
  unread: boolean;
  link_to?: string | null;
  link_state?: Record<string, unknown> | null;
};

export type NotificationListResponse = {
  items: ApiNotification[];
  unread_count: number;
};
