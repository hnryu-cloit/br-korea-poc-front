import { QUERY_TYPE_LABEL } from "@/features/analytics/constants/analytics-screen";
import type { AuditLogEntry } from "@/features/analytics/types/analytics";
import type { QueryCategory } from "@/features/analytics/types/analytics-screen";

const getLogQueryCategory = (log: AuditLogEntry): QueryCategory | null => {
  const meta = log.metadata as Record<string, unknown>;
  const queryType = typeof meta?.query_type === "string" ? meta.query_type : null;
  if (!queryType) return null;

  const label = QUERY_TYPE_LABEL[queryType];
  switch (label) {
    case "FAQ":
    case "데이터 조회":
    case "분석":
    case "민감정보":
      return label;
    default:
      return null;
  }
};

export const filterLogsByCategory = (logs: AuditLogEntry[], activeCategory: QueryCategory) => {
  if (activeCategory === "전체") return logs;
  return logs.filter((log) => getLogQueryCategory(log) === activeCategory);
};

export const calculateLogStats = (logs: AuditLogEntry[]) => {
  const sqlCount = logs.filter((log) => log.route === "stub_repository").length;
  const sqlPct = logs.length > 0 ? Math.round((sqlCount / logs.length) * 100) : 0;
  const blockedCount = logs.filter((log) => log.route === "policy_block").length;
  return { sqlPct, blockedCount };
};

export const getLogQueryLabel = (log: AuditLogEntry) => getLogQueryCategory(log);

export const getLogPromptText = (log: AuditLogEntry) => {
  const meta = log.metadata as Record<string, unknown>;
  return typeof meta?.prompt === "string" ? meta.prompt : log.message;
};
