import { useQuery } from "@tanstack/react-query";

import { getAuditLogs } from "@/features/analytics/api/analytics";
import { orchestrationQueryKeys } from "@/features/admin/orchestration/queries/orchestrationQueryKeys";

export const useGetOrchestrationAuditLogsQuery = (limit = 50) =>
  useQuery({
    queryKey: orchestrationQueryKeys.auditLogs(limit),
    queryFn: () => getAuditLogs(undefined, limit),
    refetchInterval: 10_000,
  });
