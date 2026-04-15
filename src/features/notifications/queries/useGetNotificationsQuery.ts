import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "@/features/notifications/api/notifications";
import { notificationQueryKeys } from "@/features/notifications/queries/notificationQueryKeys";

export const useGetNotificationsQuery = () =>
  useQuery({
    queryKey: notificationQueryKeys.list(),
    queryFn: getNotifications,
    refetchInterval: 30_000,
    staleTime: 30_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
