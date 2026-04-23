import type { AuditLogEntry } from "@/features/analytics/types/analytics";

export function getQueryFromMetadata(entry: AuditLogEntry): string {
  const meta = entry.metadata as Record<string, unknown>;
  if (typeof meta?.prompt === "string") return meta.prompt;
  return entry.message;
}

export function getPillToneClass(tone?: "blue" | "amber" | "red"): string {
  if (tone === "amber") return "bg-amber-500";
  if (tone === "blue") return "bg-blue-500";
  return "bg-red-500";
}

export function getAgentBadgeClass(agent: string): string {
  if (agent === "생산관리") return "bg-emerald-100 text-emerald-700";
  if (agent === "주문관리") return "bg-blue-100 text-blue-700";
  if (agent === "매출관리") return "bg-orange-100 text-orange-700";
  return "bg-slate-100 text-slate-600";
}
