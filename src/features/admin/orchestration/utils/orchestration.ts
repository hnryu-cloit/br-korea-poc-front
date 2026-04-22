import type { AuditLogEntry } from "@/features/analytics/types/analytics";

export function getQueryFromMetadata(entry: AuditLogEntry): string {
  const meta = entry.metadata as Record<string, unknown>;
  if (typeof meta?.prompt === "string") return meta.prompt;
  return entry.message;
}