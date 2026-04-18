export const orchestrationQueryKeys = {
  all: ["orchestration"] as const,
  auditLogs: (limit = 50) =>
    [...orchestrationQueryKeys.all, "audit-logs", limit] as const,
  promptSettings: () => [...orchestrationQueryKeys.all, "prompt-settings"] as const,
};
