import { useMemo, useState } from "react";

import { MOCK_AUDIT_ROWS } from "@/features/admin/orchestration/mockdata/mock-orchestration";
import type { AuditResult, OrchestrationAgent } from "@/features/admin/orchestration/types/orchestration";

export function useAuditPanel() {
  const [searchText, setSearchText] = useState("");
  const [resultFilter, setResultFilter] = useState<"" | AuditResult>("");
  const [agentFilter, setAgentFilter] = useState<"" | OrchestrationAgent>("");

  const filteredRows = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return MOCK_AUDIT_ROWS.filter((row) => {
      const matchedSearch =
        q.length === 0 || `${row.id} ${row.user} ${row.agent} ${row.route}`.toLowerCase().includes(q);
      const matchedResult = resultFilter === "" || row.result === resultFilter;
      const matchedAgent = agentFilter === "" || row.agent === agentFilter;
      return matchedSearch && matchedResult && matchedAgent;
    });
  }, [agentFilter, resultFilter, searchText]);

  const allowedCount = MOCK_AUDIT_ROWS.filter((row) => row.result === "허용").length;
  const blockedCount = MOCK_AUDIT_ROWS.filter((row) => row.result === "차단").length;

  return {
    filteredRows,
    searchText,
    setSearchText,
    resultFilter,
    setResultFilter,
    agentFilter,
    setAgentFilter,
    allowedCount,
    blockedCount,
  };
}
