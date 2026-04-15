const NOTIFICATION_QUERY_ROOT = ["notifications"] as const;

export const notificationQueryKeys = {
  all: NOTIFICATION_QUERY_ROOT,
  list: () => [...NOTIFICATION_QUERY_ROOT, "list"] as const,
};
