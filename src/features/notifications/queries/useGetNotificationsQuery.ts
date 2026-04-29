import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "@/features/notifications/api/notifications";
import { notificationQueryKeys } from "@/features/notifications/queries/notificationQueryKeys";

export const useGetNotificationsQuery = () =>
  useQuery({
    queryKey: notificationQueryKeys.list(),
    queryFn: getNotifications,
    staleTime: 30 * 60_000,
    refetchInterval: 30 * 60_000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
