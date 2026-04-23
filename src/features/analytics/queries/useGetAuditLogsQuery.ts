import { useQuery } from "@tanstack/react-query";

import { getAuditLogs } from "@/features/analytics/api/analytics";
import { analyticsQueryKeys } from "@/features/analytics/queries/analyticsQueryKeys";
import type { GetAuditLogsRequest } from "@/features/analytics/types/analytics";

export const useGetAuditLogsQuery = (params: GetAuditLogsRequest) =>
  useQuery({
    queryKey: analyticsQueryKeys.auditLogs(params),
    queryFn: () => getAuditLogs(params.domain, params.limit),
    staleTime: 5 * 60 * 1000,
  });
